import React from 'react';
import type { GameSettings, PieceTheme } from '../types/chess';
import { 
  RotateCcw, 
  RotateCw, 
  ArrowLeftRight, 
  Play, 
  Volume2, 
  VolumeX, 
  Settings, 
  Sparkles, 
  X,
  Compass
} from 'lucide-react';

interface GameControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  isFlipped: boolean;
  isFreeMode: boolean;
  settings: GameSettings;
  onUndo: () => void;
  onRedo: () => void;
  onFlipBoard: () => void;
  onNewGame: () => void;
  onToggleFreeMode: () => void;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  canUndo,
  canRedo,
  isFreeMode,
  settings,
  onUndo,
  onRedo,
  onFlipBoard,
  onNewGame,
  onToggleFreeMode,
  onUpdateSettings,
  isSettingsOpen,
  setIsSettingsOpen,
}) => {
  return (
    <>
      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* New Game */}
          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 shadow-md transition-all active:scale-95"
            title="Bắt đầu ván mới"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ván Mới</span>
          </button>

          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 transition-all active:scale-95 border border-stone-700/60"
            title="Rút lại nước vừa đi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hoàn Tác</span>
          </button>

          {/* Redo */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 transition-all active:scale-95 border border-stone-700/60"
            title="Đi lại nước tiếp theo"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đi Tiếp</span>
          </button>

          {/* Flip Board */}
          <button
            onClick={onFlipBoard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all active:scale-95 border border-stone-700/60"
            title="Xoay hướng nhìn bàn cờ (Đỏ / Đen)"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xoay Bàn</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Free Practice Mode Toggle */}
          <button
            onClick={onToggleFreeMode}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all active:scale-95 border
              ${
                isFreeMode
                  ? 'bg-amber-600/30 border-amber-500 text-amber-300 ring-1 ring-amber-400'
                  : 'bg-stone-800 hover:bg-stone-700 border-stone-700/60 text-stone-300'
              }
            `}
            title="Chế độ tự do: Cho phép đi bất kỳ quân nào không theo lượt để thử nghiệm thế cờ"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Luyện Tự Do</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/60 transition-colors"
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-500" />
            )}
          </button>

          {/* Settings Modal Open */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/60 transition-colors"
            title="Cài đặt giao diện & bàn cờ"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-2xl p-5 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-stone-100">Cài Đặt Kỳ Đạo</h2>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-sm">
              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Phong Cách Quân Cờ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'classic-wood', name: 'Gỗ Mộc Cổ', bg: 'bg-[#cf9c58] text-[#3d230e]' },
                    { id: 'imperial-jade', name: 'Ngọc Bích', bg: 'bg-[#a7f3d0] text-[#064e3b]' },
                    { id: 'modern-dark', name: 'Hắc Kim', bg: 'bg-[#27272a] text-[#f43f5e]' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => onUpdateSettings({ theme: t.id as PieceTheme })}
                      className={`
                        p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all
                        ${
                          settings.theme === t.id
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                            : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:bg-stone-800'
                        }
                      `}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-calligraphy text-xs ${t.bg}`}>
                        帥
                      </div>
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Setting */}
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Thời Gian Mỗi Bên
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: 0, label: 'Tự do' },
                    { val: 10, label: '10 phút' },
                    { val: 15, label: '15 phút' },
                    { val: 20, label: '20 phút' },
                  ].map(t => (
                    <button
                      key={t.val}
                      onClick={() => onUpdateSettings({ timerMinutes: t.val })}
                      className={`
                        py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all
                        ${
                          settings.timerMinutes === t.val
                            ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                            : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:bg-stone-800'
                        }
                      `}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-stone-800/80">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-stone-300">Hiển thị gợi ý nước đi (chấm xanh)</span>
                  <input
                    type="checkbox"
                    checked={settings.showHints}
                    onChange={e => onUpdateSettings({ showHints: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-stone-300">Tự động xoay bàn theo lượt đi</span>
                  <input
                    type="checkbox"
                    checked={settings.flipOnTurn}
                    onChange={e => onUpdateSettings({ flipOnTurn: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-stone-300">Âm thanh gõ cờ & chuông báo</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
