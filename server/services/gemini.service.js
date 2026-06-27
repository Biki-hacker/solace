/**
 * Gemini AI service — all Gemini API calls.
 * Models:
 *   - Journal analysis: gemini-1.5-pro-latest (deeper reasoning)
 *   - Chat companion: gemini-1.5-flash-latest (fast conversational)
 *   - Daily suggestion: gemini-1.5-flash-latest (quick, low-latency)
 *
 * Error handling: retry once on invalid JSON, then return sensible fallback.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const JOURNAL_ANALYSIS_PROMPT = (examType, journalContent) => `
You are Solace, an empathetic AI wellness analyst for Indian students preparing for competitive
exams such as ${examType}. Analyze the following journal entry and return ONLY a valid JSON
object with no preamble, no markdown fences, and no text after:
{
  "stressTriggers": ["specific triggers mentioned or implied, max 5"],
  "emotionalTone": "exactly one of: anxious | overwhelmed | frustrated | neutral | hopeful | content | tired | sad",
  "keyThemes": ["max 3 themes"],
  "suggestedActions": [
    "Action 1: specific, exam-context-aware, max 25 words",
    "Action 2: specific, exam-context-aware, max 25 words",
    "Action 3: specific, exam-context-aware, max 25 words"
  ],
  "wellnessScore": <integer from 1 to 10, where 1 is severe distress and 10 is excellent>
}

Journal entry: """${journalContent}"""
`;

const CHAT_SYSTEM_PROMPT = (examType, avgMood, themes, daysRemaining) => `
You are Solace — a warm, perceptive, and emotionally intelligent AI wellness companion
for students preparing for ${examType} in India.

Student context:
- Current average mood this week: ${avgMood} / 5
- Recent stress themes: ${themes}
- Days until exam: ${daysRemaining}

Guidelines:
- Respond warmly, concisely, and conversationally (2-3 short paragraphs maximum)
- Acknowledge feelings first before offering advice
- Tailor advice to the specific pressures of Indian competitive exam culture
- Ask a thoughtful follow-up question to deepen the conversation
- Do not be generic, preachy, or repeat the student's words back verbatim
- Do not use any emoji characters
- If the student expresses self-harm, suicidal thoughts, or extreme hopelessness:
  acknowledge deeply, do NOT minimize, and include:
  "Please reach out to iCall India at 9152987821 or Vandrevala Foundation at 1860-2662-345.
   They are available and want to help."
`;

const DAILY_SUGGESTION_PROMPT = (examType, avgMood, triggers) => `
Student data — Exam: ${examType}, Mood avg this week: ${avgMood}/5,
Recent stress triggers: ${triggers}.

Generate ONE specific, actionable wellness tip tailored to this student's current state.
Keep the suggestion under 55 words. Return ONLY this JSON with no extra text:
{"suggestion": "...", "category": "breathing | journaling | movement | mindset | sleep | social"}
`;

/** Fallback analysis result when Gemini fails */
const FALLBACK_ANALYSIS = {
  stressTriggers: ['General academic pressure'],
  emotionalTone: 'neutral',
  keyThemes: ['Study routine', 'Self-reflection'],
  suggestedActions: [
    'Take a 10-minute walk to clear your mind before your next study session',
    'Write down three things that went well today, no matter how small',
    'Practice the 4-7-8 breathing technique before bed tonight',
  ],
  wellnessScore: 5,
};

/** Fallback daily suggestion */
const FALLBACK_SUGGESTION = {
  suggestion: 'Take a 5-minute break every 45 minutes of study. Step away from your desk, stretch, and take three deep breaths before returning.',
  category: 'mindset',
};

/**
 * Safely parse JSON from Gemini response, handling markdown fences and extra text
 * @param {string} text
 * @returns {object|null}
 */
const safeParseJSON = (text) => {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

/**
 * Analyze a journal entry using Gemini 1.5 Pro
 * @param {string} content - Journal text
 * @param {string} examType - Student's exam type
 * @returns {Promise<object>} Analysis result
 */
const analyzeJournal = async (content, examType) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const prompt = JOURNAL_ANALYSIS_PROMPT(examType, content);

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let parsed = safeParseJSON(text);

    if (!parsed || !parsed.wellnessScore) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('First Gemini parse failed, retrying with explicit prompt');
      }
      const retryResult = await model.generateContent(
        prompt + '\n\nIMPORTANT: Return ONLY the raw JSON object. No markdown, no explanation.'
      );
      parsed = safeParseJSON(retryResult.response.text());
    }

    if (!parsed || !parsed.wellnessScore) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Gemini retry failed, returning fallback');
      }
      return FALLBACK_ANALYSIS;
    }

    return {
      stressTriggers: parsed.stressTriggers || FALLBACK_ANALYSIS.stressTriggers,
      emotionalTone: parsed.emotionalTone || FALLBACK_ANALYSIS.emotionalTone,
      keyThemes: parsed.keyThemes || FALLBACK_ANALYSIS.keyThemes,
      suggestedActions: parsed.suggestedActions || FALLBACK_ANALYSIS.suggestedActions,
      wellnessScore: Math.min(10, Math.max(1, parseInt(parsed.wellnessScore) || 5)),
    };
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Gemini analyzeJournal error:', err.message);
    }
    return FALLBACK_ANALYSIS;
  }
};

/**
 * Chat with the AI companion using Gemini 1.5 Flash
 * @param {string} message - User's message
 * @param {Array} history - Previous messages in the session
 * @param {object} context - Student context (examType, avgMood, themes, daysRemaining)
 * @returns {Promise<string>} AI reply
 */
const chat = async (message, history = [], context = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const systemPrompt = CHAT_SYSTEM_PROMPT(
      context.examType || 'competitive exams',
      context.recentMoodAvg || 3,
      (context.recentTriggers || []).join(', ') || 'general exam stress',
      context.daysRemaining || 'unknown'
    );

    const chatHistory = history.map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System instructions: ' + systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I am Solace, ready to support you through your exam preparation journey. How can I help you today?' }] },
        ...chatHistory,
      ],
    });

    const result = await chatSession.sendMessage(message);
    return result.response.text();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Gemini chat error:', err.message);
    }
    return 'I understand you are going through a lot right now. While I am having a brief moment of difficulty connecting, please know that your feelings are valid. Try taking a few deep breaths, and I will be back with you shortly.';
  }
};

/**
 * Generate a daily wellness suggestion using Gemini 1.5 Flash
 * @param {string} examType
 * @param {number[]} recentMoods
 * @param {string[]} recentTriggers
 * @returns {Promise<object>} { suggestion, category }
 */
const dailySuggestion = async (examType, recentMoods = [], recentTriggers = []) => {
  try {
    const avgMood =
      recentMoods.length > 0
        ? (recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length).toFixed(1)
        : '3.0';

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = DAILY_SUGGESTION_PROMPT(
      examType,
      avgMood,
      recentTriggers.join(', ') || 'general exam stress'
    );

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = safeParseJSON(text);

    if (parsed && parsed.suggestion) {
      return {
        suggestion: parsed.suggestion,
        category: parsed.category || 'mindset',
      };
    }

    return FALLBACK_SUGGESTION;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Gemini dailySuggestion error:', err.message);
    }
    return FALLBACK_SUGGESTION;
  }
};

module.exports = { analyzeJournal, chat, dailySuggestion };
