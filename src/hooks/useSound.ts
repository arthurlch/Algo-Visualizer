import { useCallback, useEffect, useState } from 'react';
import { stopSound } from '../utils/stop_sound';
import { playSound } from '../utils/play_sound';

const useSound = (
  filePath: string,
): {
  play: () => void;
  stop: () => void;
  audioObject: HTMLAudioElement | null;
} => {
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);

  const play = (): void => {
    const audio = playSound(filePath);
    setAudioObject(audio);
  };

  const stop = useCallback(() => {
    if (audioObject !== null) {
      stopSound(audioObject);
      setAudioObject(null);
    }
  }, [audioObject]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [audioObject, stop]);

  return { play, stop, audioObject };
};

export { useSound };
