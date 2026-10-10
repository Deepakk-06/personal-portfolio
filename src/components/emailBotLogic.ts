export type Mood = "idle" | "confused" | "close" | "typo" | "happy";

const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahho.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloook.com": "outlook.com",
};
const VALID = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface BotState {
  mood: Mood;
  msg: string;
  fix?: string;
}

export function analyse(value: string): BotState {
  const v = value.trim();
  if (!v) return { mood: "idle", msg: "" };
  if (/^[+\d][\d\s\-()]{6,}$/.test(v)) {
    return { mood: "confused", msg: "Looks like a phone number. I need an email." };
  }
  if (!v.includes("@")) {
    return { mood: "confused", msg: "Psst... emails need an @, like you@gmail.com" };
  }
  const at = v.indexOf("@");
  const local = v.slice(0, at);
  const domain = v.slice(at + 1);
  if (!local) return { mood: "confused", msg: "Add your name before the @" };
  if (!domain) return { mood: "close", msg: "Almost! Add the part after @, like gmail.com" };
  const fixed = TYPOS[domain.toLowerCase()];
  if (fixed) return { mood: "typo", msg: `Did you mean ${local}@${fixed}?`, fix: `${local}@${fixed}` };
  if (!domain.includes(".")) return { mood: "close", msg: "Almost! Missing the .com part" };
  if (!VALID.test(v)) return { mood: "close", msg: "Hmm, that doesn't look right yet" };
  return { mood: "happy", msg: "Looks good. Waka waka." };
}
