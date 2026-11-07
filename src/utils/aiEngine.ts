import type { Board, PieceColor, Position } from '../types/chess';
import { cloneBoard, getAllLegalMoves, getMoveNotation, isKingInCheck } from './xiangqiRules';

export interface EngineAnalysis {
  score: number; // in pawns (e.g. +1.5 = Red is up by 1.5 pawns)
  winProbability: number; // 0 to 100%
  depth: number;
  bestMove: {
    from: Position;
    to: Position;
    notation: string;
  } | null;
  pvLine: string[]; // sequence of notations for future moves
  evaluationText: string;
}

// Convert Board to standard Xiangqi FEN string
export function boardToFen(board: Board, turn: PieceColor): string {
  const rows: string[] = [];
  const charMap: Record<string, string> = {
    chariot: 'r',
    horse: 'n',
    elephant: 'b',
    advisor: 'a',
    general: 'k',
    cannon: 'c',
    soldier: 'p',
  };

  for (let r = 0; r < 10; r++) {
    let emptyCount = 0;
    let rowStr = '';
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (!p) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rowStr += emptyCount;
          emptyCount = 0;
        }
        const ch = charMap[p.type] || 'p';
        rowStr += p.color === 'red' ? ch.toUpperCase() : ch.toLowerCase();
      }
    }
    if (emptyCount > 0) {
      rowStr += emptyCount;
    }
    rows.push(rowStr);
  }

  const activeColor = turn === 'red' ? 'w' : 'b';
  return `${rows.join('/')} ${activeColor} - - 0 1`;
}

// Convert UCI coordinate string (e.g. "h2e2", "h0g2") to {from, to}
export function uciToMove(uci: string): { from: Position; to: Position } | null {
  if (!uci || uci.length < 4) return null;
  const fromC = uci.charCodeAt(0) - 97; // a -> 0, i -> 8
  const fromR = 9 - parseInt(uci[1], 10);
  const toC = uci.charCodeAt(2) - 97;
  const toR = 9 - parseInt(uci[3], 10);

  if (isNaN(fromC) || isNaN(fromR) || isNaN(toC) || isNaN(toR)) return null;
  if (fromC < 0 || fromC > 8 || fromR < 0 || fromR > 9) return null;
  if (toC < 0 || toC > 8 || toR < 0 || toR > 9) return null;

  return {
    from: { r: fromR, c: fromC },
    to: { r: toR, c: toC },
  };
}

// Convert {from, to} to UCI coordinate string
export function moveToUci(from: Position, to: Position): string {
  const fromC = String.fromCharCode(97 + from.c);
  const fromR = (9 - from.r).toString();
  const toC = String.fromCharCode(97 + to.c);
  const toR = (9 - to.r).toString();
  return `${fromC}${fromR}${toC}${toR}`;
}

// Base piece values (Centipawns)
const PIECE_VALUES: Record<string, number> = {
  general: 10000,
  chariot: 950,
  cannon: 450,
  horse: 420,
  elephant: 220,
  advisor: 220,
  soldier: 120, // before crossing river
};

// Piece Square Tables (PST) for Xiangqi
// Higher score = better position for Red (mirrored for Black)
const HORSE_PST = [
  [0, -10, 0, 0, 0, 0, 0, -10, 0],
  [0, 10, 20, 25, 20, 25, 20, 10, 0],
  [10, 25, 35, 45, 40, 45, 35, 25, 10],
  [10, 25, 35, 40, 35, 40, 35, 25, 10],
  [5, 20, 30, 35, 30, 35, 30, 20, 5],
  [0, 15, 25, 30, 25, 30, 25, 15, 0],
  [0, 10, 20, 25, 20, 25, 20, 10, 0],
  [-5, 5, 15, 20, 15, 20, 15, 5, -5],
  [-10, 0, 5, 10, 5, 10, 5, 0, -10],
  [-20, -10, 0, 0, 0, 0, 0, -10, -20],
];

