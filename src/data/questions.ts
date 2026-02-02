export type BlockId = "social" | "speech" | "play" | "sensory" | "daily";

export type Option = { id: string; label: string; score: number };

export type Question = {
  id: string;
  block: BlockId;
  minMonths: number; // inclusive
  maxMonths: number; // inclusive
  text: string;
  options: Option[];
  notes?: string;
};

export const BLOCKS: { id: BlockId; title: string; subtitle: string }[] = [
  { id: "social", title: "Ijtimoiy muloqot", subtitle: "Ko‘zga qarash, ismiga javob, birgalikda e’tibor" },
  { id: "speech", title: "Nutq va til", subtitle: "So‘zlar, iboralar, imo-ishora" },
  { id: "play", title: "O‘yin va xulq", subtitle: "O‘yin turi, takroriy harakatlar, moslashuv" },
  { id: "sensory", title: "Sensor xususiyatlar", subtitle: "Tovush/yorug‘lik/teginishga sezgirlik" },
  { id: "daily", title: "Kundalik hayot", subtitle: "Ovqat, kiyim, rutin, o‘zgarish" },
];

const YES_NO_SOMETIMES: Option[] = showScores();

function showScores(): Option[] {
  return [
    { id: "yes", label: "Ha (ko‘pincha)", score: 0 },
    { id: "sometimes", label: "Ba’zan", score: 1 },
    { id: "no", label: "Ko‘pincha yo‘q", score: 2 },
  ];
}

export const QUESTIONS: Question[] = [
  // Social
  {
    id: "q_social_name_response",
    block: "social",
    minMonths: 18,
    maxMonths: 84,
    text: "Bola ismiga chaqirilganda ko‘pincha javob beradimi?",
    options: YES_NO_SOMETIMES,
  },
  {
    id: "q_social_eye_contact",
    block: "social",
    minMonths: 18,
    maxMonths: 84,
    text: "Bola odatda ko‘zga qarash (eye contact) qiladimi?",
    options: YES_NO_SOMETIMES,
  },

  // Speech
  {
    id: "q_speech_words",
    block: "speech",
    minMonths: 18,
    maxMonths: 84,
    text: "Bolaning so‘z boyligi yoshiga mos rivojlanayaptimi?",
    options: YES_NO_SOMETIMES,
  },
  {
    id: "q_speech_pointing",
    block: "speech",
    minMonths: 18,
    maxMonths: 84,
    text: "Bola xohlagan narsasini ko‘rsatish (barmoq bilan pointing) qiladimi?",
    options: YES_NO_SOMETIMES,
  },

  // Play
  {
    id: "q_play_repetitive",
    block: "play",
    minMonths: 18,
    maxMonths: 84,
    text: "Takroriy harakatlar (masalan, aylanish, qo‘l qoqish) tez-tez kuzatiladimi?",
    options: [
      { id: "often", label: "Ha (tez-tez)", score: 2 },
      { id: "sometimes", label: "Ba’zan", score: 1 },
      { id: "rare", label: "Kamdan-kam / yo‘q", score: 0 },
    ],
  },

  // Sensory
  {
    id: "q_sensory_sound",
    block: "sensory",
    minMonths: 18,
    maxMonths: 84,
    text: "Bola tovushlardan (changyutgich, shovqin) ortiqcha bezovta bo‘ladimi?",
    options: [
      { id: "often", label: "Ha (tez-tez)", score: 2 },
      { id: "sometimes", label: "Ba’zan", score: 1 },
      { id: "no", label: "Yo‘q", score: 0 },
    ],
  },

  // Daily
  {
    id: "q_daily_change",
    block: "daily",
    minMonths: 18,
    maxMonths: 84,
    text: "Rutin o‘zgarishida (yo‘l, ovqat, kiyim) bola juda qiyin qabul qiladimi?",
    options: [
      { id: "often", label: "Ha (tez-tez)", score: 2 },
      { id: "sometimes", label: "Ba’zan", score: 1 },
      { id: "no", label: "Yo‘q", score: 0 },
    ],
  },
];

export function getQuestionsFor(blockId: BlockId, ageMonths: number) {
  return QUESTIONS.filter(
    (q) => q.block === blockId && ageMonths >= q.minMonths && ageMonths <= q.maxMonths
  );
}
