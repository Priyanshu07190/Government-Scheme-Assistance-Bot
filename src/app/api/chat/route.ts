import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Scheme from '@/models/Scheme';
import Thread from '@/models/Thread';
import { extractProfileFromText, buildQueryFromProfile } from '@/lib/matcher';
import { generateBotResponse } from '@/lib/gemini';
import { crawlAndStoreSchemesForQuery } from '@/lib/dynamic-crawler';
import { UserProfile } from '@/types';

/**
 * PRODUCTION-GRADE INTENT CLASSIFIER
 * 
 * Determines whether the user is making a scheme-related query that warrants
 * a database search, or is just having a casual conversation.
 * 
 * ONLY triggers database search when the user's message is clearly requesting
 * information about: government schemes, eligibility, benefits, subsidies,
 * loans, welfare programs, documents required, or how to apply.
 * 
 * Returns true (casual/conversational) for:
 * - Greetings and farewells
 * - Health updates, emotional expression ("I am sick", "I feel sad")
 * - Personal status updates ("I am tired", "I'm bored")
 * - Simple acknowledgments and reactions
 * - General small-talk not related to government schemes
 * - Questions about the bot itself ("who are you", "what can you do")
 * - Expressions of sentiment ("nice", "cool", "wow", "great")
 * - Common Hindi/regional language casual phrases
 */
