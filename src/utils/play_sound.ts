export const playSound = (soundFilePath: string): HTMLAudioElement => {
  const audio = new Audio(soundFilePath);
  audio.play().catch((error) => console.error('Audio playback error:', error));
  return audio;
};
