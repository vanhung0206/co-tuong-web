import type { Board, Piece, PieceColor, PieceType, Position } from '../types/chess';

// Initial Board Setup
export function createInitialBoard(): Board {
  const board: Board = Array(10).fill(null).map(() => Array(9).fill(null));

  // Helper to place piece
  const place = (r: number, c: number, type: PieceType, color: PieceColor, id: string) => {
    board[r][c] = { id, type, color };
  };

  // Black pieces (top: rows 0 to 4)
  place(0, 0, 'chariot', 'black', 'b_r1');
  place(0, 1, 'horse', 'black', 'b_h1');
  place(0, 2, 'elephant', 'black', 'b_e1');
  place(0, 3, 'advisor', 'black', 'b_a1');
  place(0, 4, 'general', 'black', 'b_k');
  place(0, 5, 'advisor', 'black', 'b_a2');
  place(0, 6, 'elephant', 'black', 'b_e2');
  place(0, 7, 'horse', 'black', 'b_h2');
  place(0, 8, 'chariot', 'black', 'b_r2');

  place(2, 1, 'cannon', 'black', 'b_c1');
  place(2, 7, 'cannon', 'black', 'b_c2');

  place(3, 0, 'soldier', 'black', 'b_s1');
  place(3, 2, 'soldier', 'black', 'b_s2');
  place(3, 4, 'soldier', 'black', 'b_s3');
  place(3, 6, 'soldier', 'black', 'b_s4');
  place(3, 8, 'soldier', 'black', 'b_s5');

  // Red pieces (bottom: rows 5 to 9)
  place(9, 0, 'chariot', 'red', 'r_r1');
  place(9, 1, 'horse', 'red', 'r_h1');
  place(9, 2, 'elephant', 'red', 'r_e1');
  place(9, 3, 'advisor', 'red', 'r_a1');
  place(9, 4, 'general', 'red', 'r_k');
  place(9, 5, 'advisor', 'red', 'r_a2');
  place(9, 6, 'elephant', 'red', 'r_e2');
  place(9, 7, 'horse', 'red', 'r_h2');
  place(9, 8, 'chariot', 'red', 'r_r2');

  place(7, 1, 'cannon', 'red', 'r_c1');
  place(7, 7, 'cannon', 'red', 'r_c2');

  place(6, 0, 'soldier', 'red', 'r_s1');
  place(6, 2, 'soldier', 'red', 'r_s2');
  place(6, 4, 'soldier', 'red', 'r_s3');
  place(6, 6, 'soldier', 'red', 'r_s4');
  place(6, 8, 'soldier', 'red', 'r_s5');

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}

// In Palace check
export function isInPalace(r: number, c: number, color: PieceColor): boolean {
  if (c < 3 || c > 5) return false;
  if (color === 'red') {
    return r >= 7 && r <= 9;
  } else {
    return r >= 0 && r <= 2;
  }
}

// Has crossed river check
export function hasCrossedRiver(r: number, color: PieceColor): boolean {
  return color === 'red' ? r <= 4 : r >= 5;
}

// Count intervening pieces along a straight line (orthogonal)
export function countBetween(board: Board, from: Position, to: Position): number {
  let count = 0;
  if (from.r === to.r) {
    const minC = Math.min(from.c, to.c);
    const maxC = Math.max(from.c, to.c);
    for (let c = minC + 1; c < maxC; c++) {
      if (board[from.r][c] !== null) count++;
    }
  } else if (from.c === to.c) {
    const minR = Math.min(from.r, to.r);
    const maxR = Math.max(from.r, to.r);
    for (let r = minR + 1; r < maxR; r++) {
      if (board[r][from.c] !== null) count++;
    }
  } else {
    return -1; // Not orthogonal
  }
  return count;
}

// Find General position
export function findGeneral(board: Board, color: PieceColor): Position | null {
  const minR = color === 'red' ? 7 : 0;
  const maxR = color === 'red' ? 9 : 2;
  for (let r = minR; r <= maxR; r++) {
    for (let c = 3; c <= 5; c++) {
      const p = board[r][c];
      if (p && p.type === 'general' && p.color === color) {
        return { r, c };
      }
    }
  }
  return null;
}

