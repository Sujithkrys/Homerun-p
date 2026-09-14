export function detectLanguage(text: string): string | null {
  const normalized = text.toLowerCase().trim();
  
  // Convert to words, removing punctuation
  const words = normalized.replace(/[.,!?]/g, "").split(/\s+/);
  
  let scores = {
    "Telugu": 0,
    "Hindi": 0,
    "Kannada": 0,
    "Tamil": 0,
    "English": 0
  };

  const dictionaries = {
    "Telugu": ["naku", "naaku", "kavali", "ledu", "kavala", "em", "enti", "cheppu", "undhi", "undi", "chala", "meeku", "kuda", "chestha", "chesthanu", "istara", "iddam"],
    "Hindi": ["mujhe", "chahiye", "hai", "kya", "nahi", "aur", "sab", "kaise", "aapko", "mera", "humein", "hum", "dikhao", "batao", "dedo", "wale"],
    "Kannada": ["nanage", "beku", "illa", "enu", "idhe", "hege", "kodi", "nimage", "beka", "ide", "kodu", "madu", "maadi"],
    "Tamil": ["enakku", "venum", "illa", "enna", "kodu", "irukku", "ungalukku", "venuma", "kudu", "panni"],
    "English": ["show", "me", "some", "actually", "instead", "need", "want", "price", "how", "much", "delivered", "site", "my", "yes", "no", "what", "please", "cost"]
  };

  for (const word of words) {
    for (const [lang, dict] of Object.entries(dictionaries)) {
      if (dict.includes(word)) {
        scores[lang as keyof typeof scores] += 1;
      }
    }
  }

  // Find the language with the highest score
  let maxScore = 0;
  let detectedLang: string | null = null;
  let tie = false;

  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
      tie = false;
    } else if (score === maxScore && score > 0) {
      tie = true;
    }
  }

  // Only return a detected language if it has a clear winner and at least 1 keyword match
  if (maxScore >= 1 && !tie) {
    return detectedLang;
  }
  
  // Ambiguous or no matches
  return null;
}
