import { create } from 'zustand';

const useEpisodesStore = create((set) => ({
  episodes: [],
  addEpisodes: (newEpisodes) =>
    set((state) => ({
      episodes: [...state.episodes, ...newEpisodes],
    })),
}));

export default useEpisodesStore;