// Flying General check (Đối mặt tướng)
export function areGeneralsFacing(board: Board): boolean {
  const redK = findGeneral(board, 'red');
  const blackK = findGeneral(board, 'black');
  if (!redK || !blackK) return false;
  if (redK.c !== blackK.c) return false;

  // Check if anything between them
  for (let r = blackK.r + 1; r < redK.r; r++) {
    if (board[r][redK.c] !== null) return false;
  }
  return true;
}

// Pseudo-legal move validation (geometry & obstacle checks, ignoring self-check)
export function isPseudoLegalMove(board: Board, from: Position, to: Position): boolean {
  if (from.r === to.r && from.c === to.c) return false;
  if (to.r < 0 || to.r > 9 || to.c < 0 || to.c > 8) return false;

  const piece = board[from.r][from.c];
  if (!piece) return false;

  const dest = board[to.r][to.c];
  if (dest && dest.color === piece.color) return false; // Cannot capture ally

  const dr = to.r - from.r;
  const dc = to.c - from.c;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  switch (piece.type) {
    case 'general': {
      if (!isInPalace(to.r, to.c, piece.color)) return false;
      return (absDr === 1 && absDc === 0) || (absDr === 0 && absDc === 1);
    }

    case 'advisor': {
      if (!isInPalace(to.r, to.c, piece.color)) return false;
      return absDr === 1 && absDc === 1;
    }

    case 'elephant': {
      // Must not cross river
      if (piece.color === 'red' && to.r < 5) return false;
      if (piece.color === 'black' && to.r > 4) return false;

      // Exactly 2 diagonally
      if (absDr !== 2 || absDc !== 2) return false;

      // Elephant eye check
      const eyeR = from.r + dr / 2;
      const eyeC = from.c + dc / 2;
      if (board[eyeR][eyeC] !== null) return false;

      return true;
    }

    case 'horse': {
      if (absDr === 2 && absDc === 1) {
        // Leg blocked horizontally
        const legR = from.r + dr / 2;
        if (board[legR][from.c] !== null) return false;
        return true;
      }
      if (absDr === 1 && absDc === 2) {
        // Leg blocked vertically
        const legC = from.c + dc / 2;
        if (board[from.r][legC] !== null) return false;
        return true;
      }
      return false;
    }

    case 'chariot': {
      if (absDr !== 0 && absDc !== 0) return false;
      const cnt = countBetween(board, from, to);
      return cnt === 0;
    }

    case 'cannon': {
      if (absDr !== 0 && absDc !== 0) return false;
      const cnt = countBetween(board, from, to);
      if (dest === null) {
        return cnt === 0; // Move
      } else {
        return cnt === 1; // Capture over a piece
      }
    }

    case 'soldier': {
      const forwardDir = piece.color === 'red' ? -1 : 1;
      const crossed = hasCrossedRiver(from.r, piece.color);

      // Forward 1 step
      if (dr === forwardDir && dc === 0) return true;

      // After river: can also move sideways 1 step
      if (crossed && dr === 0 && absDc === 1) return true;

      return false;
    }

    default:
      return false;
  }
}

// Check if a color's king is currently in check
export function isKingInCheck(board: Board, color: PieceColor): boolean {
  const kingPos = findGeneral(board, color);
  if (!kingPos) return false;

  const enemyColor: PieceColor = color === 'red' ? 'black' : 'red';

  // Check if flying general faces
  if (areGeneralsFacing(board)) return true;

  // Check all enemy pieces
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.color === enemyColor) {
        if (isPseudoLegalMove(board, { r, c }, kingPos)) {
          return true;
        }
      }
    }
  }

  return false;
}

// Check if a move is fully legal (leaves own king safe & no facing generals)
export function isLegalMove(board: Board, from: Position, to: Position): boolean {
  const piece = board[from.r][from.c];
  if (!piece) return false;

  if (!isPseudoLegalMove(board, from, to)) return false;

  // Simulate move
  const tempBoard = cloneBoard(board);
  tempBoard[to.r][to.c] = piece;
  tempBoard[from.r][from.c] = null;

  // Illegal if own king is in check
  if (isKingInCheck(tempBoard, piece.color)) return false;

  // Illegal if generals face each other directly
  if (areGeneralsFacing(tempBoard)) return false;

  return true;
}

