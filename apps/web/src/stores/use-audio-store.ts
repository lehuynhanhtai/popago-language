import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AudioState {
  isMuted: boolean;
  soundEffectsVolume: number;
  voiceVolume: number;
  autoPlayPronunciation: boolean;
  toggleMute: () => void;
  setSoundEffectsVolume: (volume: number) => void;
  setVoiceVolume: (volume: number) => void;
  toggleAutoPlayPronunciation: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      isMuted: false,
      soundEffectsVolume: 0.8,
      voiceVolume: 1.0,
      autoPlayPronunciation: true,
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setSoundEffectsVolume: (volume) =>
        set({ soundEffectsVolume: Math.max(0, Math.min(1, volume)) }),
      setVoiceVolume: (volume) =>
        set({ voiceVolume: Math.max(0, Math.min(1, volume)) }),
      toggleAutoPlayPronunciation: () =>
        set((state) => ({ autoPlayPronunciation: !state.autoPlayPronunciation })),
    }),
    {
      name: "popago-audio-settings",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