function isConversational(message: string): boolean {
  const raw = message.toLowerCase().trim();
  const clean = raw.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ');

  // ── 1. EXACT MATCH – single-word or very short phrases ──────────────────
  const exactCasuals = new Set([
    // English greetings/farewells
    'hi', 'hey', 'hello', 'howdy', 'heya', 'yo', 'sup', 'hiya', 'bye', 'goodbye',
    'good morning', 'good afternoon', 'good evening', 'good night', 'good day',
    'see you', 'see ya', 'take care', 'later', 'cya', 'ttyl',
    // Acknowledgments
    'ok', 'okay', 'ok ok', 'okay okay', 'got it', 'understood', 'alright', 'noted',
    'sure', 'right', 'yep', 'yes', 'nope', 'no', 'nah', 'yup', 'yeah',
    // Reactions / sentiment
    'thanks', 'thank you', 'thank you so much', 'thanks a lot', 'thx', 'ty',
    'welcome', 'nice', 'cool', 'great', 'awesome', 'wow', 'amazing', 'wonderful',
    'good', 'bad', 'sad', 'happy', 'fine', 'wonderful', 'perfect', 'excellent',
    // Hindi / Hinglish
    'namaste', 'namaskar', 'pranam', 'dhanyawad', 'shukriya', 'shukriyaa',
    'theek hai', 'bilkul', 'haan', 'nahi', 'achha', 'acha', 'aacha', 'bahut acha',
    'sahi hai', 'bas', 'kya baat', 'wah', 'shabash', 'badiya', 'alvida',
    'helo', 'helo ji', 'jai hind', 'jai bharat',
  ]);
  if (exactCasuals.has(clean)) return true;

  // ── 2. PERSONAL HEALTH / EMOTIONAL STATE EXPRESSIONS ────────────────────
  // These sentences are personal updates that have NOTHING to do with schemes.
  const healthEmotionPatterns = [
    /^i (am|'m|feel|felt|was|have been|had been)\s+(sick|ill|unwell|fever|tired|exhausted|fine|ok|okay|sad|happy|worried|bored|depressed|stressed|anxious|nervous|angry|upset|frustrated|confused|lost|lonely|hungry|full|sleepy|dizzy|weak|better|worse|not feeling well)/,
    /^i (am|'m)\s+(not well|feeling (sick|ill|bad|down|low|off|not good|under the weather))/,
    /^(feeling|feel)\s+(sick|ill|tired|sad|happy|bored|fine|good|bad|okay|down|low|stressed|anxious|worried)/,
    /^(my|i have a?)\s+(fever|headache|cold|cough|flu|pain|stomach ache|toothache|injury)/,
    /^i (just|have just|have recently)?\s*(ate|eaten|woke up|slept|exercised|went|came|returned)/,
    /^(how are you|how r u|how do you do|how's it going|hows it going|what's up|whats up|what's new|whats new)/,
    /^(who are you|what are you|what is this|what can you do|tell me about yourself)/,
    /^(good|bad|great|okay|fine|not good|not bad|alright|doing well)/,
    /^(i was|i'm just|just|just wanted|just checking|just saying|just asking)/,
  ];
  for (const pattern of healthEmotionPatterns) {
    if (pattern.test(raw)) return true;
  }

  // ── 3. SCHEME KEYWORDS/INTENT CHECK ─────────────────────────────────────
  const schemeKeywords = [
    'scheme', 'yojana', 'yojna', 'yojanayein', 'yojanaen', 'yojane', 'yojnaen',
    'subsidy', 'subsidies', 'choot', 'subsidi',
    'pension', 'pensions', 'penchan',
    'scholarship', 'scholarships', 'chatravriti', 'chatravrittiyar',
    'welfare', 'kalyan', 'aid',
    'mudra', 'pmkisan', 'pm kisan', 'pm-kisan', 'ayushman', 'ujjwala', 'pmay', 'sukanya', 'jan dhan', 'jandhan',
    'ration card', 'rationcard', 'ration', 'rashan',
    'stipend', 'stipends',
    'loan', 'loans', 'rin', 'karz',
    'insurance', 'bima', 'beema',
    'eligibility', 'eligible', 'patrata', 'patra', 'qualify',
    'apply', 'application', 'aavedan',
    'benefits', 'benefit', 'faida', 'fayda',
    'csc', 'common service center', 'jan seva kendra', 'seva kendra', 'grama one', 'maha e-seva', 'e-mitra', 'meeseva', 'kendra', 'pincode'
  ];

  const hasSchemeKeyword = schemeKeywords.some(keyword => raw.includes(keyword));

  // If there are absolutely no scheme search keywords or intents, treat it as casual conversation.
  if (!hasSchemeKeyword) {
    return true;
  }

  // ── 4. MESSAGES CLEARLY NOT SCHEME QUERIES (KEYWORD BLOCKLIST) ──────────
  const nonSchemePatterns = [
    /^(lol|lmao|haha|hehe|rofl|omg|brb|afk|wtf|idk|imo|fyi|tbh|smh)/,
    /^(test|testing|1 2 3|hello world|ping|pong)/,
    /\b(love you|miss you|hate you|like you|care for you)\b/,
    /^(happy birthday|congratulations|congrats|best wishes|good luck)/,
    /^(sorry|excuse me|pardon|my bad|apologies)/,
  ];
  for (const pattern of nonSchemePatterns) {
    if (pattern.test(raw)) return true;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const { message, profile: clientProfile, language = 'en', threadId, aadhaarNumber } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, error: 'Message content is required.' }, { status: 400 });
    }

    // 1. Use production-grade intent classifier to decide if this is casual chat
    const isCasual = isConversational(message);

    // 2. Extract profile parameters from user message using NLP/Regex
    const extractedProfile = isCasual ? {} : extractProfileFromText(message);

    // 3. Merge client-provided profile with extracted profile
    const mergedProfile: UserProfile = {
      age: clientProfile?.age ?? extractedProfile.age,
      gender: clientProfile?.gender ?? extractedProfile.gender,
      category: clientProfile?.category ?? extractedProfile.category,
      income: clientProfile?.income ?? extractedProfile.income,
      occupation: clientProfile?.occupation ?? extractedProfile.occupation,
      state: clientProfile?.state ?? extractedProfile.state,
    };

    // 4. Connect to database
    await dbConnect();

    // 5. Search database & dynamically crawl open schemes matching requirements
    let schemes: any[] = [];
    if (!isCasual) {
      const query = buildQueryFromProfile(mergedProfile);
      if (Object.keys(query).length > 0) {
        schemes = await Scheme.find(query).limit(10);
      }

      // Fallback: keyword text search if profile matching found nothing
      if (schemes.length === 0) {
        schemes = await Scheme.find({
          $text: { $search: message }
        }).limit(5);
      }

      // DYNAMIC SCHEME DISCOVERY & DATABASE EXPANSION:
      // Fetch open government schemes tailored to this citizen query,
      // and permanently upsert them into MongoDB Atlas (never deletes existing schemes!)
      try {
        const newlyCrawled = await crawlAndStoreSchemesForQuery(message, mergedProfile);
        if (newlyCrawled && newlyCrawled.length > 0) {
          const existingNames = new Set(schemes.map((s: any) => s.name));
          for (const ns of newlyCrawled) {
            if (!existingNames.has(ns.name)) {
              schemes.push(ns);
              existingNames.add(ns.name);
            }
          }
        }
      } catch (crawlErr) {
        console.warn('Live scheme crawler encountered an issue, proceeding with existing schemes:', crawlErr);
      }
    }


    // 5. Generate conversational bot response
    const botText = await generateBotResponse({
      userMessage: message,
      matchingSchemes: schemes,
      profile: mergedProfile,
      language
    });

    // Create client message representations
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: timestampStr
    };

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botText,
      schemes: schemes,
      timestamp: timestampStr
    };

    let activeThreadId = threadId;
    let savedMessages = [userMsg, botMsg];

    // If Aadhaar number is provided, persist to database
    if (aadhaarNumber) {
      if (!activeThreadId) {
        // Create new Thread
        const cleanTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
        const newThread = await Thread.create({
          aadhaarNumber,
          title: cleanTitle,
          messages: [userMsg, botMsg],
          profile: mergedProfile
        });
        activeThreadId = newThread._id.toString();
        savedMessages = newThread.messages;
      } else {
        // Append to existing Thread
        const thread = await Thread.findOne({ _id: activeThreadId, aadhaarNumber });
        if (thread) {
          thread.messages.push(userMsg);
          thread.messages.push(botMsg);
          thread.profile = {
            ...thread.profile,
            ...mergedProfile
          };
          // Rename title if it was initialized generically
          if (thread.title === 'New Chat' || thread.title === 'नया चैट') {
            thread.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
          }
          await thread.save();
          savedMessages = thread.messages;
        }
      }
    }

    // 6. Return response, matched schemes, and updated profile variables
    return NextResponse.json({
      success: true,
      response: botText,
      profile: mergedProfile,
      schemes,
      threadId: activeThreadId,
      messages: savedMessages
    }, { status: 200 });

  } catch (error: any) {
    console.error('Chat API endpoint failure:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred while processing your message.'
    }, { status: 500 });
  }
}

