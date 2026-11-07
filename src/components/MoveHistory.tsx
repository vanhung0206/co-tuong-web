import React, { useRef, useEffect, useState } from 'react';
import type { Move } from '../types/chess';
import { ScrollText, Copy, Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex: number;
  onSelectMove: (index: number) => void;
  onResetToCurrent: () => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentMoveIndex,
  onSelectMove,
  onResetToCurrent,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto scroll to bottom when new moves are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  // Group moves into pairs (Red move, Black move)
  const pairedMoves: { index: number; round: number; red?: Move; black?: Move; redIdx: number; blackIdx: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairedMoves.push({
      index: i,
      round: Math.floor(i / 2) + 1,
      red: moves[i],
      redIdx: i,
      black: moves[i + 1],
      blackIdx: i + 1,
    });
  }

  const copyNotation = () => {
    const text = pairedMoves
      .map(p => {
        const rText = p.red ? p.red.notation : '';
        const bText = p.black ? `   ${p.black.notation}` : '';
        return `${p.round}. ${rText}${bText}`;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBrowsingHistory = currentMoveIndex < moves.length - 1 && moves.length > 0;

  return (
    <div className="flex flex-col h-full bg-stone-900/80 rounded-xl border border-stone-800 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-950/70 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm text-stone-200 uppercase tracking-wider">
            Biên Bản Ván Đấu
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={copyNotation}
            disabled={moves.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-40 transition-colors"
            title="Sao chép toàn bộ nước đi"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Browsing Warning Banner */}
      {isBrowsingHistory && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-1.5 flex items-center justify-between text-xs text-amber-300">
          <span>Đang xem lại nước #{currentMoveIndex + 1}</span>
          <button
            onClick={onResetToCurrent}
            className="flex items-center gap-1 font-semibold underline hover:text-amber-200"
          >
            <RotateCcw className="w-3 h-3" /> Trở về hiện tại
          </button>
        </div>
      )}

      {/* Move list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar min-h-[140px] max-h-[300px] lg:max-h-[380px]"
      >
        {moves.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-500 text-xs py-8">
            <p>Chưa có nước đi nào</p>
            <p className="text-[11px] text-stone-600 mt-1">Đỏ đi trước để bắt đầu ván cờ</p>
          </div>
        ) : (
          pairedMoves.map(p => (
            <div
              key={p.round}
              className="flex items-center text-xs py-1 px-2 rounded hover:bg-stone-800/50 transition-colors"
            >
              <span className="w-8 font-mono text-stone-500 font-semibold">{p.round}.</span>

              {/* Red Move */}
              <button
                onClick={() => onSelectMove(p.redIdx)}
                className={`
                  flex-1 text-left px-2 py-1 rounded font-medium transition-all
                  ${
                    currentMoveIndex === p.redIdx
                      ? 'bg-red-600 text-white font-bold shadow-xs'
                      : 'text-red-400 hover:bg-red-950/40'
                  }
                `}
              >
                {p.red?.notation}
                {p.red?.isCheck && <span className="ml-1 text-red-200 font-bold">+</span>}
              </button>

              {/* Black Move */}
              {p.black ? (
                <button
                  onClick={() => onSelectMove(p.blackIdx)}
                  className={`
                    flex-1 text-left px-2 py-1 rounded font-medium transition-all
                    ${
                      currentMoveIndex === p.blackIdx
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'text-stone-300 hover:bg-stone-800'
                    }
                  `}
                >
                  {p.black.notation}
                  {p.black.isCheck && <span className="ml-1 text-amber-300 font-bold">+</span>}
                </button>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Move navigation step buttons */}
      <div className="p-2 bg-stone-950/60 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
        <span className="font-mono">
          Tổng: <strong className="text-stone-200">{moves.length}</strong> nước
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectMove(Math.max(-1, currentMoveIndex - 1))}
            disabled={currentMoveIndex < 0}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 transition-colors"
            title="Nước trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectMove(Math.min(moves.length - 1, currentMoveIndex + 1))}
            disabled={currentMoveIndex >= moves.length - 1}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 transition-colors"
            title="Nước sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
