import type { Position } from '../types/chess';

export interface OpponentBranch {
  move: {
    from: Position;
    to: Position;
    notation: string;
  };
  name: string; // e.g. "Bình Phong Mã (M8.7)", "Thuận Pháo (P8-5)"
  frequency: string; // e.g. "65% cao thủ sử dụng"
  description: string; // Ý đồ của đối thủ
  counterMove: string; // Nước bạn sẽ phản đòn
  counterExplanation: string; // Giải thích nước phản đòn
}

export interface OpeningNode {
  id: string;
  openingName: string;
  variationName: string;
  stepNumber: number; // 1 to 25+
  phaseName: string; // "Khai thông lực lượng", "Tranh chấp bờ sông", "Đột kích trung lộ", etc.
  turn: 'red' | 'black';
  recommendedMove: {
    from: Position;
    to: Position;
    notation: string;
    name: string;
    explanation: string;
    tacticalTip?: string;
  };
  candidateMoves?: {
    from: Position;
    to: Position;
    notation: string;
    name: string;
    description: string;
  }[];
  opponentBranches?: OpponentBranch[];
}

export const formatPosKey = (from: Position, to: Position): string =>
  `${from.r},${from.c}->${to.r},${to.c}`;

export const OPENING_TREE: Record<string, OpeningNode> = {
  // ROOT: Ván cờ vừa bắt đầu, chưa đi nước nào
  '': {
    id: 'root',
    openingName: 'Lựa Chọn Khai Cuộc Đại Sư',
    variationName: 'Nước 1/20: Khởi đầu trận địa',
    stepNumber: 1,
    phaseName: 'Khai Thông Lực Lượng (Nước 1 - 5)',
    turn: 'red',
    recommendedMove: {
      from: { r: 7, c: 7 }, // Pháo 2
      to: { r: 7, c: 4 },   // Bình 5
      notation: 'Pháo 2 bình 5 (P2-5)',
      name: 'Vào Pháo Đầu (Trung Pháo)',
      explanation: 'Khai cuộc uy lực và lợi hại nhất trong lịch sử cờ tướng. Pháo chiếm lĩnh trung tâm lộ 5, ghim thẳng vào Tốt đầu và uy hiếp cung Tướng của đối thủ.',
      tacticalTip: 'Pháo đầu áp đặt thế chủ động ngay từ nước 1, buộc đối phương phải chọn phương án phòng thủ.',
    },
    candidateMoves: [
      {
        from: { r: 6, c: 2 },
        to: { r: 5, c: 2 },
        notation: 'Binh 7 tiến 1 (B7.1)',
        name: 'Tiên Nhân Chỉ Lộ',
        description: 'Dâng Tốt thăm dò ý đồ đối phương, mở đường cho Mã lộ 7 phát triển cực kỳ linh hoạt.',
      },
      {
        from: { r: 9, c: 6 },
        to: { r: 7, c: 4 },
        notation: 'Tượng 3 tiến 5 (T3.5)',
        name: 'Phi Tượng Cuộc',
        description: 'Lối đánh chắc chắn, phòng ngự phản công vững như bàn thạch, hạn chế tối đa rủi ro.',
      },
      {
        from: { r: 9, c: 7 },
        to: { r: 7, c: 6 },
        notation: 'Mã 2 tiến 3 (M2.3)',
        name: 'Khởi Mã Cuộc',
        description: 'Phát triển quân đều đặn, không để lộ sơ hở trung lộ, tùy cơ ứng biến theo nước đi đối thủ.',
      },
    ],
    opponentBranches: [
      {
        move: { from: { r: 0, c: 7 }, to: { r: 2, c: 6 }, notation: 'Mã 8 tiến 7 (M8.7)' },
        name: 'Bình Phong Mã',
        frequency: '65% cao thủ sử dụng',
        description: 'Lên Mã giữ Tốt đầu, hình thành hàng phòng thủ kiên cố nhất để chống Pháo đầu.',
        counterMove: 'Mã 2 tiến 3 (M2.3)',
        counterExplanation: 'Lên Mã giữ chắc Tốt đầu của mình, đồng thời chuẩn bị thông đường cho Xe 1 xuất kích.',
      },
      {
        move: { from: { r: 2, c: 7 }, to: { r: 2, c: 4 }, notation: 'Pháo 8 bình 5 (P8-5)' },
        name: 'Thuận Pháo (Đôi công)',
        frequency: '20% đối kháng nảy lửa',
        description: 'Đen cũng vào Pháo đầu cùng cánh khiêu chiến, sẵn sàng ăn miếng trả miếng trực diện.',
        counterMove: 'Mã 2 tiến 3 (M2.3)',
        counterExplanation: 'Bắt buộc lên Mã giữ Tốt trung lộ, tuyệt đối không vội đổi Pháo làm mất tiên.',
      },
      {
        move: { from: { r: 0, c: 2 }, to: { r: 2, c: 4 }, notation: 'Tượng 3 tiến 5 (T3.5)' },
        name: 'Phi Tượng Cuộc',
        frequency: '8% phòng ngự hòa hoãn',
        description: 'Đen lên Tượng giữa để bảo vệ Tốt đầu, chủ trương đánh hòa hoãn chắc chắn.',
        counterMove: 'Binh 5 tiến 1 (Ủi Tốt đầu)',
        counterExplanation: 'Vì Tượng đen đã rời đáy, Đỏ ủi Binh 5 tiến 1 xuyên thẳng tim đối phương!',
      },
    ],
  },

  // Nước 2: Đen đáp trả
  '7,7->7,4': {
    id: 'trung_phao_step2',
    openingName: 'Trung Pháo Đương Đầu',
    variationName: 'Nước 2/20: Đối thủ phòng thủ Tốt đầu',
    stepNumber: 2,
    phaseName: 'Khai Thông Lực Lượng (Nước 1 - 5)',
    turn: 'black',
    recommendedMove: {
      from: { r: 0, c: 7 },
      to: { r: 2, c: 6 },
      notation: 'Mã 8 tiến 7 (M8.7)',
      name: 'Bình Phong Mã Giữ Tốt Đầu',
      explanation: 'Nước đỡ chuẩn xác và phổ biến nhất của Đen. Nhảy Mã giữ Tốt trung tâm, mở đường cho Xe 9 xuất chiến.',
      tacticalTip: 'Không lên Mã sớm sẽ bị Pháo đầu bắn thủng hàng ngũ trung lộ.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 7 }, to: { r: 2, c: 6 }, notation: 'Mã 8 tiến 7 (M8.7)' },
        name: 'Bình Phong Mã (Phương án số 1)',
        frequency: '65% cao thủ',
        description: 'Lên Mã giữ Tốt đầu kiên cố, chuẩn bị cho thế trận Bình Phong Mã.',
        counterMove: 'Mã 2 tiến 3 (M2.3)',
        counterExplanation: 'Đỏ lên Mã giữ Tốt 5, chuẩn bị mở Xe 1 ra lộ 2.',
      },
      {
        move: { from: { r: 2, c: 7 }, to: { r: 2, c: 4 }, notation: 'Pháo 8 bình 5 (P8-5)' },
        name: 'Thuận Pháo (Quyết chiến đôi công)',
        frequency: '20% ưa đôi công',
        description: 'Đen vào Pháo đầu trực diện, hai bên thi thố đòn công phá trung lộ.',
        counterMove: 'Mã 2 tiến 3 (M2.3)',
        counterExplanation: 'Bảo vệ Tốt đầu, sau đó xuất nhanh Xe 1 bình 2 chiếm ưu thế tiên.',
      },
    ],
  },

  // Nước 3 (Đỏ): Mã 2 tiến 3
  '7,7->7,4|0,7->2,6': {
    id: 'trung_phao_step3',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước 3/20: Đỏ triển khai Mã cánh phải',
    stepNumber: 3,
    phaseName: 'Khai Thông Lực Lượng (Nước 1 - 5)',
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 7 },
      to: { r: 7, c: 6 },
      notation: 'Mã 2 tiến 3 (M2.3)',
      name: 'Lên Mã Cánh Phải Giữ Trung Lộ',
      explanation: 'Bảo vệ Tốt đầu, thiết lập thế trận công thủ toàn diện và chuẩn bị mở đường cho Xe 1 xuất kích tranh tiên.',
      tacticalTip: 'Nước đi chuẩn mực của mọi danh thủ. Đừng vội xuất Xe khi Mã chưa lên bảo vệ Tốt đầu.',
    },
  },

  // Nước 4 (Đen): Xe 9 bình 8
  '7,7->7,4|0,7->2,6|9,7->7,6': {
    id: 'trung_phao_step4',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước 4/20: Đen xuất Xe chiếm lộ 8',
    stepNumber: 4,
    phaseName: 'Khai Thông Lực Lượng (Nước 1 - 5)',
    turn: 'black',
    recommendedMove: {
      from: { r: 0, c: 8 },
      to: { r: 0, c: 7 },
      notation: 'Xe 9 bình 8 (X9-8)',
      name: 'Xuất Xe Khống Chế Lộ Sườn',
      explanation: 'Nước đi kinh điển của Đen: Mở Xe chủ lực ra kiểm soát lộ 8.',
    },
  },

  // Nước 5 (Đỏ): Xe 1 bình 2
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7': {
    id: 'trung_phao_step5',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước 5/20: Đỏ tranh tiên xuất Xe',
    stepNumber: 5,
    phaseName: 'Khai Thông Lực Lượng (Nước 1 - 5)',
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 8 },
      to: { r: 9, c: 7 },
      notation: 'Xe 1 bình 2 (X1-2)',
      name: 'Xuất Xe Cánh Phải Chiếm Lộ 2',
      explanation: 'Xe Đỏ ra lộ 2 tạo thế sẵn sàng xông lên qua sông. Đỏ giữ quyền chủ động tấn công.',
      tacticalTip: 'Ai xuất Xe chậm hơn 1 nhịp sẽ lập tức bị ép vào thế phòng thủ bị động.',
    },
  },

  // Nước 6 (Đen): Mã 2 tiến 3
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7': {
    id: 'trung_phao_step6',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước 6/20: Đen hoàn tất Bình Phong Mã',
    stepNumber: 6,
    phaseName: 'Xung Đột Tiền Tuyến (Nước 6 - 10)',
    turn: 'black',
    recommendedMove: {
      from: { r: 0, c: 1 },
      to: { r: 2, c: 2 },
      notation: 'Mã 2 tiến 3 (M2.3)',
      name: 'Đen Lên Nốt Mã Hoàn Tất Bình Phong',
      explanation: 'Hai Mã đen che chắn hoàn hảo toàn bộ tuyến giữa.',
    },
  },

  // Nước 7 (Đỏ): Binh 7 tiến 1
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2': {
    id: 'trung_phao_step7',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước 7/20: Khóa chân Mã đối phương',
    stepNumber: 7,
    phaseName: 'Xung Đột Tiền Tuyến (Nước 6 - 10)',
    turn: 'red',
    recommendedMove: {
      from: { r: 6, c: 2 },
      to: { r: 5, c: 2 },
      notation: 'Binh 7 tiến 1 (B7.1)',
      name: 'Mở Binh 7 Khóa Chân Mã Đen',
      explanation: 'Nước cờ chiến lược then chốt! Mở đường cho Mã đỏ nhảy lên, đồng thời ngăn chặn Mã đen.',
      tacticalTip: 'Binh 7 tiến 1 là linh hồn của thế trận Trung Pháo Quá Hà Xa.',
    },
  },

  // Nước 8 (Đen): Binh 7 tiến 1
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2': {
    id: 'trung_phao_step8',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước 8/20: Đen giải phóng cánh Mã',
    stepNumber: 8,
    phaseName: 'Xung Đột Tiền Tuyến (Nước 6 - 10)',
    turn: 'black',
    recommendedMove: {
      from: { r: 3, c: 6 },
      to: { r: 4, c: 6 },
      notation: 'Binh 7 tiến 1 (B7.1)',
      name: 'Đen Cũng Mở Đường Cho Mã',
      explanation: 'Đen tiến Binh 7 để giải phóng cánh Mã của mình khỏi thế kẹt.',
    },
  },

  // Nước 9 (Đỏ): Xe 2 tiến 6 (Quá Hà Xa)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6': {
    id: 'trung_phao_step9',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước 9/20: Xe vượt sông công kích',
    stepNumber: 9,
    phaseName: 'Xung Đột Tiền Tuyến (Nước 6 - 10)',
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 7 },
      to: { r: 3, c: 7 },
      notation: 'Xe 2 tiến 6 (X2.6 - Quá Hà Xa)',
      name: 'Xe 2 Vượt Sông Đè Hàng Tốt',
      explanation: 'Quân Xe Đỏ tiến sâu vào hàng Tốt của Đen, chuẩn bị đè đầu Mã đen tại (2, 6).',
      tacticalTip: 'Xe qua sông khống chế bờ hào là đòn đánh áp đảo nhất của Đỏ.',
    },
  },

  // Nước 10 (Đen): Pháo 8 bình 9 (Đuổi Xe)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7': {
    id: 'trung_phao_step10',
    openingName: 'Bình Phong Mã Hiện Đại',
    variationName: 'Nước 10/20: Đen dạt Pháo biên đuổi Xe',
    stepNumber: 10,
    phaseName: 'Xung Đột Tiền Tuyến (Nước 6 - 10)',
    turn: 'black',
    recommendedMove: {
      from: { r: 2, c: 6 },
      to: { r: 2, c: 8 },
      notation: 'Pháo 8 bình 9 (P8-9)',
      name: 'Đen Mở Pháo Biên Đuổi Xe',
      explanation: 'Đen mở Pháo ra biên dọn đường cho Xe 8 dâng lên phản kích.',
    },
  },

  // Nước 11 (Đỏ): Xe 2 bình 3 (Đè Mã!)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8': {
    id: 'trung_phao_step11',
    openingName: 'Chiến Thuật Ghìm Mã Khóa Cánh',
    variationName: 'Nước 11/20: Xe đè đầu Mã đen',
    stepNumber: 11,
    phaseName: 'Điều Động Trung Cuộc (Nước 11 - 15)',
    turn: 'red',
    recommendedMove: {
      from: { r: 3, c: 7 },
      to: { r: 3, c: 6 },
      notation: 'Xe 2 bình 3 (X2-3)',
      name: 'Xe Đè Đầu Mã Đen Lộ 3',
      explanation: 'Xe né sang lộ 3 đè đúng lên đầu con Mã đen tại (2, 6). Cánh phải đối phương tê liệt hoàn toàn.',
      tacticalTip: 'Mã bị đè thì cánh cờ đối thủ sẽ vỡ vụn.',
    },
  },

  // Nước 12 (Đen): Pháo 9 tiến 4 (Qua sông phục kích)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6': {
    id: 'trung_phao_step12',
    openingName: 'Bình Phong Mã Phản Kích',
    variationName: 'Nước 12/20: Pháo đen qua sông',
    stepNumber: 12,
    phaseName: 'Điều Động Trung Cuộc (Nước 11 - 15)',
    turn: 'black',
    recommendedMove: {
      from: { r: 2, c: 8 },
      to: { r: 6, c: 8 },
      notation: 'Pháo 9 tiến 4 (P9.4)',
      name: 'Pháo Đen Tiến Qua Sông Đe Dọa',
      explanation: 'Đen dâng Pháo biên sang đe dọa cánh Tượng đỏ để giải tỏa bớt áp lực.',
    },
  },

  // Nước 13 (Đỏ): Mã 8 tiến 7
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8': {
    id: 'trung_phao_step13',
    openingName: 'Củng Cố Toàn Tuyến',
    variationName: 'Nước 13/20: Đỏ phát triển toàn bộ lực lượng',
    stepNumber: 13,
    phaseName: 'Điều Động Trung Cuộc (Nước 11 - 15)',
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 1 },
      to: { r: 7, c: 2 },
      notation: 'Mã 8 tiến 7 (M8.7)',
      name: 'Lên Mã Cánh Trái Hoàn Chỉnh Trận Đồ',
      explanation: 'Đưa nốt quân Mã cánh trái lên trung tâm, bảo vệ Tượng lộ 7 và kết nối toàn bộ hệ thống phòng thủ.',
      tacticalTip: 'Phát triển đều cả 2 cánh giúp Đỏ không còn bất kỳ điểm yếu nào.',
    },
  },

  // Nước 14 (Đen): Sĩ 4 tiến 5
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8|9,1->7,2': {
    id: 'trung_phao_step14',
    openingName: 'Gia Cố Cung Tướng',
    variationName: 'Nước 14/20: Đen củng cố trung cung',
    stepNumber: 14,
    phaseName: 'Điều Động Trung Cuộc (Nước 11 - 15)',
    turn: 'black',
    recommendedMove: {
      from: { r: 0, c: 5 },
      to: { r: 1, c: 4 },
      notation: 'Sĩ 4 tiến 5 (S4.5)',
      name: 'Lên Sĩ Che Chắn Cung Tướng',
      explanation: 'Đen gia cố trung lộ, chuẩn bị mở đường đưa Xe 1 sang tham chiến.',
    },
  },

  // Nước 15 (Đỏ): Pháo 8 bình 7 (Ngũ Thất Pháo!)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8|9,1->7,2|0,5->1,4': {
    id: 'trung_phao_step15',
    openingName: 'Đại Trận Ngũ Thất Pháo Oanh Kích',
    variationName: 'Nước 15/20: Chuyển Pháo lộ 7 ép chết cánh Mã',
    stepNumber: 15,
    phaseName: 'Điều Động Trung Cuộc (Nước 11 - 15)',
    turn: 'red',
    recommendedMove: {
      from: { r: 7, c: 1 },
      to: { r: 7, c: 2 },
      notation: 'Pháo 8 bình 7 (P8-7)',
      name: 'Chuyển Sang Thế Trận Ngũ Thất Pháo',
      explanation: 'Pháo 8 chuyển sang lộ 7, phối hợp cùng Xe 3 tạo thành thế gọng kìm 2 đánh 1 nhắm thẳng vào Tượng và Mã cánh yếu của Đen!',
      tacticalTip: 'Ngũ Thất Pháo là đòn đánh bẻ gãy cánh cờ khét tiếng nhất lịch sử.',
    },
  },

  // Nước 16 (Đen): Xe 1 bình 2
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8|9,1->7,2|0,5->1,4|7,1->7,2': {
    id: 'trung_phao_step16',
    openingName: 'Xuất Xe Kháng Cự',
    variationName: 'Nước 16/20: Đen xuất quân Xe còn lại',
    stepNumber: 16,
    phaseName: 'Tổng Tấn Công Quyết Định (Nước 16 - 20)',
    turn: 'black',
    recommendedMove: {
      from: { r: 0, c: 0 },
      to: { r: 0, c: 1 },
      notation: 'Xe 1 bình 2 (X1-2)',
      name: 'Đen Mở Nốt Xe Cánh Phải',
      explanation: 'Đen vội vã đưa quân Xe còn lại ra trận để cứu vãn thế cờ.',
    },
  },

  // Nước 17 (Đỏ): Binh 5 tiến 1 (Lao Tốt đầu phá toang trung lộ!)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8|9,1->7,2|0,5->1,4|7,1->7,2|0,0->0,1': {
    id: 'trung_phao_step17',
    openingName: 'Đột Kích Trung Lộ Sấm Sét',
    variationName: 'Nước 17/20: Dâng Binh 5 tiến 1 xuyên tim!',
    stepNumber: 17,
    phaseName: 'Tổng Tấn Công Quyết Định (Nước 16 - 20)',
    turn: 'red',
    recommendedMove: {
      from: { r: 6, c: 4 },
      to: { r: 5, c: 4 },
      notation: 'Binh 5 tiến 1 (B5.1)',
      name: 'Lao Tốt Đầu Xuyên Thủng Cung Phòng Thủ',
      explanation: 'Đòn công kích trung tâm mãnh liệt! Tốt đầu dâng lên bờ sông làm ngòi cho Pháo giữa và mở đường cho Mã 7 nhảy lên (Mã 7 tiến 5).',
      tacticalTip: 'Khi đã kiềm tỏa được cánh cờ, lập tức đánh sập trung lộ để kết thúc trận đánh.',
    },
  },

  // Nước 18 (Đen): Tốt 5 tiến 1 (Ăn đổi Tốt)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8|9,1->7,2|0,5->1,4|7,1->7,2|0,0->0,1|6,4->5,4': {
    id: 'trung_phao_step18',
    openingName: 'Đen Bắt Buộc Ăn Tốt',
    variationName: 'Nước 18/20: Đen ăn đổi Tốt đầu',
    stepNumber: 18,
    phaseName: 'Tổng Tấn Công Quyết Định (Nước 16 - 20)',
    turn: 'black',
    recommendedMove: {
      from: { r: 3, c: 4 },
      to: { r: 4, c: 4 },
      notation: 'Binh 5 tiến 1 (B5.1)',
      name: 'Đen Ăn Đổi Tốt Trung Lộ',
      explanation: 'Đen bắt buộc phải đổi Tốt, nếu không Tốt đỏ sẽ xông thẳng qua sông uy hiếp.',
    },
  },

  // Nước 19 (Đỏ): Pháo 5 tiến 3 (Ăn Tốt chiếu tướng!)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8|9,1->7,2|0,5->1,4|7,1->7,2|0,0->0,1|6,4->5,4|3,4->4,4': {
    id: 'trung_phao_step19',
    openingName: 'Pháo Đầu Chiếu Tướng Trực Diện',
    variationName: 'Nước 19/20: Pháo 5 tiến 3 chém Tốt chiếu!',
    stepNumber: 19,
    phaseName: 'Tổng Tấn Công Quyết Định (Nước 16 - 20)',
    turn: 'red',
    recommendedMove: {
      from: { r: 7, c: 4 },
      to: { r: 4, c: 4 },
      notation: 'Pháo 5 tiến 3 (P5.3 - Chiếu Tướng!)',
      name: 'Pháo Ăn Tốt Nhắm Thẳng Tướng Đen',
      explanation: 'Pháo Đỏ ăn Tốt chiếu tướng sấm sét! Quân Đen hoàn toàn rối loạn trận hình.',
      tacticalTip: 'Nước chiếu tướng này buộc Đen phải bay Tượng lên đỡ, làm rách toang tuyến phòng thủ đáy.',
    },
  },

  // Nước 20 (Đen): Tượng 3 tiến 5 (Bay Tượng cản chiếu)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8|3,7->3,6|2,8->6,8|9,1->7,2|0,5->1,4|7,1->7,2|0,0->0,1|6,4->5,4|3,4->4,4|7,4->4,4': {
    id: 'trung_phao_step20',
    openingName: 'Hoàn Tất 20 Nước Chuẩn Đại Sư',
    variationName: 'Nước 20/20: Đỏ chiếm thế thượng phong tuyệt đối!',
    stepNumber: 20,
    phaseName: 'Tổng Tấn Công Quyết Định (Nước 16 - 20)',
    turn: 'black',
    recommendedMove: {
      from: { r: 0, c: 2 },
      to: { r: 2, c: 4 },
      notation: 'Tượng 3 tiến 5 (T3.5)',
      name: 'Đen Bay Tượng Hóa Giải Nước Chiếu',
      explanation: 'Đen bắt buộc phải bay Tượng lên cản Pháo. Tại đây, Đỏ bước vào trung cuộc với thế chủ động áp đảo!',
      tacticalTip: 'Chúc mừng bạn! Bạn đã hoàn tất chuẩn mực 20 nước kinh điển của Đại sư Cờ Tướng.',
    },
  },
};

/**
 * Find opening node for current sequence of moves.
 */
export function getOpeningNodeForMoves(
  moves: { from: Position; to: Position }[]
): OpeningNode | null {
  const fullKey = moves.map(m => formatPosKey(m.from, m.to)).join('|');
  if (OPENING_TREE[fullKey]) {
    return OPENING_TREE[fullKey];
  }

  // Fallback to closest prefix
  for (let len = moves.length; len >= 0; len--) {
    const subKey = moves.slice(0, len).map(m => formatPosKey(m.from, m.to)).join('|');
    if (OPENING_TREE[subKey]) {
      return OPENING_TREE[subKey];
    }
  }

  return null;
}
