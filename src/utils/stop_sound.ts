export const stopSound = (audioObject: HTMLAudioElement | null): void => {
  console.log('stopSound called');
  if (audioObject) {
    audioObject.pause();
    audioObject.currentTime = 0;
  }
};
