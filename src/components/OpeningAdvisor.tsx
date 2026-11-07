import React from 'react';
import type { Position } from '../types/chess';
import type { OpeningNode, OpponentBranch } from '../utils/openingEngine';
import { Sparkles, ArrowRight, Lightbulb, Play, RotateCcw, Compass, BookOpen } from 'lucide-react';

interface OpeningAdvisorProps {
  currentNode: OpeningNode | null;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  onPlayMove: (from: Position, to: Position) => void;
  onUndoToLastBookMove?: () => void;
  isCompact?: boolean; // For Zen Fullscreen floating HUD
}

export const OpeningAdvisor: React.FC<OpeningAdvisorProps> = ({
  currentNode,
  isEnabled,
  onToggleEnabled,
  onPlayMove,
  onUndoToLastBookMove,
  isCompact = false,
}) => {
  if (!isEnabled) {
    return (
      <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-stone-300">Trợ Lý Khai Cuộc Từng Nước</span>
        </div>
        <button
          onClick={onToggleEnabled}
          className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          Bật Gợi Ý
        </button>
      </div>
    );
  }

  // If compact mode (for Zen Fullscreen HUD floating panel)
  if (isCompact) {
    if (!currentNode) {
      return (
        <div className="p-2.5 bg-stone-900/95 backdrop-blur-md rounded-xl border border-stone-800 text-xs text-stone-300 max-w-sm">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-stone-800">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Ngoài Sách Giáo Khoa
            </span>
            <button
              onClick={onToggleEnabled}
              className="text-[10px] text-stone-500 hover:text-stone-300"
            >
              Đóng
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            Hãy chú ý: Xuất Xe sớm, giữ chắc Tốt 5 và khai thác cánh quân sơ hở của đối phương.
          </p>
        </div>
      );
    }

    return (
      <div className="p-3 bg-stone-900/95 backdrop-blur-md rounded-xl border border-emerald-500/40 shadow-2xl text-xs text-stone-200 max-w-md animate-fade-in">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-300 text-xs">{currentNode.openingName}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Nước {currentNode.stepNumber}
          </span>
        </div>

        {/* Recommended Move */}
        <div className="bg-stone-950/70 p-2.5 rounded-lg border border-stone-800 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-extrabold text-sm flex items-center gap-1">
              👉 {currentNode.recommendedMove.notation}
            </span>
            <button
              onClick={() =>
                onPlayMove(currentNode.recommendedMove.from, currentNode.recommendedMove.to)
              }
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs transition-transform active:scale-95 flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-current" /> Đi Nước Này
            </button>
          </div>
          <p className="text-[11px] text-stone-300 mt-1 leading-snug">
            {currentNode.recommendedMove.explanation}
          </p>
        </div>

        {/* Branches */}
        {currentNode.opponentBranches && currentNode.opponentBranches.length > 0 && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Các biến đối thủ có thể phản đòn:
            </span>
            {currentNode.opponentBranches.map((branch, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded bg-stone-800/60 border border-stone-700/50 flex items-center justify-between gap-2"
              >
                <div className="text-[11px]">
                  <span className="text-amber-300 font-semibold">{branch.name}</span>
                  <span className="text-stone-400 block text-[10px]">
                    → Bạn sẽ đi: <strong className="text-emerald-400">{branch.counterMove}</strong>
                  </span>
                </div>
                <button
                  onClick={() => onPlayMove(branch.move.from, branch.move.to)}
                  className="px-2 py-0.5 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-[10px] font-bold shrink-0 transition-colors"
                >
                  Thử biến này
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full Normal Panel View
  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-500/40 shadow-2xl p-3.5 space-y-3 backdrop-blur-md animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <Lightbulb className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-200 flex items-center gap-1.5">
              <span>Trợ Lý Khai Cuộc</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                LIVE
              </span>
            </h3>
            <p className="text-[10px] text-stone-400">
              {currentNode ? currentNode.openingName : 'Khai cuộc tự do'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleEnabled}
          className="px-2 py-1 text-[11px] font-medium text-stone-400 hover:text-stone-200 rounded bg-stone-800 border border-stone-700/60"
        >
          Tắt Trợ Lý
        </button>
      </div>

      {!currentNode ? (
        /* Off-book state */
        <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Compass className="w-4 h-4" />
            <span>Nước Cờ Nằm Ngoài Bí Phổ Chính Quy</span>
          </div>
          <p className="text-stone-400 text-[11px] leading-relaxed">
            Nước đi hiện tại đã lệch khỏi các biến phổ thông. Gợi ý chiến thuật trung cuộc:
          </p>
          <ul className="text-[11px] text-stone-300 space-y-1 list-disc pl-4">
            <li>Nhanh chóng ra Xe chiếm lộ 2 hoặc lộ 8.</li>
            <li>Giữ vững Tốt đầu lộ 5, không để đối thủ dồn quân công phá.</li>
            <li>Tập trung hỏa lực vào cánh cờ đối phương chưa kịp dàn quân.</li>
          </ul>
          {onUndoToLastBookMove && (
            <button
              onClick={onUndoToLastBookMove}
              className="mt-2 w-full py-1.5 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Quay Lại Nước Chuẩn Gần Nhất
            </button>
          )}
        </div>
      ) : (
        /* Active Node with Recommendations */
        <div className="space-y-3">
          {/* Main Recommended Move Box */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 via-stone-950/80 to-stone-900 border border-emerald-500/50 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Nước Đi Khuyên Dùng:
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                Nước {currentNode.stepNumber} • {currentNode.turn === 'red' ? 'Quân Đỏ' : 'Quân Đen'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 my-1">
              <div>
                <h4 className="text-base font-black text-emerald-300 font-cinzel">
                  {currentNode.recommendedMove.notation}
                </h4>
                <p className="text-xs text-amber-200/90 font-semibold">
                  {currentNode.recommendedMove.name}
                </p>
              </div>

              <button
                onClick={() =>
                  onPlayMove(currentNode.recommendedMove.from, currentNode.recommendedMove.to)
                }
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                title="Tự động thực hiện nước cờ này trên bàn"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Đi Nước Này</span>
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mt-2 pt-2 border-t border-emerald-500/20">
              {currentNode.recommendedMove.explanation}
            </p>

            {currentNode.recommendedMove.tacticalTip && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Bí quyết:</strong> {currentNode.recommendedMove.tacticalTip}</span>
              </div>
            )}
          </div>

          {/* Opponent Decision Tree Branches */}
          {currentNode.opponentBranches && currentNode.opponentBranches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nếu đối thủ phản đòn → Bạn sẽ đi gì?</span>
                </h4>
                <span className="text-[10px] text-stone-400">
                  {currentNode.opponentBranches.length} biến thường gặp
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {currentNode.opponentBranches.map((branch: OpponentBranch, i: number) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 transition-all text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="font-bold text-stone-200">{branch.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        {branch.frequency}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-400 leading-snug">
                      {branch.description}
                    </p>

                    <div className="pt-1.5 border-t border-stone-800/80 flex items-center justify-between gap-2">
                      <div className="text-[11px]">
                        <span className="text-stone-400">Bạn sẽ phản đòn: </span>
                        <strong className="text-emerald-300">{branch.counterMove}</strong>
                      </div>

                      <button
                        onClick={() => onPlayMove(branch.move.from, branch.move.to)}
                        className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-amber-600/30 text-amber-200 border border-stone-700 hover:border-amber-500/50 text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1"
                        title="Tự động cho đối thủ đi nước này để bạn tập phản đòn"
                      >
                        <span>Thử biến này</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-[10px] text-stone-400 italic">
                      💡 {branch.counterExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Moves for Player if available */}
          {currentNode.candidateMoves && currentNode.candidateMoves.length > 0 && (
            <div className="pt-2 border-t border-stone-800">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Các lựa chọn khai cuộc khác của bạn:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentNode.candidateMoves.map((cand, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPlayMove(cand.from, cand.to)}
                    className="p-2 rounded-lg bg-stone-950/50 hover:bg-stone-800 border border-stone-800/80 text-left transition-colors group"
                  >
                    <div className="text-[11px] font-bold text-stone-200 group-hover:text-amber-300">
                      {cand.notation}
                    </div>
                    <div className="text-[10px] text-stone-400 leading-tight">
                      {cand.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
