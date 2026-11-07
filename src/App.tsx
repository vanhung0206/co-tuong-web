import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  Board, 
  GameSettings, 
  GameStatus, 
  Move, 
  Piece, 
  PieceColor, 
  Position 
} from './types/chess';
import { 
  createInitialBoard, 
  cloneBoard, 
  getLegalMovesForPiece, 
  getAllLegalMoves, 
  isKingInCheck, 
  findGeneral, 
  getMoveNotation 
} from './utils/xiangqiRules';
import { soundManager } from './utils/audio';
import { getOpeningNodeForMoves, type OpeningNode } from './utils/openingEngine';
import { ChessBoard } from './components/ChessBoard';
import { PlayerCard } from './components/PlayerCard';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { GameOverModal } from './components/GameOverModal';
import { OpeningTrainerModal } from './components/OpeningTrainerModal';
import { OpeningAdvisor } from './components/OpeningAdvisor';
import type { OpeningVariation } from './data/openings';
import { 
  Swords, 
  HelpCircle, 
  Maximize, 
  Minimize, 
  BookOpen, 
  RotateCcw, 
  ArrowLeftRight, 
  Volume2, 
  VolumeX, 
  Play,
  Lightbulb
} from 'lucide-react';

interface HistorySnapshot {
  board: Board;
  turn: PieceColor;
  move: Move | null;
  capturedRed: Piece[];
  capturedBlack: Piece[];
}

