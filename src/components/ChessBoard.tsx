import React from 'react';
import type { Board, Piece, PieceTheme, Position } from '../types/chess';
import { PieceComponent } from './PieceComponent';

interface ChessBoardProps {
  board: Board;
  selectedPos: Position | null;
  validMoves: Position[];
  lastMove: { from: Position; to: Position } | null;
  kingInCheckPos: Position | null;
  isFlipped: boolean;
  theme: PieceTheme;
  showViSubtitle: boolean;
  onSquareClick: (pos: Position) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selectedPos,
  validMoves,
  lastMove,
  kingInCheckPos,
  isFlipped,
  theme,
  showViSubtitle,
  onSquareClick,
}) => {
  // Convert logical (r, c) to visual position percentages
  const getCoords = (r: number, c: number) => {
    const vr = isFlipped ? 9 - r : r;
    const vc = isFlipped ? 8 - c : c;
    return {
      left: `${((50 + vc * 100) / 900) * 100}%`,
      top: `${((50 + vr * 100) / 1000) * 100}%`,
    };
  };

  // Render corner cross marks
  const renderCrossMark = (r: number, c: number) => {
    const cx = 50 + c * 100;
    const cy = 50 + r * 100;
    const offset = 5;
    const len = 8;
    const d: string[] = [];

    // Left corners
    if (c > 0) {
      // top-left
      d.push(`M ${cx - offset - len} ${cy - offset} L ${cx - offset} ${cy - offset} L ${cx - offset} ${cy - offset - len}`);
      // bottom-left
      d.push(`M ${cx - offset - len} ${cy + offset} L ${cx - offset} ${cy + offset} L ${cx - offset} ${cy + offset + len}`);
    }

    // Right corners
    if (c < 8) {
      // top-right
      d.push(`M ${cx + offset + len} ${cy - offset} L ${cx + offset} ${cy - offset} L ${cx + offset} ${cy - offset - len}`);
      // bottom-right
      d.push(`M ${cx + offset + len} ${cy + offset} L ${cx + offset} ${cy + offset} L ${cx + offset} ${cy + offset + len}`);
    }

    return (
      <path
        key={`cross-${r}-${c}`}
        d={d.join(' ')}
        fill="none"
        stroke="#8b5a2b"
        strokeWidth="1.6"
        strokeLinecap="square"
        opacity="0.85"
      />
    );
  };

  // Star cross marks positions
  const crossPoints = [
    // Black Cannons
    [2, 1], [2, 7],
    // Black Pawns
    [3, 0], [3, 2], [3, 4], [3, 6], [3, 8],
    // Red Pawns
    [6, 0], [6, 2], [6, 4], [6, 6], [6, 8],
    // Red Cannons
    [7, 1], [7, 7],
  ];

  // Coordinates labels (1 to 9)
  const redCols = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
  const blackCols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="relative w-full max-w-[620px] aspect-[9/10] mx-auto select-none p-2 sm:p-3 rounded-2xl bg-[#2a1d13] wood-board-shadow border-4 border-[#523317]">
      {/* Outer wooden bevel framing */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#deb881] via-[#d09e63] to-[#bc8347] shadow-inner">
        {/* Subtle wood grain texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.5) 100%), repeating-linear-gradient(0deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06) 2px, transparent 2px, transparent 4px)`
          }}
        />

        {/* Board Coordinate Numbers along edges */}
        <div className="absolute top-1 inset-x-0 px-[4.5%] flex justify-between text-[11px] font-bold text-[#693e1b]/70 pointer-events-none">
          {(isFlipped ? redCols : blackCols).map((num, i) => (
            <span key={`top-${i}`} className="w-4 text-center">{num}</span>
          ))}
        </div>
        <div className="absolute bottom-1 inset-x-0 px-[4.5%] flex justify-between text-[11px] font-bold text-[#693e1b]/70 pointer-events-none">
          {(isFlipped ? blackCols : redCols).map((num, i) => (
            <span key={`bot-${i}`} className="w-4 text-center">{num}</span>
          ))}
        </div>

        {/* SVG Board Grid Lines */}
        <svg
          viewBox="0 0 900 1000"
          className="w-full h-full"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          {/* Outer Border (double line) */}
          <rect
            x="42"
            y="42"
            width="816"
            height="916"
            fill="none"
            stroke="#693e1b"
            strokeWidth="3.5"
            rx="4"
          />
          <rect
            x="50"
            y="50"
            width="800"
            height="900"
            fill="none"
            stroke="#693e1b"
            strokeWidth="2"
          />

          {/* 10 Horizontal lines */}
          {Array.from({ length: 10 }).map((_, r) => (
            <line
              key={`h-${r}`}
              x1="50"
              y1={50 + r * 100}
              x2="850"
              y2={50 + r * 100}
              stroke="#693e1b"
              strokeWidth="1.6"
            />
          ))}

          {/* Vertical lines: Left and right outer borders continuous */}
          <line x1="50" y1="50" x2="50" y2="950" stroke="#693e1b" strokeWidth="2" />
          <line x1="850" y1="50" x2="850" y2="950" stroke="#693e1b" strokeWidth="2" />

          {/* 7 Inner Vertical lines: Top camp (rows 0 to 4) */}
          {Array.from({ length: 7 }).map((_, i) => {
            const x = 150 + i * 100;
            return (
              <line
                key={`v-top-${i}`}
                x1={x}
                y1="50"
                x2={x}
                y2="450"
                stroke="#693e1b"
                strokeWidth="1.6"
              />
            );
          })}

          {/* 7 Inner Vertical lines: Bottom camp (rows 5 to 9) */}
          {Array.from({ length: 7 }).map((_, i) => {
            const x = 150 + i * 100;
            return (
              <line
                key={`v-bot-${i}`}
                x1={x}
                y1="550"
                x2={x}
                y2="950"
                stroke="#693e1b"
                strokeWidth="1.6"
              />
            );
          })}

          {/* Palaces Diagonal Crosses */}
          {/* Top Palace (Black) */}
          <line x1="350" y1="50" x2="550" y2="250" stroke="#693e1b" strokeWidth="1.6" />
          <line x1="550" y1="50" x2="350" y2="250" stroke="#693e1b" strokeWidth="1.6" />

          {/* Bottom Palace (Red) */}
          <line x1="350" y1="750" x2="550" y2="950" stroke="#693e1b" strokeWidth="1.6" />
          <line x1="550" y1="750" x2="350" y2="950" stroke="#693e1b" strokeWidth="1.6" />

          {/* River Text: 楚河 (Sở Hà) - 漢界 (Hán Giới) */}
          <g className="font-calligraphy font-black text-3xl" fill="#784722" opacity="0.8">
            <text x="210" y="515" textAnchor="middle" dominantBaseline="middle" letterSpacing="24">
              楚河
            </text>
            <text x="690" y="515" textAnchor="middle" dominantBaseline="middle" letterSpacing="24">
              漢界
            </text>
          </g>

          {/* Star cross marks at cannon and soldier spots */}
          {crossPoints.map(([r, c]) => renderCrossMark(r, c))}

          {/* Last Move Path Arrow / Line Indicator */}
          {lastMove && (() => {
            const fromP = getCoords(lastMove.from.r, lastMove.from.c);
            const toP = getCoords(lastMove.to.r, lastMove.to.c);
            const fx = parseFloat(fromP.left) * 9;
            const fy = parseFloat(fromP.top) * 10;
            const tx = parseFloat(toP.left) * 9;
            const ty = parseFloat(toP.top) * 10;
            return (
              <line
                x1={fx}
                y1={fy}
                x2={tx}
                y2={ty}
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                opacity="0.75"
                strokeLinecap="round"
              />
            );
          })()}
        </svg>

        {/* Clickable Intersection Grid Points & Indicators */}
        <div className="absolute inset-0">
          {Array.from({ length: 10 }).map((_, r) =>
            Array.from({ length: 9 }).map((_, c) => {
              const coords = getCoords(r, c);
              const piece: Piece | null = board[r][c];
              const isSelected = selectedPos?.r === r && selectedPos?.c === c;
              const isValidMove = validMoves.some(m => m.r === r && m.c === c);
              const isKingCheck = kingInCheckPos?.r === r && kingInCheckPos?.c === c;
              const isLastOrigin = lastMove?.from.r === r && lastMove?.from.c === c;
              const isLastTarget = lastMove?.to.r === r && lastMove?.to.c === c;

              return (
                <div
                  key={`cell-${r}-${c}`}
                  style={{
                    position: 'absolute',
                    left: coords.left,
                    top: coords.top,
                    transform: 'translate(-50%, -50%)',
                    width: '9.4%',
                    height: '8.46%',
                  }}
                  onClick={() => onSquareClick({ r, c })}
                  className="relative flex items-center justify-center cursor-pointer group select-none"
                >
                  {/* Subtle target hotspot for clicking empty intersections */}
                  <div className="absolute inset-0 rounded-full group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

                  {/* Last Move origin highlight */}
                  {isLastOrigin && !piece && (
                    <div className="absolute w-7 h-7 rounded-full border-2 border-amber-500/60 bg-amber-400/15 animate-pulse pointer-events-none" />
                  )}

                  {/* Empty square valid move dot */}
                  {isValidMove && !piece && (
                    <div className="absolute z-20 pointer-events-none flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-600/90 ring-4 ring-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                    </div>
                  )}

                  {/* Occupied square valid capture target: Tactical Red Lock-on Reticle & Glow */}
                  {isValidMove && piece && (
                    <div className="absolute -inset-1.5 z-30 pointer-events-none flex items-center justify-center">
                      {/* Pulsing red ring aura */}
                      <div className="absolute inset-0 rounded-full border-2 border-red-500 bg-red-500/20 shadow-[0_0_18px_rgba(239,68,68,0.8)] animate-pulse" />
                      
                      {/* 4 Tactical Corner Brackets */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-400 rounded-tl-sm" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-400 rounded-tr-sm" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-400 rounded-bl-sm" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-400 rounded-br-sm" />
                    </div>
                  )}

                  {/* The Chess Piece */}
                  {piece && (
                    <div className="w-full h-full relative z-10 flex items-center justify-center">
                      <PieceComponent
                        piece={piece}
                        isSelected={isSelected}
                        isInCheck={isKingCheck}
                        isLastMoveTarget={isLastTarget}
                        theme={theme}
                        showViSubtitle={showViSubtitle}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
