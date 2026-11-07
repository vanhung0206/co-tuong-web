import React from 'react';
import type { Piece, PieceColor, PieceTheme } from '../types/chess';
import { PIECE_SYMBOLS } from '../utils/xiangqiRules';
import { Clock, AlertTriangle, Shield, Swords } from 'lucide-react';

interface PlayerCardProps {
  color: PieceColor;
  isCurrentTurn: boolean;
  isInCheck: boolean;
  timeLeft: number | null; // in seconds, null if unlimited
  capturedPieces: Piece[];
  theme: PieceTheme;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  color,
  isCurrentTurn,
  isInCheck,
  timeLeft,
  capturedPieces,
}) => {
  const isRed = color === 'red';

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Group captured pieces by type
  const pieceCounts = capturedPieces.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      className={`
        relative rounded-xl p-3.5 transition-all duration-300 backdrop-blur-md
        border ${
          isCurrentTurn
            ? isRed
              ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.25)] ring-1 ring-red-400/50'
              : 'border-amber-500/80 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
            : 'border-stone-800 bg-stone-900/60 shadow-lg'
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Player Avatar & Name */}
        <div className="flex items-center gap-3">
          <div
            className={`
              w-11 h-11 rounded-full flex items-center justify-center font-calligraphy text-2xl font-black
              border-2 shadow-md shrink-0
              ${
                isRed
                  ? 'bg-gradient-to-br from-red-600 to-red-900 border-red-400 text-amber-100 shadow-red-900/40'
                  : 'bg-gradient-to-br from-stone-700 to-stone-900 border-stone-500 text-stone-200 shadow-stone-950/60'
              }
            `}
          >
            {isRed ? '帥' : '將'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide text-stone-100">
                {isRed ? 'Tiên Thủ (Đỏ)' : 'Hậu Thủ (Đen)'}
              </span>
              {isCurrentTurn && (
                <span
                  className={`
                    px-2 py-0.5 text-[11px] font-semibold rounded-full uppercase tracking-wider
                    animate-pulse flex items-center gap-1
                    ${
                      isRed
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }
                  `}
                >
                  <Swords className="w-3 h-3 inline" /> Lượt đi
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              {isRed ? 'Đi trước (Quân Đỏ)' : 'Đi sau (Quân Đen)'}
            </p>
          </div>
        </div>

        {/* Right: Timer & Check status */}
        <div className="flex items-center gap-3">
          {isInCheck && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/30 border border-red-500 text-red-300 font-bold text-xs animate-bounce shadow-md">
              <AlertTriangle className="w-3.5 h-3.5" />
              CHIẾU TƯỚNG!
            </div>
          )}

          {timeLeft !== null && (
            <div
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold border
                ${
                  timeLeft < 60
                    ? 'bg-red-950/70 text-red-300 border-red-700 animate-pulse'
                    : 'bg-stone-950/60 text-stone-200 border-stone-800'
                }
              `}
            >
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Captured Pieces Collection */}
      <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
        <span className="text-stone-400 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-stone-500" /> Quân đã ăn:
        </span>
        <div className="flex flex-wrap gap-1.5 items-center justify-end">
          {capturedPieces.length === 0 ? (
            <span className="text-stone-500 italic text-[11px]">Chưa ăn quân nào</span>
          ) : (
            Object.entries(pieceCounts).map(([type, count]) => {
              const enemyColor = isRed ? 'black' : 'red';
              const sym = PIECE_SYMBOLS[enemyColor][type as keyof typeof PIECE_SYMBOLS['red']];
              return (
                <div
                  key={type}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-800/90 border border-stone-700/80 text-stone-200"
                  title={`${sym.viName} x${count}`}
                >
                  <span
                    className={`font-calligraphy font-black ${
                      enemyColor === 'red' ? 'text-red-400' : 'text-stone-300'
                    }`}
                  >
                    {sym.char}
                  </span>
                  {count > 1 && <span className="text-[10px] text-amber-400 font-bold">x{count}</span>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
