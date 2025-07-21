import { storage } from './storage';
import { Palace } from '../types';
import { v4 as uuidv4 } from 'uuid';

const KEY = 'palaces';

function getStored(): Palace[] {
  const data = storage.getString(KEY);
  return data ? JSON.parse(data) : [];
}

function saveStored(palaces: Palace[]) {
  storage.set(KEY, JSON.stringify(palaces));
}

export function getAll(): Palace[] {
  return getStored();
}

export function create(name: string): Palace {
  const palace: Palace = { id: uuidv4(), name };
  const palaces = [...getStored(), palace];
  saveStored(palaces);
  return palace;
}
