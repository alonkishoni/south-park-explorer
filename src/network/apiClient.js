import axios from 'axios';
import { API_URL, CHARACTERS_PATH, EPISODES_PATH } from '../consts/consts.js';

export async function getEpisodes(page) {
  return await axios.get(`${API_URL}/${EPISODES_PATH}?page=${page}`);
}

export async function getCharacters(page) {
  return await axios.get(`${API_URL}/${CHARACTERS_PATH}?page=${page}`);
}