// Get all legal moves for a specific piece
export function getLegalMovesForPiece(board: Board, from: Position): Position[] {
  const piece = board[from.r][from.c];
  if (!piece) return [];

  const moves: Position[] = [];

  // Candidate generation optimization based on piece type
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      if (isLegalMove(board, from, { r, c })) {
        moves.push({ r, c });
      }
    }
  }

  return moves;
}

// Get all legal moves for a player
export function getAllLegalMoves(board: Board, color: PieceColor): { from: Position; to: Position }[] {
  const allMoves: { from: Position; to: Position }[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        const moves = getLegalMovesForPiece(board, { r, c });
        moves.forEach(to => allMoves.push({ from: { r, c }, to }));
      }
    }
  }
  return allMoves;
}

// Vietnamese Xiangqi Move Notation Generator
export function getMoveNotation(
  _boardBefore: Board,
  from: Position,
  to: Position,
  piece: Piece
): string {
  const isRed = piece.color === 'red';

  // Vietnamese piece names
  const nameMap: Record<PieceType, { red: string; black: string }> = {
    general: { red: 'Tướng', black: 'Tướng' },
    advisor: { red: 'Sĩ', black: 'Sĩ' },
    elephant: { red: 'Tượng', black: 'Tượng' },
    horse: { red: 'Mã', black: 'Mã' },
    chariot: { red: 'Xe', black: 'Xe' },
    cannon: { red: 'Pháo', black: 'Pháo' },
    soldier: { red: 'Binh', black: 'Tốt' },
  };

  const pName = isRed ? nameMap[piece.type].red : nameMap[piece.type].black;

  // Column numbers (1 to 9 from player's right-to-left)
  const fromCol = isRed ? 9 - from.c : from.c + 1;
  const toCol = isRed ? 9 - to.c : to.c + 1;

  const dr = to.r - from.r;
  const dc = to.c - from.c;

  // Movement direction
  let action = '';
  let targetVal = 0;

  if (dr === 0) {
    action = 'bình';
    targetVal = toCol;
  } else {
    const isMovingForward = isRed ? dr < 0 : dr > 0;
    action = isMovingForward ? 'tiến' : 'thoái';

    // Linear pieces report step count, diagonal pieces report destination column
    const isLinear = piece.type === 'chariot' || piece.type === 'cannon' || piece.type === 'soldier' || (piece.type === 'general' && dc === 0);

    if (isLinear) {
      targetVal = Math.abs(dr);
    } else {
      targetVal = toCol;
    }
  }

  return `${pName} ${fromCol} ${action} ${targetVal}`;
}

// Piece Character and Tooltip Map
export const PIECE_SYMBOLS = {
  red: {
    general: { char: '帥', viName: 'Soái (Tướng)', short: 'T' },
    advisor: { char: '仕', viName: 'Sĩ', short: 'S' },
    elephant: { char: '相', viName: 'Tượng (Tướng)', short: 'X' },
    horse: { char: '傌', viName: 'Mã', short: 'M' },
    chariot: { char: '俥', viName: 'Xe', short: 'X' },
    cannon: { char: '炮', viName: 'Pháo', short: 'P' },
    soldier: { char: '兵', viName: 'Binh (Tốt)', short: 'B' },
  },
  black: {
    general: { char: '將', viName: 'Tướng', short: 'T' },
    advisor: { char: '士', viName: 'Sĩ', short: 'S' },
    elephant: { char: '象', viName: 'Tượng (Voi)', short: 'V' },
    horse: { char: '馬', viName: 'Mã', short: 'M' },
    chariot: { char: '車', viName: 'Xe', short: 'X' },
    cannon: { char: '砲', viName: 'Pháo', short: 'P' },
    soldier: { char: '卒', viName: 'Tốt', short: 'C' },
  },
};
