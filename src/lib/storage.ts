export type UserSession = {
  phone?: string;
  parentRole?: "ona" | "ota" | "vasiy" | "boshqa";
  goal?: "shubha" | "tekshiruv" | "tavsiya";
};

export type ChildProfile = {
  ageMonths: number; // 18..84
  gender: "o'g'il" | "qiz";
};

export type Warmup = {
  motherAgePregnancy?: number;
  fatherAge?: number;
  pregnancyFlags?: string[]; // selected
  birthTiming?: "muddatida" | "erta" | "kech" | "bilmayman";
  neonatalFlags?: string[];
  familyFlags?: string[];
  currentConcerns?: string[];
};

export type AnswerMap = Record<string, string>; // questionId -> optionId

const KEY = "autism_demo_state_v1";

export type AppState = {
  session?: UserSession;
  warmup?: Warmup;
  child?: ChildProfile;
  answers?: AnswerMap;
};

export function loadState(): AppState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppState) : {};
  } catch {
    return {};
  }
}

export function saveState(patch: Partial<AppState>) {
  if (typeof window === "undefined") return;
  const current = loadState();
  const next = { ...current, ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function resetState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