export const App: React.FC = () => {
  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    showHints: true,
    flipOnTurn: false,
    theme: 'classic-wood',
    timerMinutes: 0, // unlimited by default for casual practice
  });

  // Game Core State
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [turn, setTurn] = useState<PieceColor>('red');
  const [capturedRed, setCapturedRed] = useState<Piece[]>([]); // pieces red has captured
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]); // pieces black has captured
  const [history, setHistory] = useState<HistorySnapshot[]>([
    {
      board: createInitialBoard(),
      turn: 'red',
      move: null,
      capturedRed: [],
      capturedBlack: [],
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Interaction State
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isFreeMode, setIsFreeMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isOpeningModalOpen, setIsOpeningModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAdvisorEnabled, setIsAdvisorEnabled] = useState<boolean>(true);
  const [isZenAdvisorOpen, setIsZenAdvisorOpen] = useState<boolean>(false);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Listen for Esc key to exit fullscreen even if browser native fullscreen wasn't active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback to in-app Zen fullscreen
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  }, [isFullscreen]);

  // Game Status
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<PieceColor | null>(null);

  // Clocks
  const [redTime, setRedTime] = useState<number>(0);
  const [blackTime, setBlackTime] = useState<number>(0);

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Reset clock when timerMinutes setting changes
  useEffect(() => {
    const totalSecs = settings.timerMinutes * 60;
    setRedTime(totalSecs);
    setBlackTime(totalSecs);
  }, [settings.timerMinutes]);

  // Timer tick interval
  useEffect(() => {
    if (settings.timerMinutes <= 0 || gameStatus !== 'playing' && gameStatus !== 'check') return;

    const timer = setInterval(() => {
      if (turn === 'red') {
        setRedTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStatus('checkmate');
            setWinner('black');
            setShowGameOverModal(true);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStatus('checkmate');
            setWinner('red');
            setShowGameOverModal(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.timerMinutes, gameStatus, turn]);

  // Check if current king is in check
  const kingInCheckPos = React.useMemo(() => {
    if (isKingInCheck(board, turn)) {
      return findGeneral(board, turn);
    }
    return null;
  }, [board, turn]);

  // Last Move
  const lastMove = history[historyIndex]?.move
    ? { from: history[historyIndex].move!.from, to: history[historyIndex].move!.to }
    : null;

  // New Game
  const handleNewGame = useCallback(() => {
    const initial = createInitialBoard();
    setBoard(initial);
    setTurn('red');
    setCapturedRed([]);
    setCapturedBlack([]);
    setSelectedPos(null);
    setValidMoves([]);
    setGameStatus('playing');
    setWinner(null);
    setShowGameOverModal(false);
    setHistory([
      {
        board: initial,
        turn: 'red',
        move: null,
        capturedRed: [],
        capturedBlack: [],
      },
    ]);
    setHistoryIndex(0);

    const totalSecs = settings.timerMinutes * 60;
    setRedTime(totalSecs);
    setBlackTime(totalSecs);

    soundManager.playTap();
  }, [settings.timerMinutes]);

  // Square Click Handler
  const handleSquareClick = useCallback(
    (pos: Position) => {
      // If browsing past moves, prevent making moves unless reset
      if (historyIndex < history.length - 1) {
        return;
      }

      if (gameStatus !== 'playing' && gameStatus !== 'check') return;

      const clickedPiece = board[pos.r][pos.c];

      // If a piece was already selected and clicked square is in validMoves => MOVE!
      if (selectedPos && validMoves.some(m => m.r === pos.r && m.c === pos.c)) {
        const movingPiece = board[selectedPos.r][selectedPos.c]!;
        const capturedPiece = clickedPiece;

        // Create updated board
        const nextBoard = cloneBoard(board);
        nextBoard[pos.r][pos.c] = movingPiece;
        nextBoard[selectedPos.r][selectedPos.c] = null;

        // Next turn
        const nextTurn: PieceColor = isFreeMode ? turn : turn === 'red' ? 'black' : 'red';

        // Check if next king is in check
        const inCheck = isKingInCheck(nextBoard, nextTurn);

        // Standard Vietnamese notation
        const notation = getMoveNotation(board, selectedPos, pos, movingPiece);

        const moveRecord: Move = {
          from: selectedPos,
          to: pos,
          piece: movingPiece,
          captured: capturedPiece,
          notation,
          isCheck: inCheck,
        };

        // Update captured lists
        const newCapturedRed = [...capturedRed];
        const newCapturedBlack = [...capturedBlack];
        if (capturedPiece) {
          if (movingPiece.color === 'red') {
            newCapturedRed.push(capturedPiece);
          } else {
            newCapturedBlack.push(capturedPiece);
          }
        }

        // Check Game Over (Checkmate or Stalemate)
        let nextStatus: GameStatus = inCheck ? 'check' : 'playing';
        let winningPlayer: PieceColor | null = null;

        if (!isFreeMode) {
          const legalReplies = getAllLegalMoves(nextBoard, nextTurn);
          if (legalReplies.length === 0) {
            winningPlayer = movingPiece.color;
            if (inCheck) {
              nextStatus = 'checkmate';
            } else {
              nextStatus = 'stalemate';
            }
          }
        }

        // Play appropriate sound effect
        if (nextStatus === 'checkmate' || nextStatus === 'stalemate') {
          soundManager.playVictory();
          setShowGameOverModal(true);
        } else if (inCheck) {
          soundManager.playCheck();
        } else if (capturedPiece) {
          soundManager.playCapture();
        } else {
          soundManager.playMove();
        }

        // Push snapshot to history
        const newSnapshot: HistorySnapshot = {
          board: nextBoard,
          turn: nextTurn,
          move: moveRecord,
          capturedRed: newCapturedRed,
          capturedBlack: newCapturedBlack,
        };

        const newHistory = [...history.slice(0, historyIndex + 1), newSnapshot];

        setBoard(nextBoard);
        setTurn(nextTurn);
        setCapturedRed(newCapturedRed);
        setCapturedBlack(newCapturedBlack);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setGameStatus(nextStatus);
        setWinner(winningPlayer);

        // Auto flip if enabled
        if (settings.flipOnTurn && !isFreeMode) {
          setIsFlipped(prev => !prev);
        }

        // Clear selection
        setSelectedPos(null);
        setValidMoves([]);
        return;
      }

      // If clicked on player's own piece (or any piece if isFreeMode) => select it
      if (clickedPiece && (isFreeMode || clickedPiece.color === turn)) {
        if (selectedPos && selectedPos.r === pos.r && selectedPos.c === pos.c) {
          // Deselect
          setSelectedPos(null);
          setValidMoves([]);
        } else {
          setSelectedPos(pos);
          const legal = getLegalMovesForPiece(board, pos);
          setValidMoves(settings.showHints ? legal : []);
          soundManager.playTap();
        }
      } else {
        // Clicked empty square or opponent's piece without active valid move
        setSelectedPos(null);
        setValidMoves([]);
      }
    },
    [
      board,
      turn,
      selectedPos,
      validMoves,
      history,
      historyIndex,
      gameStatus,
      isFreeMode,
      settings.flipOnTurn,
      settings.showHints,
      capturedRed,
      capturedBlack,
    ]
  );

  // Undo (Hoàn tác)
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const targetIdx = historyIndex - 1;
    const targetSnapshot = history[targetIdx];

    setBoard(targetSnapshot.board);
    setTurn(targetSnapshot.turn);
    setCapturedRed(targetSnapshot.capturedRed);
    setCapturedBlack(targetSnapshot.capturedBlack);
    setHistoryIndex(targetIdx);
    setSelectedPos(null);
    setValidMoves([]);
    setGameStatus('playing');
    setWinner(null);
    setShowGameOverModal(false);
    soundManager.playTap();
  }, [historyIndex, history]);

  // Redo (Đi tiếp)
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const targetIdx = historyIndex + 1;
    const targetSnapshot = history[targetIdx];

    setBoard(targetSnapshot.board);
    setTurn(targetSnapshot.turn);
    setCapturedRed(targetSnapshot.capturedRed);
    setCapturedBlack(targetSnapshot.capturedBlack);
    setHistoryIndex(targetIdx);
    setSelectedPos(null);
    setValidMoves([]);
    soundManager.playTap();
  }, [historyIndex, history]);

  // Scrub History
  const handleSelectHistoryMove = useCallback(
    (index: number) => {
      const snapIdx = index + 1;
      if (snapIdx < 0 || snapIdx >= history.length) return;
      const snap = history[snapIdx];
      setBoard(snap.board);
      setTurn(snap.turn);
      setCapturedRed(snap.capturedRed);
      setCapturedBlack(snap.capturedBlack);
      setHistoryIndex(snapIdx);
      setSelectedPos(null);
      setValidMoves([]);
      soundManager.playTap();
    },
    [history]
  );

  // Reset to live current position
  const handleResetToCurrent = useCallback(() => {
    const liveIdx = history.length - 1;
    const liveSnap = history[liveIdx];
    setBoard(liveSnap.board);
    setTurn(liveSnap.turn);
    setCapturedRed(liveSnap.capturedRed);
    setCapturedBlack(liveSnap.capturedBlack);
    setHistoryIndex(liveIdx);
    setSelectedPos(null);
    setValidMoves([]);
    soundManager.playTap();
  }, [history]);

  // Apply opening variation steps to main game board
  const handleApplyVariationToBoard = useCallback(
    (variation: OpeningVariation, upToStep: number) => {
      let curBoard = createInitialBoard();
      let curTurn: PieceColor = 'red';
      const newHistory: HistorySnapshot[] = [
        {
          board: curBoard,
          turn: 'red',
          move: null,
          capturedRed: [],
          capturedBlack: [],
        },
      ];

      const stepsToPlay = variation.steps.slice(0, upToStep);
      for (const st of stepsToPlay) {
        const movingPiece = curBoard[st.from.r][st.from.c];
        if (!movingPiece) break;
        const destPiece = curBoard[st.to.r][st.to.c];

        const nextBoard = cloneBoard(curBoard);
        nextBoard[st.to.r][st.to.c] = movingPiece;
        nextBoard[st.from.r][st.from.c] = null;

        const nextTurn: PieceColor = movingPiece.color === 'red' ? 'black' : 'red';
        const inCheck = isKingInCheck(nextBoard, nextTurn);

        const moveRecord: Move = {
          from: st.from,
          to: st.to,
          piece: movingPiece,
          captured: destPiece,
          notation: st.notation,
          isCheck: inCheck,
        };

        newHistory.push({
          board: nextBoard,
          turn: nextTurn,
          move: moveRecord,
          capturedRed: [],
          capturedBlack: [],
        });

        curBoard = nextBoard;
        curTurn = nextTurn;
      }

      setBoard(curBoard);
      setTurn(curTurn);
      setCapturedRed([]);
      setCapturedBlack([]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setSelectedPos(null);
      setValidMoves([]);
      setGameStatus('playing');
      setWinner(null);
      setShowGameOverModal(false);
      soundManager.playMove();
    },
    []
  );

  // Played moves so far in current game history
  const playedMoves = useMemo(() => {
    return history
      .slice(1, historyIndex + 1)
      .map(h => h.move)
      .filter((m): m is Move => m !== null)
      .map(m => ({ from: m.from, to: m.to }));
  }, [history, historyIndex]);

  // Current Opening Book Node
  const currentOpeningNode: OpeningNode | null = useMemo(() => {
    if (!isAdvisorEnabled) return null;
    return getOpeningNodeForMoves(playedMoves);
  }, [isAdvisorEnabled, playedMoves]);

  // Hint Move (only active if it is current turn's turn)
  const hintMove = useMemo(() => {
    if (!isAdvisorEnabled || !currentOpeningNode) return null;
    if (currentOpeningNode.turn === turn) {
      return {
        from: currentOpeningNode.recommendedMove.from,
        to: currentOpeningNode.recommendedMove.to,
      };
    }
    return null;
  }, [isAdvisorEnabled, currentOpeningNode, turn]);

  // Execute recommended or candidate move from Advisor
  const handlePlayOpeningMove = useCallback(
    (from: Position, to: Position) => {
      const piece = board[from.r][from.c];
      if (!piece) return;

      const movingPiece = piece;
      const capturedPiece = board[to.r][to.c];
      const nextBoard = cloneBoard(board);
      nextBoard[to.r][to.c] = movingPiece;
      nextBoard[from.r][from.c] = null;

      const nextTurn: PieceColor = movingPiece.color === 'red' ? 'black' : 'red';
      const inCheck = isKingInCheck(nextBoard, nextTurn);
      const moveRecord: Move = {
        from,
        to,
        piece: movingPiece,
        captured: capturedPiece || null,
        notation: getMoveNotation(board, from, to, movingPiece),
        isCheck: inCheck,
      };

      const newCapturedRed = [...capturedRed];
      const newCapturedBlack = [...capturedBlack];
      if (capturedPiece) {
        if (movingPiece.color === 'red') newCapturedRed.push(capturedPiece);
        else newCapturedBlack.push(capturedPiece);
      }

      let nextStatus: GameStatus = inCheck ? 'check' : 'playing';
      let winningPlayer: PieceColor | null = null;
      const legalReplies = getAllLegalMoves(nextBoard, nextTurn);
      if (legalReplies.length === 0) {
        winningPlayer = movingPiece.color;
        nextStatus = inCheck ? 'checkmate' : 'stalemate';
      }

      if (nextStatus === 'checkmate' || nextStatus === 'stalemate') {
        soundManager.playVictory();
        setShowGameOverModal(true);
      } else if (inCheck) {
        soundManager.playCheck();
      } else if (capturedPiece) {
        soundManager.playCapture();
      } else {
        soundManager.playMove();
      }

      const newSnapshot: HistorySnapshot = {
        board: nextBoard,
        turn: nextTurn,
        move: moveRecord,
        capturedRed: newCapturedRed,
        capturedBlack: newCapturedBlack,
      };

      const newHistory = [...history.slice(0, historyIndex + 1), newSnapshot];
      setBoard(nextBoard);
      setTurn(nextTurn);
      setCapturedRed(newCapturedRed);
      setCapturedBlack(newCapturedBlack);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setGameStatus(nextStatus);
      setWinner(winningPlayer);
      setSelectedPos(null);
      setValidMoves([]);
    },
    [board, capturedRed, capturedBlack, history, historyIndex]
  );

  // Undo back to last recognized book move
  const handleUndoToLastBookMove = useCallback(() => {
    for (let i = historyIndex - 1; i >= 0; i--) {
      const subMoves = history
        .slice(1, i + 1)
        .map(h => h.move)
        .filter((m): m is Move => m !== null)
        .map(m => ({ from: m.from, to: m.to }));
      if (getOpeningNodeForMoves(subMoves)) {
        const snap = history[i];
        setBoard(snap.board);
        setTurn(snap.turn);
        setCapturedRed(snap.capturedRed);
        setCapturedBlack(snap.capturedBlack);
        setHistoryIndex(i);
        setSelectedPos(null);
        setValidMoves([]);
        soundManager.playTap();
        return;
      }
    }
    handleNewGame();
  }, [history, historyIndex, handleNewGame]);

  // Extract all moves for MoveHistory component
  const moveList: Move[] = history
    .slice(1)
    .map(h => h.move)
    .filter((m): m is Move => m !== null);

  return (
    <div className="min-h-screen bg-radial from-[#1e1c19] via-[#141416] to-[#0a0a0c] text-stone-200 flex flex-col justify-between py-3 px-2 sm:px-4 md:px-6">
      {isFullscreen ? (
        /* Fullscreen Zen View: ONLY THE CHESSBOARD + MINIMAL FLOATING CONTROLS */
        <div className="fixed inset-0 z-50 bg-[#0a0b0e] flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-hidden animate-fade-in">
          {/* Minimal Floating Top Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between px-3.5 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-stone-800 shadow-2xl text-xs z-20">
            {/* Current Turn indicator */}
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-block w-3.5 h-3.5 rounded-full ${
                  turn === 'red'
                    ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]'
                    : 'bg-stone-300 shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                }`}
              />
              <span className="font-bold text-stone-200">
                Lượt:{' '}
                <span className={turn === 'red' ? 'text-red-400 font-extrabold' : 'text-stone-300 font-extrabold'}>
                  {turn === 'red' ? 'Quân Đỏ (Tiên)' : 'Quân Đen (Hậu)'}
                </span>
              </span>
              {gameStatus === 'check' && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-400 border border-red-500/50 font-bold animate-pulse text-[11px]">
                  CHIẾU TƯỚNG!
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Opening Advisor Hint Toggle */}
              <button
                onClick={() => setIsZenAdvisorOpen(prev => !prev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  isZenAdvisorOpen
                    ? 'bg-emerald-600/40 text-emerald-200 border-emerald-400 ring-1 ring-emerald-400'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700/60'
                }`}
                title="Bật cẩm nang gợi ý khai cuộc từng nước"
              >
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">
                  {hintMove ? `Gợi Ý: ${currentOpeningNode?.recommendedMove.notation || 'Nước Chuẩn'}` : 'Gợi Ý Khai Cuộc'}
                </span>
              </button>

              <button
                onClick={handleNewGame}
                className="px-2.5 py-1 rounded-lg bg-red-700/80 hover:bg-red-600 text-amber-100 flex items-center gap-1.5 text-xs font-semibold transition-all border border-red-500/50"
                title="Bắt đầu ván mới"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Ván Mới</span>
              </button>

              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:pointer-events-none text-stone-200 flex items-center gap-1.5 text-xs font-semibold transition-all border border-stone-700/60"
                title="Rút lại nước vừa đi"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Hoàn Tác</span>
              </button>

              <button
                onClick={() => setIsFlipped(prev => !prev)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 text-xs font-semibold transition-all border border-stone-700/60"
                title="Đổi hướng nhìn bàn cờ"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Đổi Góc Nhìn</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 text-xs font-semibold transition-all border border-stone-700/60"
                title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                )}
                <span className="hidden sm:inline">{settings.soundEnabled ? 'Âm Thanh' : 'Tắt Tiếng'}</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="px-3 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/40 text-amber-200 border border-amber-500/60 flex items-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-95"
                title="Thoát chế độ toàn màn hình"
              >
                <Minimize className="w-4 h-4 text-amber-400" />
                <span>Thoát Toàn Màn Hình</span>
              </button>
            </div>
          </div>

          {/* Floating Compact Opening Advisor Card in Zen Mode */}
          {isZenAdvisorOpen && (
            <div className="absolute top-14 z-30 animate-fade-in shadow-2xl px-2 max-w-lg w-full">
              <OpeningAdvisor
                currentNode={currentOpeningNode}
                isEnabled={isAdvisorEnabled}
                onToggleEnabled={() => setIsAdvisorEnabled(prev => !prev)}
                onPlayMove={handlePlayOpeningMove}
                onUndoToLastBookMove={handleUndoToLastBookMove}
                isCompact={true}
              />
            </div>
          )}

          {/* Centered Large Board: ONLY THE CHESSBOARD */}
          <div className="flex-1 flex items-center justify-center w-full min-h-0 py-2 overflow-hidden">
            <ChessBoard
              board={board}
              selectedPos={selectedPos}
              validMoves={validMoves}
              lastMove={lastMove}
              hintMove={hintMove}
              kingInCheckPos={kingInCheckPos}
              isFlipped={isFlipped}
              theme={settings.theme}
              showViSubtitle={false}
              containerClassName="h-[min(87vh,calc(92vw*10/9))] aspect-[9/10] select-none p-2 sm:p-3 rounded-2xl bg-[#2a1d13] wood-board-shadow border-4 border-[#523317] shadow-2xl flex-shrink-0"
              onSquareClick={handleSquareClick}
            />
          </div>

          {/* Bottom subtle indicator */}
          <div className="text-[11px] text-stone-500 flex items-center gap-3">
            <span>Bấm <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 font-mono text-[10px]">Esc</kbd> để thoát toàn màn hình</span>
            <span>•</span>
            <span>Nước cờ: <strong className="text-amber-400">{historyIndex}</strong></span>
          </div>
        </div>
      ) : (
        <>
          {/* Top Header */}
          <header className="max-w-7xl w-full mx-auto flex items-center justify-between pb-3 border-b border-stone-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center font-calligraphy text-xl font-black text-amber-100 shadow-md shadow-amber-900/40 border border-amber-400/40">
                棋
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-wide font-cinzel text-amber-100 flex items-center gap-2">
                  KỲ ĐẠO <span className="text-amber-500 font-sans text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-normal">Cờ Tướng 2 Người</span>
                </h1>
                <p className="text-[11px] text-stone-400">
                  Trang Luyện Cờ Cá Nhân & Song Đấu Trực Tiếp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Free Mode badge if active */}
              {isFreeMode && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Chế độ Luyện Tự Do
                </span>
              )}

              {/* Opening Book Trainer Button */}
              <button
                onClick={() => setIsOpeningModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-600/30 to-red-600/30 hover:from-amber-600/45 hover:to-red-600/45 text-amber-200 border border-amber-500/50 shadow-md transition-all active:scale-95"
                title="Bí phổ khai cuộc Trung Pháo và cẩm nang phản đòn"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Bí Phổ Khai Cuộc</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
                title="Bật chế độ toàn màn hình"
              >
                <Maximize className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Toàn Màn Hình</span>
              </button>

              {/* Quick Help */}
              <button
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
                title="Hướng dẫn luật cờ"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Luật Cờ</span>
              </button>
            </div>
          </header>

          {/* Main Game Arena */}
          <main className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start my-4">
            {/* Left / Center Area: Board & Player Cards (7 or 8 columns on desktop) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center space-y-3">
              {/* Top Player Card (Black when normal, Red when flipped) */}
              <div className="w-full max-w-[620px]">
                <PlayerCard
                  color={isFlipped ? 'red' : 'black'}
                  isCurrentTurn={turn === (isFlipped ? 'red' : 'black')}
                  isInCheck={gameStatus === 'check' && turn === (isFlipped ? 'red' : 'black')}
                  timeLeft={settings.timerMinutes > 0 ? (isFlipped ? redTime : blackTime) : null}
                  capturedPieces={isFlipped ? capturedRed : capturedBlack}
                  theme={settings.theme}
                />
              </div>

              {/* Xiangqi Chess Board */}
              <ChessBoard
                board={board}
                selectedPos={selectedPos}
                validMoves={validMoves}
                lastMove={lastMove}
                hintMove={hintMove}
                kingInCheckPos={kingInCheckPos}
                isFlipped={isFlipped}
                theme={settings.theme}
                showViSubtitle={false}
                onSquareClick={handleSquareClick}
              />

              {/* Bottom Player Card (Red when normal, Black when flipped) */}
              <div className="w-full max-w-[620px]">
                <PlayerCard
                  color={isFlipped ? 'black' : 'red'}
                  isCurrentTurn={turn === (isFlipped ? 'black' : 'red')}
                  isInCheck={gameStatus === 'check' && turn === (isFlipped ? 'black' : 'red')}
                  timeLeft={settings.timerMinutes > 0 ? (isFlipped ? blackTime : redTime) : null}
                  capturedPieces={isFlipped ? capturedBlack : capturedRed}
                  theme={settings.theme}
                />
              </div>
            </div>

            {/* Right Sidebar: Controls, Opening Advisor & Move History (5 or 4 columns on desktop) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-3.5 h-full">
              {/* Opening Advisor (Trợ Lý Khai Cuộc Từng Nước & Cây Quyết Định) */}
              <OpeningAdvisor
                currentNode={currentOpeningNode}
                isEnabled={isAdvisorEnabled}
                onToggleEnabled={() => setIsAdvisorEnabled(prev => !prev)}
                onPlayMove={handlePlayOpeningMove}
                onUndoToLastBookMove={handleUndoToLastBookMove}
              />

              {/* Control Actions Bar */}
              <GameControls
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                isFlipped={isFlipped}
                isFreeMode={isFreeMode}
                isFullscreen={isFullscreen}
                settings={settings}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onFlipBoard={() => setIsFlipped(prev => !prev)}
                onNewGame={handleNewGame}
                onToggleFreeMode={() => setIsFreeMode(prev => !prev)}
                onToggleFullscreen={toggleFullscreen}
                onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
              />

              {/* Move History */}
              <div className="flex-1 min-h-[320px]">
                <MoveHistory
                  moves={moveList}
                  currentMoveIndex={historyIndex - 1}
                  onSelectMove={handleSelectHistoryMove}
                  onResetToCurrent={handleResetToCurrent}
                />
              </div>

              {/* Tactical Practice Tip Box */}
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800/80 text-xs text-stone-400 space-y-1.5 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Swords className="w-3.5 h-3.5" />
                  <span>Bí Quyết Luyện Cờ Cá Nhân</span>
                </div>
                <p className="leading-relaxed">
                  Bạn có thể bật <strong>"Luyện Tự Do"</strong> để tùy ý điều động quân cả 2 bên thử nghiệm khai cuộc, hoặc bấm vào bất kỳ nước cờ nào trong <strong>Biên Bản</strong> để quay ngược thời gian xem lại các nhánh đi khác.
                </p>
                <button
                  onClick={() => setIsOpeningModalOpen(true)}
                  className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Mở Cẩm Nang Khai Cuộc Trung Pháo
                </button>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="max-w-7xl w-full mx-auto pt-3 border-t border-stone-800/60 text-center text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Kỳ Đạo © {new Date().getFullYear()} — Trang Web Cờ Tướng Cá Nhân Chuẩn Vercel</span>
            <div className="flex items-center gap-3">
              <span>Chuẩn luật Cờ Tướng Quốc Tế</span>
              <span>•</span>
              <span>Sẵn sàng Deploy Vercel</span>
            </div>
          </footer>
        </>
      )}

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        status={gameStatus}
        winner={winner}
        onNewGame={handleNewGame}
        onClose={() => setShowGameOverModal(false)}
      />

      {/* Opening Book Trainer Modal */}
      <OpeningTrainerModal
        isOpen={isOpeningModalOpen}
        onClose={() => setIsOpeningModalOpen(false)}
        onApplyVariationToBoard={handleApplyVariationToBoard}
      />

      {/* Help / Rules Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h2 className="text-lg font-bold text-amber-200 font-calligraphy flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Quy Tắc Di Chuyển Các Quân Cờ
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-stone-300">
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <h3 className="font-bold text-amber-400 text-sm mb-1">Tướng / Soái (帅 / 将)</h3>
                <p>Chỉ đi từng ô một ngang hoặc dọc trong phạm vi Cung (3x3). Hai Tướng không được nhìn thấy nhau trên cùng một cột mà không có quân cản (Luật Tướng đối mặt).</p>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <h3 className="font-bold text-amber-400 text-sm mb-1">Sĩ (仕 / 士)</h3>
                <p>Đi chéo 1 ô mỗi nước, luôn luôn ở trong Cung.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <h3 className="font-bold text-amber-400 text-sm mb-1">Tượng (相 / 象)</h3>
                <p>Đi chéo 2 ô (hình vuông 2x2). Không được qua sông. Bị cản khi có quân nằm ở giữa đường chéo (chặn mắt tượng).</p>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <h3 className="font-bold text-amber-400 text-sm mb-1">Mã (傌 / 马)</h3>
                <p>Đi theo hình chữ L (ngang 1 dọc 2 hoặc dọc 1 ngang 2). Bị cản nếu có quân đứng ngay sát bước đi thẳng đầu tiên (chẹn chân mã).</p>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <h3 className="font-bold text-amber-400 text-sm mb-1">Xe (俥 / 车)</h3>
                <p>Đi ngang dọc tự do bao nhiêu ô tùy ý miễn không bị cản. Ăn quân đối phương trên đường đi.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <h3 className="font-bold text-amber-400 text-sm mb-1">Pháo (炮 / 砲)</h3>
                <p>Di chuyển giống Xe. Khi ăn quân phải nhảy qua đúng một quân làm ngòi (bất kể quân phe nào).</p>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <h3 className="font-bold text-amber-400 text-sm mb-1">Binh / Tốt (兵 / 卒)</h3>
                <p>Trước khi qua sông chỉ tiến thẳng 1 bước. Sau khi qua sông có thể tiến 1 bước hoặc đi ngang 1 bước. Không bao giờ được đi lùi.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
