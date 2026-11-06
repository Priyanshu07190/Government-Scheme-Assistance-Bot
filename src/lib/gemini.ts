import { Scheme, UserProfile } from '../types';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

interface ResponseOptions {
  userMessage: string;
  matchingSchemes: Scheme[];
  profile: UserProfile;
  language: 'en' | 'hi';
}

/**
 * Fallback response generator (used when API Key is missing or request fails)
 * Uses the same comprehensive intent detection as the API route classifier.
 */
function generateFallbackResponse({ userMessage, matchingSchemes, profile, language }: ResponseOptions): string {
  const isHindi = language === 'hi';
  const raw = userMessage.toLowerCase().trim();
  const clean = raw.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '').replace(/\s+/g, ' ').trim();

  // Comprehensive casual/personal pattern detection (mirrors API route classifier)
  const isCasual = (() => {
    const exactCasuals = new Set([
      'hi', 'hey', 'hello', 'howdy', 'yo', 'sup', 'hiya', 'bye', 'goodbye',
      'good morning', 'good afternoon', 'good evening', 'good night',
      'ok', 'okay', 'got it', 'alright', 'sure', 'yes', 'no', 'nah', 'yep', 'yeah',
      'thanks', 'thank you', 'thx', 'welcome', 'nice', 'cool', 'great', 'awesome',
      'wow', 'amazing', 'good', 'bad', 'sad', 'happy', 'fine', 'perfect', 'excellent',
      'namaste', 'namaskar', 'pranam', 'dhanyawad', 'shukriya',
      'theek hai', 'bilkul', 'haan', 'nahi', 'achha', 'acha', 'wah', 'shabash', 'badiya',
    ]);
    if (exactCasuals.has(clean)) return true;

    const casualPatterns = [
      /^i (am|'m|feel|felt|was|have been)\s+(sick|ill|unwell|fever|tired|exhausted|fine|sad|happy|worried|bored|depressed|stressed|anxious|angry|upset|confused|lonely|hungry|sleepy|dizzy|weak|better|worse)/,
      /^i (am|'m)\s+(not well|feeling (sick|ill|bad|down|low|not good))/,
      /^(feeling|feel)\s+(sick|ill|tired|sad|happy|bored|fine|good|bad|okay|down|stressed)/,
      /^(my|i have a?)\s+(fever|headache|cold|cough|flu|pain|stomach ache|injury)/,
      /^(how are you|how r u|what's up|whats up|how's it going|hows it going)/,
      /^(who are you|what are you|what can you do|tell me about yourself)/,
      /^(sorry|excuse me|pardon|my bad|apologies)/,
      /^(lol|lmao|haha|hehe|rofl|omg|idk|tbh)/,
      /^(test|testing|ping|pong)/,
      /^(happy birthday|congratulations|congrats|best wishes|good luck)/,
    ];
    return casualPatterns.some(p => p.test(raw));
  })();

  // Warmly handle personal/casual messages
  if (isCasual) {
    // Specifically handle health/emotional expressions empathetically
    const isHealthRelated = /\b(sick|ill|fever|pain|tired|unwell|cold|cough|flu|headache|not feeling well|under the weather)\b/.test(raw);
    if (isHealthRelated) {
      if (isHindi) {
        return 'आशा है आप जल्द ठीक हो जाएं! 🙏 जब भी आप ठीक महसूस करें, मैं आपको सरकारी स्वास्थ्य योजनाओं जैसे आयुष्मान भारत के बारे में जानकारी देने के लिए यहाँ हूँ।';
      }
      return 'I hope you feel better soon! 🙏 Whenever you\'re ready, I can help you explore government health welfare schemes like Ayushman Bharat that might support you.';
    }

    if (isHindi) {
      return 'नमस्ते! मैं आपका सरकारी योजना सहायक हूँ। कृपया मुझे बताएं कि आप किस योजना के बारे में जानना चाहते हैं या अपनी पात्रता जाँचने के लिए विवरण साझा करें।';
    }
    return 'Hello! I\'m your Government Scheme Assistant. Feel free to ask me about any government scheme, or share your details so I can help you discover what you qualify for.';
  }

  if (matchingSchemes.length === 0) {
    if (isHindi) {
      return `आपके प्रोफाइल (आयु: ${profile.age || 'लागू नहीं'}, आय: ${profile.income ? `₹${profile.income}` : 'लागू नहीं'}, राज्य: ${profile.state || 'सभी'}, श्रेणी: ${profile.category || 'सभी'}) के आधार पर, कोई उपयुक्त योजना नहीं मिली। अधिक जानकारी जैसे आयु, राज्य, आय या जाति श्रेणी साझा करें।`;
    }
    return `Based on your profile (Age: ${profile.age || 'N/A'}, Income: ${profile.income ? `₹${profile.income}` : 'N/A'}, State: ${profile.state || 'All'}, Category: ${profile.category || 'All'}), no matching schemes were found. Please try sharing more details like your age, state, income, or social category.`;
  }


  let text = '';
  if (isHindi) {
    text = `नमस्ते! आपकी पात्रता के आधार पर, यहाँ **${matchingSchemes.length}** योजनाएं पाई गईं जो आपके लिए उपयुक्त हैं:\n\n`;
    matchingSchemes.forEach((s) => {
      const translation = s.language?.hi;
      const name = translation?.name || s.name;
      const desc = translation?.description || s.description;
      const benefits = translation?.benefits || s.benefits;
      const docs = translation?.documents || s.documents;

      text += `### 📄 [${name}](${s.applicationUrl})\n`;
      text += `**${translation?.fullName || s.fullName}**\n\n`;
      text += `* **विवरण:** ${desc}\n`;
      text += `* **लाभ:** ${benefits}\n`;
      text += `* **आवश्यक दस्तावेज़:** ${docs.join(', ')}\n`;
      text += `* 🔗 **आवेदन करने का लिंक:** [यहाँ क्लिक करें](${s.applicationUrl})\n\n---\n\n`;
    });
  } else {
    text = `Hello! Based on your eligibility criteria, I found **${matchingSchemes.length}** schemes for you:\n\n`;
    matchingSchemes.forEach((s) => {
      text += `### 📄 [${s.name}](${s.applicationUrl})\n`;
      text += `**${s.fullName}**\n\n`;
      text += `* **Description:** ${s.description}\n`;
      text += `* **Benefits:** ${s.benefits}\n`;
      text += `* **Required Documents:** ${s.documents.join(', ')}\n`;
      text += `* 🔗 **Apply Link:** [Official Portal](${s.applicationUrl})\n\n---\n\n`;
    });
  }

  return text;
}

/**
 * Generates conversational response using NVIDIA NIM (Llama 3.1 70B Instruct).
 * Automatically falls back to deterministic markdown strings if API keys are not ready.
 */
export async function generateBotResponse(options: ResponseOptions): Promise<string> {
  const { userMessage, matchingSchemes, profile, language } = options;
  const isHindi = language === 'hi';

  if (!NVIDIA_API_KEY) {
    console.log('NVIDIA API Key missing - running in local fallback mode');
    return generateFallbackResponse(options);
  }

  // Format context data for the model prompt
  const schemesContext = matchingSchemes.map((s, idx) => {
    const translation = s.language?.hi;
    return `
Scheme #${idx + 1}:
Name: ${isHindi && translation ? translation.name : s.name}
Full Name: ${isHindi && translation ? translation.fullName : s.fullName}
Description: ${isHindi && translation ? translation.description : s.description}
Benefits: ${isHindi && translation ? translation.benefits : s.benefits}
Required Documents: ${(isHindi && translation ? translation.documents : s.documents).join(', ')}
Official Portal URL: ${s.applicationUrl}
    `.trim();
  }).join('\n\n');

  const systemInstructions = `
You are GovScheme Assist — a friendly, empathetic, conversational AI assistant built specifically to help Indian citizens discover government welfare schemes they qualify for.

USER PROFILE DATA VISIBILITY:
• You HAVE direct, secure access to the user's eligibility profile details (synced securely from Aadhaar records). This data is displayed below.
• If the user asks about their profile, what you know about them, or details like their age, gender, state, income, caste/category, or occupation, you MUST read the profile object from the context below and tell them exactly what is recorded.
• NEVER claim "I don't have access to your personal data" or "I cannot read your profile." You do have access, and it is fully shared with you for this session.

You operate in TWO distinct modes depending on what the user says. You MUST identify the correct mode before responding:

═══════════════════════════════════════════════════
MODE 1 — CASUAL CONVERSATION (NO SCHEME SEARCH)
═══════════════════════════════════════════════════
Activate this mode when the user's message is ANY of the following:
• Simple greetings: "hi", "hello", "namaste", "hey", "good morning" etc.
• Health or emotional expressions: "I am sick", "I have a fever", "I feel tired", "I'm bored", "I'm sad", "I'm not feeling well", "I'm stressed" — these are PERSONAL UPDATES, not scheme queries.
• Questions about the bot itself: "who are you?", "what can you do?", "how do you work?"
• Simple acknowledgments: "ok", "thanks", "got it", "understood", "nice", "cool", "wow", "great"
• Expressions of gratitude or farewell: "thank you", "bye", "see you"
• Personal chat or small-talk that does NOT mention schemes, eligibility, welfare, or government programs

RESPONSE RULES FOR MODE 1:
✅ Respond warmly and naturally like a helpful assistant
✅ If the user says "I am sick" — show empathy, say "I hope you feel better soon!" and mention you are here to help with government welfare schemes
✅ NEVER list any schemes, cards, or benefits in Mode 1 — even if the user's registered profile might match some
✅ NEVER ask "would you like me to search for schemes?" in every casual reply — only offer it occasionally when contextually appropriate
✅ Keep responses SHORT (1-3 sentences). Do not make essays out of casual messages.

═══════════════════════════════════════════════════
MODE 2 — SCHEME ASSISTANCE (DATABASE QUERY MODE)
═══════════════════════════════════════════════════
Activate this mode ONLY when the user clearly wants scheme information, such as:
• Mentioning government programs: "PM-Kisan", "Mudra loan", "Ayushman Bharat", "scholarship", "ration card", "yojana" etc.
• Asking about eligibility: "am I eligible for...?", "what schemes can I get?", "schemes for farmers"
• Providing profile details intending to find schemes: "I am a 30-year-old farmer from Karnataka with ₹80,000 income, what schemes apply?"
• Asking how to apply: "how do I apply for PM-Kisan?", "what documents do I need?"
• Asking about benefits: "what is the benefit of Ujjwala Yojana?"
• Asking about offline help or Common Service Centers (CSC / Jan Seva Kendra): explain that citizens can visit their nearest Common Service Center (CSC) / Jan Seva Kendra for biometric e-KYC, Aadhaar linking, and offline submissions. Tell them they can switch to the **📍 Seva Kendra** tab in the sidebar to view centers near their Pincode with direct contact details and Google Maps directions.

RESPONSE RULES FOR MODE 2:
✅ Use the matching schemes context provided below to answer
✅ For each eligible scheme you mention, ALWAYS include its official portal URL as a clickable markdown link
✅ Highlight key benefits and required documents
✅ If no matching schemes are found, politely ask for more details (age, state, income, category, occupation) to refine the search
✅ Provide clear, structured, professional responses
✅ NEVER fabricate scheme names or URLs — use ONLY the context provided

═══════════════════════════════════════════════════
GENERAL RULES (APPLY TO BOTH MODES)
═══════════════════════════════════════════════════
• Language: Always respond in ${isHindi ? 'Hindi (हिंदी)' : 'English'}. If the user writes in Hindi, respond in Hindi.
• Tone: Warm, empathetic, professional. Never robotic. Never lecture the user.
• Never copy-paste the user's message back to them unnecessarily.
• If the user's profile is known: ${JSON.stringify(profile)}
• Matching schemes context (USE ONLY THESE — do not fabricate): ${schemesContext || 'None found for this query.'}
  `.trim();


  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3.5-bolt-e4b',
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: `User message: "${userMessage}"\n\nMatching schemes context:\n${schemesContext}` }
        ],
        temperature: 0.2,
        max_tokens: 1024
      }),
      next: { revalidate: 0 } // Bypass Next.js cache for completions
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API response error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const botText = data?.choices?.[0]?.message?.content;

    if (botText) {
      return botText.trim();
    }
    throw new Error('Empty response from NVIDIA NIM model');
  } catch (error: any) {
    console.error('NVIDIA API call failed, using fallback:', error);
    return generateFallbackResponse(options);
  }
}
