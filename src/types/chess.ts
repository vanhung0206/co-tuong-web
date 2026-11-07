export type PieceType = 
  | 'general'   // Tướng / Soái (帅 / 将)
  | 'advisor'   // Sĩ (仕 / 士)
  | 'elephant'  // Tượng (相 / 象)
  | 'horse'     // Mã (傌 / 马)
  | 'chariot'   // Xe (俥 / 车)
  | 'cannon'    // Pháo (炮 / 砲)
  | 'soldier';  // Tốt / Binh (兵 / 卒)

export type PieceColor = 'red' | 'black';

export interface Piece {
  id: string;
  type: PieceType;
  color: PieceColor;
}

export interface Position {
  r: number; // 0 to 9 (0 is Black base row, 9 is Red base row)
  c: number; // 0 to 8 (from left to right when viewing from Red's perspective)
}

export type Board = (Piece | null)[][];

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured: Piece | null;
  notation: string;
  isCheck?: boolean;
}

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw' | 'resigned';

export interface CapturedPieces {
  red: Piece[];   // Pieces captured by Red (these are black pieces)
  black: Piece[]; // Pieces captured by Black (these are red pieces)
}

export type PieceTheme = 'classic-wood' | 'imperial-jade' | 'modern-dark';

export interface GameSettings {
  soundEnabled: boolean;
  showHints: boolean;
  flipOnTurn: boolean;
  theme: PieceTheme;
  timerMinutes: number; // 0 means unlimited
}
