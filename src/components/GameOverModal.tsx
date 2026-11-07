import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { GameStatus, PieceColor } from '../types/chess';
import { Trophy, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  status: GameStatus;
  winner: PieceColor | null;
  onNewGame: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  status,
  winner,
  onNewGame,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && winner) {
      // Fire celebratory confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: winner === 'red' ? ['#ef4444', '#f59e0b', '#fee2e2'] : ['#f59e0b', '#78716c', '#ffffff'],
      });
    }
  }, [isOpen, winner]);

  if (!isOpen || status === 'playing' || status === 'check') return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-stone-900 border border-amber-600/60 rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(217,119,6,0.25)] space-y-4">
        {/* Glow halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 flex items-center justify-center border-4 border-stone-900 shadow-xl">
          <Trophy className="w-12 h-12 text-stone-950 fill-stone-950/20" />
        </div>

        <div className="pt-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> Kết Thúc Ván Cờ
          </span>

          <h2 className="mt-3 text-2xl font-black text-stone-100 tracking-wide font-calligraphy">
            {winner === 'red' ? (
              <span className="text-red-400">QUÂN ĐỎ TOÀN THẮNG</span>
            ) : winner === 'black' ? (
              <span className="text-amber-300">QUÂN ĐEN TOÀN THẮNG</span>
            ) : (
              <span className="text-stone-300">HÒA CỜ</span>
            )}
          </h2>

          <p className="mt-1 text-xs text-stone-400">
            {status === 'checkmate' && 'Chiếu bí — Đối phương không còn nước đi hợp lệ!'}
            {status === 'stalemate' && 'Hết nước đi — Bên bị vây khốn không còn nước đi!'}
            {status === 'resigned' && 'Đối phương đã nhận thua!'}
            {status === 'draw' && 'Hai bên bất phân thắng bại!'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={onNewGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-700 hover:brightness-110 text-white font-bold text-sm tracking-wide shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Bắt Đầu Ván Mới
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-stone-700"
          >
            <Eye className="w-4 h-4" /> Xem Lại Thế Cờ
          </button>
        </div>
      </div>
    </div>
  );
};
