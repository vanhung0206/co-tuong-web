import React from 'react';
import type { Piece, PieceTheme } from '../types/chess';
import { PIECE_SYMBOLS } from '../utils/xiangqiRules';

interface PieceComponentProps {
  piece: Piece;
  isSelected?: boolean;
  isInCheck?: boolean;
  isLastMoveTarget?: boolean;
  theme?: PieceTheme;
  showViSubtitle?: boolean;
  onClick?: () => void;
  size?: number; // Size in pixels
}

export const PieceComponent: React.FC<PieceComponentProps> = ({
  piece,
  isSelected = false,
  isInCheck = false,
  isLastMoveTarget = false,
  theme = 'classic-wood',
  showViSubtitle = false,
  onClick,
  size,
}) => {
  const isRed = piece.color === 'red';
  const symbolInfo = PIECE_SYMBOLS[piece.color][piece.type];

  // Theme styling definitions
  let containerStyle = '';
  let innerRingStyle = '';
  let textStyle = '';
  let shadowClass = '';

  if (theme === 'classic-wood') {
    containerStyle = isRed
      ? 'bg-gradient-to-b from-[#f7e4be] via-[#ebd09f] to-[#d6ad6b] border-[#915926]'
      : 'bg-gradient-to-b from-[#e8d5b5] via-[#dac096] to-[#bf975e] border-[#5e4325]';
    innerRingStyle = isRed ? 'border-[#b57a3e]' : 'border-[#7a5933]';
    textStyle = isRed
      ? 'text-[#b91c1c] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'
      : 'text-[#1c1917] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]';
    shadowClass = 'piece-shadow';
  } else if (theme === 'imperial-jade') {
    containerStyle = isRed
      ? 'bg-gradient-to-b from-[#ffefd5] via-[#fed7aa] to-[#fdba74] border-[#c2410c]'
      : 'bg-gradient-to-b from-[#d1fae5] via-[#a7f3d0] to-[#6ee7b7] border-[#047857]';
    innerRingStyle = isRed ? 'border-[#ea580c]' : 'border-[#059669]';
    textStyle = isRed ? 'text-[#991b1b]' : 'text-[#064e3b]';
    shadowClass = 'piece-shadow';
  } else {
    // modern-dark
    containerStyle = isRed
      ? 'bg-gradient-to-b from-[#2a1b1b] via-[#3d1a1a] to-[#200f0f] border-[#dc2626]'
      : 'bg-gradient-to-b from-[#242730] via-[#1b1d24] to-[#121318] border-[#64748b]';
    innerRingStyle = isRed ? 'border-[#ef4444]/60' : 'border-[#94a3b8]/60';
    textStyle = isRed ? 'text-[#f87171]' : 'text-[#e2e8f0]';
    shadowClass = 'piece-shadow';
  }

  return (
    <div
      onClick={onClick}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      className={`
        relative select-none cursor-pointer rounded-full border-[2.5px]
        flex items-center justify-center transition-all duration-200 transform
        w-full h-full
        ${containerStyle}
        ${shadowClass}
        ${isSelected ? 'piece-selected-glow z-30 scale-105' : 'hover:scale-[1.03] hover:-translate-y-0.5'}
        ${isInCheck ? 'ring-4 ring-red-500 animate-pulse z-40' : ''}
        ${isLastMoveTarget ? 'ring-2 ring-amber-400/80 ring-offset-2 ring-offset-amber-900/40' : ''}
      `}
      title={`${symbolInfo.viName} (${isRed ? 'Đỏ' : 'Đen'})`}
    >
      {/* Outer concentric decorative ring */}
      <div
        className={`
          absolute inset-[3px] rounded-full border border-dashed opacity-60
          ${innerRingStyle}
        `}
      />

      {/* Subtle 3D convex light reflection */}
      <div className="absolute inset-x-2 top-1 h-[35%] rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      {/* Chinese Calligraphy Character */}
      <span
        className={`
          font-calligraphy font-black text-center leading-none tracking-normal
          text-2xl sm:text-3xl md:text-4xl
          ${textStyle}
        `}
      >
        {symbolInfo.char}
      </span>

      {/* Vietnamese sub-label if enabled */}
      {showViSubtitle && (
        <span
          className={`
            absolute -bottom-1 px-1 py-0.2 rounded text-[9px] font-bold tracking-tight uppercase
            bg-black/80 text-amber-200 backdrop-blur-xs
          `}
        >
          {symbolInfo.short}
        </span>
      )}
    </div>
  );
};
