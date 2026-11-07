import React, { useState } from 'react';
import { OPENING_BOOK } from '../data/openings';
import type { OpeningVariation } from '../data/openings';
import { 
  X, 
  Swords, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Flame
} from 'lucide-react';

interface OpeningTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVariationToBoard: (variation: OpeningVariation, upToStep: number) => void;
}

export const OpeningTrainerModal: React.FC<OpeningTrainerModalProps> = ({
  isOpen,
  onClose,
  onApplyVariationToBoard,
}) => {
  const [selectedVarId, setSelectedVarId] = useState<string>(OPENING_BOOK[0].id);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  if (!isOpen) return null;

  const currentVar = OPENING_BOOK.find(v => v.id === selectedVarId) || OPENING_BOOK[0];
  const step = currentVar.steps[currentStepIdx] || currentVar.steps[0];

  const handleSelectVariation = (id: string) => {
    setSelectedVarId(id);
    setCurrentStepIdx(0);
  };

  const handleNextStep = () => {
    if (currentStepIdx < currentVar.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-amber-600/60 rounded-3xl shadow-[0_0_60px_rgba(217,119,6,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-950/80 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center text-amber-100 shadow-md border border-amber-400/40 font-calligraphy text-2xl font-black">
              炮
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                BÍ PHỔ KHAI CUỘC TRUNG PHÁO
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-sans font-normal">
                  Vua Khai Cuộc
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Chiến thuật một đòn định càn khôn — Học sâu một trận thế bách chiến bách thắng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variations Selector Tabs */}
        <div className="flex overflow-x-auto px-4 py-2.5 bg-stone-950/40 border-b border-stone-800/80 gap-2 shrink-0 custom-scrollbar">
          {OPENING_BOOK.map(v => {
            const isSelected = v.id === selectedVarId;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVariation(v.id)}
                className={`
                  flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0
                  ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600/30 to-amber-600/30 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-stone-800/60 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                  }
                `}
              >
                <Flame className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{v.vietnameseName}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar text-sm">
          {/* Overview Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-stone-900 to-stone-950 border border-amber-700/40 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-base font-black text-amber-200 font-cinzel">
                {currentVar.vietnameseName}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 font-medium">
                {currentVar.rating}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-300">
              {currentVar.overview}
            </p>

            {/* Golden Rules */}
            <div className="pt-2 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {currentVar.goldenRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Step Card */}
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-stone-800 font-mono text-xs font-bold text-stone-200">
                  Nước {step.stepIndex}/{currentVar.steps.length}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    step.turn === 'red'
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  {step.turn === 'red' ? 'Quân Đỏ (Bạn)' : 'Quân Đen (Đối Thủ)'}
                </span>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIdx === 0}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-30 transition-colors"
                  title="Nước trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIdx === currentVar.steps.length - 1}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-30 transition-colors"
                  title="Nước sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Move Highlight */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-900/90 p-3.5 rounded-xl border border-stone-700/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-amber-300 font-mono">
                    {step.notation}
                  </span>
                  <span className="text-xs text-stone-400">— {step.title}</span>
                </div>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  {step.explanation}
                </p>
              </div>

              {/* Load onto real board button */}
              <button
                onClick={() => {
                  onApplyVariationToBoard(currentVar, step.stepIndex);
                  onClose();
                }}
                className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                title="Đưa thế trận này ra bàn cờ chính để bạn tự đánh tiếp"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Nạp Vào Bàn Cờ</span>
              </button>
            </div>

            {/* Tactical Decision Tree ("Nếu đối thủ đi... thì ta đi...") */}
            {step.opponentOptions && step.opponentOptions.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Swords className="w-4 h-4" />
                  <span>Kịch Bản Đối Kháng: Nếu đối thủ đi gì $\rightarrow$ Ta đi gì?</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {step.opponentOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2 hover:border-amber-600/40 transition-colors"
                    >
                      <div className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        <span>{opt.moveName}</span>
                      </div>
                      <p className="text-[11px] text-stone-400">{opt.description}</p>
                      
                      <div className="pt-2 border-t border-stone-800/80">
                        <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                          <span>{opt.counterMove}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-stone-300 leading-relaxed">
                          {opt.counterExplanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Cheat Sheet Summary Table */}
          <div className="p-4 rounded-2xl bg-stone-950/50 border border-stone-800/80 space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Bảng Tra Nhanh Phản Đòn Khai Cuộc
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400">
                    <th className="pb-2 font-semibold">Đối thủ đi nước nào?</th>
                    <th className="pb-2 font-semibold">Tên thế trận của họ</th>
                    <th className="pb-2 font-semibold text-amber-400">Chiêu phản đòn của bạn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  <tr>
                    <td className="py-2 font-mono font-bold text-stone-200">Mã 8 tiến 7</td>
                    <td className="py-2">Bình Phong Mã</td>
                    <td className="py-2 text-amber-300 font-medium">Lên Mã 2 tiến 3 $\rightarrow$ Xe 1 bình 2 $\rightarrow$ Binh 7 tiến 1 $\rightarrow$ Xe 2 tiến 6 qua sông đè Mã</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-stone-200">Pháo 8 bình 5</td>
                    <td className="py-2">Thuận Pháo</td>
                    <td className="py-2 text-amber-300 font-medium">Lên Mã 2 tiến 3 $\rightarrow$ Xe 1 bình 2 $\rightarrow$ Xe 2 tiến 4 (Tuần Hà Xa) rồi lao Binh 5 tiến 1</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-stone-200">Tượng 3 tiến 5</td>
                    <td className="py-2">Phi Tượng</td>
                    <td className="py-2 text-amber-300 font-medium">Lên Mã giữ Tốt rồi lao thẳng Binh 5 tiến 1 liên tục phá toang tim trung lộ</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono font-bold text-stone-200">Pháo 2 bình 5</td>
                    <td className="py-2">Nghịch Pháo</td>
                    <td className="py-2 text-amber-300 font-medium">Ra Xe 1 bình 2 nhanh nhất, đâm sâu bắt Pháo và Mã ngọa tào</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between shrink-0 text-xs">
          <span className="text-stone-400">
            Nút <strong>"Nạp Vào Bàn Cờ"</strong> sẽ đưa ngay thế cờ này lên bàn cờ chính để bạn luyện tập thực chiến.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
