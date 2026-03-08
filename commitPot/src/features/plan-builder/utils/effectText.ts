export const parseEffectSections = (
  effect: string,
  fallbackTitle: string
): { title: string; body: string }[] => {
  const sections = effect
    .split(/[。.]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return null;
      const title = line.slice(0, separatorIndex).trim();
      const body = line.slice(separatorIndex + 1).trim();
      if (!title || !body) return null;
      return { title, body };
    })
    .filter((item): item is { title: string; body: string } => item !== null);

  return sections.length > 0 ? sections : [{ title: fallbackTitle, body: effect }];
};

export const getEffectLead = (effect: string): string => {
  const firstSentence = effect.split(/[。.]/).find((line) => line.trim().length > 0);
  return firstSentence?.trim() || effect;
};
