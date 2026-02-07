let narrationTimeout: any = null;

export const playAudio = async (audioEl: HTMLAudioElement) => {
  clearTimeout(narrationTimeout);

  try {
    audioEl.pause();
    audioEl.currentTime = 0;

    narrationTimeout = setTimeout(async () => {
      await audioEl.play();
    }, 200);
  } catch {}
};

export const stopNarration = (audioEl: HTMLAudioElement | null) => {
  clearTimeout(narrationTimeout);

  if (!audioEl) return;

  try {
    audioEl.pause();
    audioEl.currentTime = 0;
  } catch {}
};
