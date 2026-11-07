import React, { useState } from 'react';
import type { Position } from '../types/chess';
import type { OpeningNode, OpponentBranch } from '../utils/openingEngine';
import type { EngineAnalysis } from '../utils/aiEngine';
import { 
  Sparkles, 
  ArrowRight, 
  Lightbulb, 
  Play, 
  RotateCcw, 
  Compass, 
  BookOpen, 
  Cpu, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

interface OpeningAdvisorProps {
  currentNode: OpeningNode | null;
  engineAnalysis: EngineAnalysis | null;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  onPlayMove: (from: Position, to: Position) => void;
  onUndoToLastBookMove?: () => void;
  isCompact?: boolean; // For Zen Fullscreen floating HUD
}

export const OpeningAdvisor: React.FC<OpeningAdvisorProps> = ({
  currentNode,
  engineAnalysis,
  isEnabled,
  onToggleEnabled,
  onPlayMove,
  onUndoToLastBookMove,
  isCompact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'ai'>('book');

  if (!isEnabled) {
    return (
      <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-stone-300">Trợ Lý Khai Cuộc 20 Nước & AI Engine</span>
        </div>
        <button
          onClick={onToggleEnabled}
          className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          Bật Hướng Dẫn
        </button>
      </div>
    );
  }

  // Current Step and Progress calculation
  const currentStep = currentNode ? currentNode.stepNumber : 1;
  const progressPercent = Math.min(100, Math.round((currentStep / 20) * 100));

  // If compact mode (for Zen Fullscreen HUD floating panel)
  if (isCompact) {
    return (
      <div className="p-3 bg-stone-900/95 backdrop-blur-md rounded-xl border border-emerald-500/40 shadow-2xl text-xs text-stone-200 max-w-md animate-fade-in space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-300 text-xs">
              {currentNode ? currentNode.openingName : 'Phân Tích AI Engine'}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Nước {currentStep}/20
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-950 rounded-full h-1 overflow-hidden border border-stone-800">
          <div
            className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Recommended Move */}
        {currentNode ? (
          <div className="bg-stone-950/70 p-2 rounded-lg border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-extrabold text-sm">
                👉 {currentNode.recommendedMove.notation}
              </span>
              <button
                onClick={() =>
                  onPlayMove(currentNode.recommendedMove.from, currentNode.recommendedMove.to)
                }
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs transition-transform active:scale-95 flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" /> Đi Nước Này
              </button>
            </div>
            <p className="text-[11px] text-stone-300 mt-1 leading-snug">
              {currentNode.recommendedMove.explanation}
            </p>
          </div>
        ) : engineAnalysis?.bestMove ? (
          <div className="bg-stone-950/70 p-2 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 font-extrabold text-xs flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> AI: {engineAnalysis.bestMove.notation}
              </span>
              <button
                onClick={() =>
                  onPlayMove(engineAnalysis.bestMove!.from, engineAnalysis.bestMove!.to)
                }
                className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px]"
              >
                Đi Nước AI
              </button>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">
              Điểm thế trận: {engineAnalysis.score > 0 ? `+${engineAnalysis.score}` : engineAnalysis.score} ({engineAnalysis.evaluationText})
            </div>
          </div>
        ) : null}

        {/* Compact Branches */}
        {currentNode?.opponentBranches && currentNode.opponentBranches.length > 0 && (
          <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
            {currentNode.opponentBranches.map((branch, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded bg-stone-800/60 border border-stone-700/50 flex items-center justify-between gap-1 text-[11px]"
              >
                <span className="text-amber-300 font-medium truncate">{branch.name}</span>
                <button
                  onClick={() => onPlayMove(branch.move.from, branch.move.to)}
                  className="px-2 py-0.5 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 text-[10px] font-bold shrink-0"
                >
                  Thử biến
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
      <div className="flex items-center justify-between pb-2 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <Lightbulb className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-200 flex items-center gap-1.5">
              <span>Trợ Lý Khai Cuộc 20 Nước</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                AI + BÍ PHỔ
              </span>
            </h3>
            <p className="text-[10px] text-stone-400">
              {currentNode ? currentNode.openingName : 'Chế độ tính toán tự do AI Engine'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleEnabled}
          className="px-2 py-1 text-[11px] font-medium text-stone-400 hover:text-stone-200 rounded bg-stone-800 border border-stone-700/60"
        >
          Tắt
        </button>
      </div>

      {/* 20-Move Grandmaster Progress Tracker */}
      <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Tiến Trình Khai Cuộc: Nước {currentStep} / 20
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            {progressPercent}%
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-[10px] text-stone-400 flex items-center justify-between">
          <span>Giai đoạn: <strong className="text-stone-300">{currentNode?.phaseName || 'Trung cuộc biến ảo'}</strong></span>
          <span>Mục tiêu: Đạt ưu thế toàn diện sau 20 nước</span>
        </div>
      </div>

      {/* AI Evaluation Meter Bar */}
      {engineAnalysis && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-stone-950/90 to-stone-900 border border-stone-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Đánh Giá Thế Trận (AI Engine):</span>
            </span>
            <span
              className={`font-black font-mono text-xs px-2 py-0.5 rounded ${
                engineAnalysis.score >= 0
                  ? 'bg-red-950 text-red-300 border border-red-500/40'
                  : 'bg-stone-800 text-stone-200 border border-stone-600'
              }`}
            >
              {engineAnalysis.score > 0 ? `+${engineAnalysis.score}` : engineAnalysis.score}
            </span>
          </div>

          {/* Win Probability Bar: Red vs Black */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-400 w-12 text-left">
              Đỏ {engineAnalysis.winProbability}%
            </span>
            <div className="flex-1 bg-stone-800 h-2 rounded-full overflow-hidden flex border border-stone-700">
              <div
                className="bg-red-600 h-full transition-all duration-300"
                style={{ width: `${engineAnalysis.winProbability}%` }}
              />
              <div
                className="bg-stone-500 h-full transition-all duration-300"
                style={{ width: `${100 - engineAnalysis.winProbability}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-stone-400 w-14 text-right">
              Đen {100 - engineAnalysis.winProbability}%
            </span>
          </div>

          <div className="text-[10px] text-stone-400 flex items-center justify-between pt-0.5">
            <span>{engineAnalysis.evaluationText}</span>
            <span>Độ sâu AI: {engineAnalysis.depth} nước</span>
          </div>
        </div>
      )}

      {/* Tab Switcher: Bí Phổ 20 Nước vs AI Engine */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-950/80 rounded-xl border border-stone-800">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'book'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bí Phổ 20 Nước</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ai'
              ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-300'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Engine Phân Tích</span>
        </button>
      </div>

      {activeTab === 'book' ? (
        /* Grandmaster 20-Move Book Tab */
        !currentNode ? (
          /* Off-book state with AI bridge */
          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Compass className="w-4 h-4" />
              <span>Nước Cờ Nằm Ngoài Bí Phổ Sách Giáo Khoa</span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Thế cờ đã đi vào giai đoạn trung cuộc tự do. AI Engine đang tính toán trực tiếp để dẫn dắt tiếp các nước còn lại:
            </p>
            {engineAnalysis?.bestMove && (
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block">GỢI Ý TỪ ENGINE:</span>
                  <span className="text-sm font-extrabold text-emerald-300">
                    👉 {engineAnalysis.bestMove.notation}
                  </span>
                </div>
                <button
                  onClick={() =>
                    onPlayMove(engineAnalysis.bestMove!.from, engineAnalysis.bestMove!.to)
                  }
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs"
                >
                  Đi Nước Này
                </button>
              </div>
            )}
            {onUndoToLastBookMove && (
              <button
                onClick={onUndoToLastBookMove}
                className="mt-2 w-full py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                Quay Lại Nước Chuẩn Gần Nhất
              </button>
            )}
          </div>
        ) : (
          /* Active 20-move Book Node */
          <div className="space-y-3">
            {/* Main Recommended Move Box */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 via-stone-950/80 to-stone-900 border border-emerald-500/50 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Nước {currentNode.stepNumber}/20 Chuẩn Đại Sư:
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {currentNode.turn === 'red' ? 'Quân Đỏ Đi' : 'Quân Đen Đi'}
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

                <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
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
          </div>
        )
      ) : (
        /* AI Engine Deep Analysis Tab */
        <div className="space-y-3">
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Xiangqi Engine (Fairy-Stockfish Mode)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Độ sâu: {engineAnalysis?.depth || 4}
              </span>
            </div>

            {engineAnalysis?.bestMove ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">NƯỚC CỜ TỐI ƯU NHẤT:</span>
                    <span className="text-base font-black text-emerald-300">
                      👉 {engineAnalysis.bestMove.notation}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onPlayMove(engineAnalysis.bestMove!.from, engineAnalysis.bestMove!.to)
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Đi Nước Này</span>
                  </button>
                </div>

                <div className="text-[11px] text-stone-300">
                  {engineAnalysis.evaluationText} (Điểm: {engineAnalysis.score > 0 ? `+${engineAnalysis.score}` : engineAnalysis.score})
                </div>

                {engineAnalysis.pvLine && engineAnalysis.pvLine.length > 0 && (
                  <div className="pt-2 border-t border-emerald-500/20">
                    <span className="text-[10px] text-stone-400 block mb-1">
                      Dãy tính toán tương lai của AI:
                    </span>
                    <div className="text-[11px] font-mono text-emerald-400 font-bold flex flex-wrap gap-1">
                      {engineAnalysis.pvLine.map((n, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-stone-900 rounded border border-stone-800">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-stone-400 text-xs py-2 text-center">
                Đang phân tích thế cờ...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
