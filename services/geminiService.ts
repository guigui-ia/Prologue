
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MissionRequest, MissionResponse, GroundingSource } from "../types";

// Update SYSTEM_INSTRUCTION with placeholders for the replace call
const SYSTEM_INSTRUCTION = `
Tu es "L'Encrier", l'IA de PROLOGUE. Tu es l'Architecte Phygital.
Ta mission est de scénariser un rendez-vous qui mêle l'application et le COFFRET PHYSIQUE.

DIRECTIVES PHYSIQUES:
- Tu DOIS mentionner une enveloppe spécifique à ouvrir (Enveloppe A, B, C ou D selon la Phase).
- Phase 1: Enveloppe A (L'Esquisse).
- Phase 2: Enveloppe B (Les Fondations).
- Phase 3: Enveloppe C (L'Architecture).
- Phase 4: Enveloppe D (La Reliure).
- Mentionne qu'ils doivent utiliser les cartes et le stylo du coffret.

GAMIFICATION:
1. Mission Principale: Collective, immersive.
2. Défi Bonus: Un challenge fun pour gagner un "Sceau d'Argent".
3. Mission Secrète A & B: Actions discrètes, parfois liées aux cartes physiques.

TON & STYLE:
Mystérieux, élégant. Utilise les prénoms ({{P1}} et {{P2}}). Respecte le budget.
Le format de sortie est strictement JSON.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    titre_episode: { type: Type.STRING },
    vibe_generale: { type: Type.STRING },
    lieu_type: { type: Type.STRING },
    instruction_coffret: { type: Type.STRING, description: "Quelle enveloppe ou objet du coffret ouvrir maintenant" },
    mission_description: { type: Type.STRING },
    defi_bonus: { type: Type.STRING },
    mission_secrete_a: { type: Type.STRING },
    mission_secrete_b: { type: Type.STRING },
    dress_code: { type: Type.STRING },
    icebreaker_audio: { type: Type.STRING },
    specific_place_name: { type: Type.STRING }
  },
  required: ["titre_episode", "vibe_generale", "lieu_type", "instruction_coffret", "mission_description", "defi_bonus", "mission_secrete_a", "mission_secrete_b", "dress_code", "icebreaker_audio"]
};

// Helper to decode base64 raw PCM
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decode audio data for PCM output
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateMission = async (request: MissionRequest): Promise<MissionResponse> => {
  // Always create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Génère l'épisode pour le duo "${request.duo.duoName}".
  Membres: ${request.duo.p1.name} (A) et ${request.duo.p2.name} (B).
  Phase: ${request.duo.currentPhase}.
  Lieu: ${request.city}. Météo: ${request.weather}. Budget: ${request.duo.budget}.
  
  Important: Dis-leur quelle enveloppe du coffret ouvrir pour commencer le jeu de cartes.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION.replace('{{P1}}', request.duo.p1.name).replace('{{P2}}', request.duo.p2.name),
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        // Removed googleSearch tool as it can interfere with strict JSON parsing requirements according to guidelines
      },
    });

    const text = response.text;
    if (!text) throw new Error("Silence de l'IA...");
    
    const parsed = JSON.parse(text) as MissionResponse;
    // Note: parsed.sources will be empty as search is disabled for JSON stability
    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const speakMission = async (text: string) => {
  // Always create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `D'une voix profonde et posée, lis ceci : ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
};
