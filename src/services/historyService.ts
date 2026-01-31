
import { TextStylePreset, AspectRatio, MoodType, BackgroundConfig } from '../types/index';

export interface HistoryItem {
    id: string;
    timestamp: number;
    text: string;
    style: TextStylePreset;
    aspectRatio: AspectRatio;
    mood: MoodType;
    bgImage: string | null;
    bgConfig: BackgroundConfig;
    customScale: number;
    customLineHeight: number;
    thumbnail?: string;
}

const STORAGE_KEY = 'arttext_history';
const MAX_HISTORY_ITEMS = 20;

export const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>): void => {
    if (typeof window === 'undefined') return;

    try {
        const history = getHistory();
        const newItem: HistoryItem = {
            ...item,
            id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        };

        // 添加到历史记录开头
        history.unshift(newItem);

        // 限制历史记录数量
        if (history.length > MAX_HISTORY_ITEMS) {
            history.splice(MAX_HISTORY_ITEMS);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save history:', error);
    }
};

export const getHistory = (): HistoryItem[] => {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to load history:', error);
        return [];
    }
};

export const deleteHistoryItem = (id: string): void => {
    if (typeof window === 'undefined') return;

    try {
        const history = getHistory();
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete history item:', error);
    }
};

export const clearHistory = (): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
};

export const getHistoryItem = (id: string): HistoryItem | null => {
    const history = getHistory();
    return history.find(item => item.id === id) || null;
};