const CANNON_PST = [
  [0, 0, 10, 15, 20, 15, 10, 0, 0],
  [0, 10, 15, 25, 35, 25, 15, 10, 0],
  [0, 10, 15, 25, 35, 25, 15, 10, 0],
  [0, 5, 10, 20, 30, 20, 10, 5, 0],
  [0, 5, 10, 15, 25, 15, 10, 5, 0],
  [0, 0, 5, 15, 20, 15, 5, 0, 0],
  [0, 0, 5, 15, 20, 15, 5, 0, 0],
  [-5, 0, 5, 10, 15, 10, 5, 0, -5],
  [0, 0, 0, 0, 10, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const SOLDIER_PST_RED = [
  [0, 10, 20, 40, 50, 40, 20, 10, 0],
  [10, 30, 50, 80, 90, 80, 50, 30, 10],
  [20, 40, 60, 90, 100, 90, 60, 40, 20],
  [30, 50, 70, 90, 90, 90, 70, 50, 30],
  [30, 50, 70, 80, 80, 80, 70, 50, 30], // at river
  [0, 0, 10, 0, 20, 0, 10, 0, 0],
  [0, 0, 5, 0, 15, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Static evaluation function (Centipawns from Red's perspective)
function evaluateBoard(board: Board): number {
  let redScore = 0;
  let blackScore = 0;

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type] || 0;
      let posBonus = 0;

      if (piece.type === 'chariot') {
        // Chariot on open files
        let openFile = true;
        for (let row = 0; row < 10; row++) {
          if (row !== r && board[row][c] && board[row][c]?.type === 'chariot') {
            openFile = false;
            break;
          }
        }
        posBonus += openFile ? 30 : 15;
        // Chariot crossed river
        if ((piece.color === 'red' && r <= 4) || (piece.color === 'black' && r >= 5)) {
          posBonus += 25;
        }
      } else if (piece.type === 'horse') {
        posBonus = piece.color === 'red' ? HORSE_PST[r][c] : HORSE_PST[9 - r][c];
      } else if (piece.type === 'cannon') {
        posBonus = piece.color === 'red' ? CANNON_PST[r][c] : CANNON_PST[9 - r][c];
        // Central cannon bonus
        if (c === 4) posBonus += 35;
      } else if (piece.type === 'soldier') {
        posBonus = piece.color === 'red' ? SOLDIER_PST_RED[r][c] : SOLDIER_PST_RED[9 - r][c];
      }

      const totalVal = baseVal + posBonus;
      if (piece.color === 'red') {
        redScore += totalVal;
      } else {
        blackScore += totalVal;
      }
    }
  }

  return redScore - blackScore;
}

// Alpha-Beta Minimax Search Engine
export function analyzePosition(
  board: Board,
  turn: PieceColor,
  depth: number = 4
): EngineAnalysis {
  type MoveCandidate = { from: Position; to: Position; notation: string };
  const searchResult = { bestMove: null as MoveCandidate | null };
  const pvLine: string[] = [];

  function alphaBeta(
    b: Board,
    d: number,
    alpha: number,
    beta: number,
    currentTurn: PieceColor,
    isRoot: boolean = false
  ): number {
    if (d === 0) {
      return evaluateBoard(b);
    }

    const legalMoves = getAllLegalMoves(b, currentTurn);
    if (legalMoves.length === 0) {
      const inCheck = isKingInCheck(b, currentTurn);
      if (inCheck) {
        // Checkmated
        return currentTurn === 'red' ? -99999 + (depth - d) : 99999 - (depth - d);
      }
      return 0; // Stalemate
    }

    // Move ordering: sort captures first for faster alpha-beta cutoff
    legalMoves.sort((a, bMove) => {
      const targetA = b[a.to.r][a.to.c];
      const targetB = b[bMove.to.r][bMove.to.c];
      const valA = targetA ? PIECE_VALUES[targetA.type] || 0 : 0;
      const valB = targetB ? PIECE_VALUES[targetB.type] || 0 : 0;
      return valB - valA;
    });

    if (currentTurn === 'red') {
      let maxEval = -Infinity;
      for (const m of legalMoves) {
        const nextB = cloneBoard(b);
        nextB[m.to.r][m.to.c] = nextB[m.from.r][m.from.c];
        nextB[m.from.r][m.from.c] = null;

        const evalScore = alphaBeta(nextB, d - 1, alpha, beta, 'black', false);
        if (evalScore > maxEval) {
          maxEval = evalScore;
          if (isRoot) {
            searchResult.bestMove = {
              from: m.from,
              to: m.to,
              notation: getMoveNotation(b, m.from, m.to, b[m.from.r][m.from.c]!),
            };
          }
        }
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break; // Beta cutoff
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of legalMoves) {
        const nextB = cloneBoard(b);
        nextB[m.to.r][m.to.c] = nextB[m.from.r][m.from.c];
        nextB[m.from.r][m.from.c] = null;

        const evalScore = alphaBeta(nextB, d - 1, alpha, beta, 'red', false);
        if (evalScore < minEval) {
          minEval = evalScore;
          if (isRoot) {
            searchResult.bestMove = {
              from: m.from,
              to: m.to,
              notation: getMoveNotation(b, m.from, m.to, b[m.from.r][m.from.c]!),
            };
          }
        }
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // Alpha cutoff
      }
      return minEval;
    }
  }

  const scoreCentipawns = alphaBeta(
    board,
    depth,
    -Infinity,
    Infinity,
    turn,
    true
  );

  const scorePawns = parseFloat((scoreCentipawns / 100).toFixed(2));

  // Sigmoid formula to map centipawn score to 0..100% win probability for Red
  const winProbability = Math.round(
    100 / (1 + Math.pow(10, -scoreCentipawns / 400))
  );

  let evaluationText = 'Cân bằng thế cờ';
  if (scorePawns > 2.5) {
    evaluationText = 'Đỏ chiếm ưu thế áp đảo (+)';
  } else if (scorePawns > 0.8) {
    evaluationText = 'Đỏ chiếm ưu thế nhẹ (+)';
  } else if (scorePawns < -2.5) {
    evaluationText = 'Đen chiếm ưu thế áp đảo (-)';
  } else if (scorePawns < -0.8) {
    evaluationText = 'Đen chiếm ưu thế nhẹ (-)';
  }

  if (searchResult.bestMove) {
    pvLine.push(searchResult.bestMove.notation);
  }

  return {
    score: scorePawns,
    winProbability,
    depth,
    bestMove: searchResult.bestMove,
    pvLine,
    evaluationText,
  };
}
