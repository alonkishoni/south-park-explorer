import { create } from 'zustand';

const useCharactersStore = create((set) => ({
  characters: [],
  addCharacters: (newCharacters) =>
    set((state) => ({
      characters: [...state.characters, ...newCharacters],
    })),
}));

export default useCharactersStore;
