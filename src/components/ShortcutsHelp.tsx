import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
    lang: 'zh' | 'en';
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose, lang }) => {
    const t = {
        zh: {
            title: '键盘快捷键',
            save: '保存到历史',
            download: '下载图片',
            copy: '复制到剪贴板',
            shuffle: '随机风格',
            history: '打开历史记录',
            close: '关闭',
        },
        en: {
            title: 'Keyboard Shortcuts',
            save: 'Save to history',
            download: 'Download image',
            copy: 'Copy to clipboard',
            shuffle: 'Random style',
            history: 'Open history',
            close: 'Close',
        }
    }[lang];

    const shortcuts = [
        { keys: ['Ctrl', 'S'], description: t.save },
        { keys: ['Ctrl', 'D'], description: t.download },
        { keys: ['Ctrl', 'Shift', 'C'], description: t.copy },
        { keys: ['Space'], description: t.shuffle },
        { keys: ['Ctrl', 'H'], description: t.history },
    ];

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] shadow-2xl z-[201] animate-in zoom-in-95 duration-300 p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Keyboard size={20} className="text-slate-600" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-tight">{t.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                        >
                            <span className="text-sm text-slate-600">{shortcut.description}</span>
                            <div className="flex items-center gap-1">
                                {shortcut.keys.map((key, i) => (
                                    <React.Fragment key={i}>
                                        <kbd className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                                            {key}
                                        </kbd>
                                        {i < shortcut.keys.length - 1 && (
                                            <span className="text-slate-400 text-xs mx-1">+</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ShortcutsHelp;
