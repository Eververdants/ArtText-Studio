import { useEffect } from 'react';

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description: string;
    allowInInput?: boolean; // 是否允许在输入框中触发
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // 检查焦点是否在输入元素上
            const target = event.target as HTMLElement;
            const isInputFocused =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            for (const shortcut of shortcuts) {
                // 如果焦点在输入框且快捷键不允许在输入框中触发，则跳过
                if (isInputFocused && !shortcut.allowInInput) {
                    continue;
                }

                const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
                const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
                const altMatch = shortcut.alt ? event.altKey : !event.altKey;
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

                if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

export const SHORTCUTS = {
    SAVE: { key: 's', ctrl: true, description: 'Save to history', allowInInput: true },
    DOWNLOAD: { key: 'd', ctrl: true, description: 'Download image', allowInInput: true },
    COPY: { key: 'c', ctrl: true, shift: true, description: 'Copy to clipboard', allowInInput: true },
    SHUFFLE: { key: ' ', description: 'Random style', allowInInput: false },
    HISTORY: { key: 'h', ctrl: true, description: 'Open history', allowInInput: true },
    UNDO: { key: 'z', ctrl: true, description: 'Undo', allowInInput: true },
};
