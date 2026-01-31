
import React, { useState, useEffect } from 'react';
import { Clock, Trash2, RotateCcw, X, AlertCircle } from 'lucide-react';
import { HistoryItem, getHistory, deleteHistoryItem, clearHistory } from '../services/historyService';

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onRestore: (item: HistoryItem) => void;
    lang: 'zh' | 'en';
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onRestore, lang }) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const t = {
        zh: {
            title: '创作历史',
            empty: '暂无历史记录',
            emptyDesc: '您的创作历史将显示在这里',
            restore: '恢复',
            delete: '删除',
            clearAll: '清空全部',
            confirmClear: '确认清空所有历史记录？',
            cancel: '取消',
            confirm: '确认',
            itemsCount: '条记录',
            justNow: '刚刚',
            minutesAgo: '分钟前',
            hoursAgo: '小时前',
            daysAgo: '天前',
        },
        en: {
            title: 'History',
            empty: 'No History',
            emptyDesc: 'Your creation history will appear here',
            restore: 'Restore',
            delete: 'Delete',
            clearAll: 'Clear All',
            confirmClear: 'Clear all history?',
            cancel: 'Cancel',
            confirm: 'Confirm',
            itemsCount: 'items',
            justNow: 'Just now',
            minutesAgo: 'min ago',
            hoursAgo: 'hrs ago',
            daysAgo: 'days ago',
        }
    }[lang];

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = () => {
        setHistory(getHistory());
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deleteHistoryItem(id);
        loadHistory();
    };

    const handleRestore = (item: HistoryItem) => {
        onRestore(item);
        handleClose();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // 与动画时长匹配
    };

    const handleClearAll = () => {
        clearHistory();
        setHistory([]);
        setShowClearConfirm(false);
    };

    const formatTime = (timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return t.justNow;
        if (minutes < 60) return `${minutes} ${t.minutesAgo}`;
        if (hours < 24) return `${hours} ${t.hoursAgo}`;
        return `${days} ${t.daysAgo}`;
    };

    const getPreviewText = (text: string): string => {
        const firstLine = text.split('\n')[0];
        return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
    };

    if (!isOpen && !isClosing) return null;

    return (
        <>
            {/* 背景遮罩 */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={handleClose}
            />

            {/* 侧边面板 */}
            <div className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[201] flex flex-col ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Clock size={20} className="text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-tight">{t.title}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {history.length} {t.itemsCount}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Clock size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                                {t.empty}
                            </h3>
                            <p className="text-xs text-slate-300">{t.emptyDesc}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-all cursor-pointer border border-slate-100 hover:border-slate-200"
                                    onClick={() => handleRestore(item)}
                                >
                                    {/* 预览内容 */}
                                    <div className="mb-3">
                                        <div
                                            className="text-sm font-medium text-slate-700 mb-2 line-clamp-2"
                                            style={{
                                                color: item.style.palette.text,
                                                fontFamily: 'inherit'
                                            }}
                                        >
                                            {getPreviewText(item.text)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>{formatTime(item.timestamp)}</span>
                                            <span>•</span>
                                            <span>{item.aspectRatio}</span>
                                            <span>•</span>
                                            <span>{item.mood}</span>
                                        </div>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRestore(item);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
                                        >
                                            <RotateCcw size={12} />
                                            {t.restore}
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="px-3 py-2 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-all border border-slate-200"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* 颜色指示器 */}
                                    <div
                                        className="absolute top-4 right-4 w-8 h-8 rounded-lg shadow-sm border-2 border-white"
                                        style={{ backgroundColor: item.style.palette.background }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 底部操作栏 */}
                {history.length > 0 && (
                    <div className="p-6 border-t border-slate-200 bg-slate-50">
                        {showClearConfirm ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                                    <span className="text-xs font-medium">{t.confirmClear}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowClearConfirm(false)}
                                        className="flex-1 px-4 py-3 bg-white text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-all border border-slate-200"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-600 transition-all"
                                    >
                                        {t.confirm}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 transition-all border border-slate-200"
                            >
                                <Trash2 size={14} />
                                {t.clearAll}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default HistoryPanel;
