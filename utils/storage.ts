
import { Message, User, Ticket, Suggestion } from '../types';

const STORAGE_KEY = 'nexa_global_db';

interface Database {
  users: Record<string, { id: string; password: string }>;
  messages: Message[];
  tickets: Ticket[];
  suggestions: Suggestion[];
  lastReset: string; // Reset
}

const getInitialDB = (): Database => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return {
    users: {},
    messages: [],
    tickets: [],
    suggestions: [],
    lastReset: new Date().toISOString()
  };
};

export const saveToDB = (data: Partial<Database>) => {
  const current = getInitialDB();
  const updated = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getDB = (): Database => {
  const db = getInitialDB();
  const now = new Date();
  
  // Ini buat Chat Di reset ya wok 
  const lastResetDate = new Date(db.lastReset);
  const resetPoint = new Date();
  resetPoint.setHours(7, 0, 0, 0);

  // Kalau Lewat dari 07.00 Tetap akan di reset ya wok biar aman wok
  if (now >= resetPoint && (lastResetDate < resetPoint)) {
    db.messages = [];
    db.lastReset = new Date().toISOString();
    saveToDB(db);
  }
  
  return db;
};

// Chat channel
export const chatChannel = new BroadcastChannel('nexa_chat_sync');

export const broadcastMessage = (message: Message) => {
  chatChannel.postMessage({ type: 'NEW_MESSAGE', payload: message });
};
