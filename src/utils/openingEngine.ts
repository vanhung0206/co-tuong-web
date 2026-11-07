import type { Position } from '../types/chess';

export interface OpponentBranch {
  move: {
    from: Position;
    to: Position;
    notation: string;
  };
  name: string; // e.g. "Bình Phong Mã (M8.7)", "Thuận Pháo (P8-5)"
  frequency: string; // e.g. "65% cao thủ sử dụng", "20% đôi công"
  description: string; // Ý đồ của đối thủ
  counterMove: string; // Nước bạn sẽ phản đòn
  counterExplanation: string; // Giải thích nước phản đòn
}

export interface OpeningNode {
  id: string;
  openingName: string;
  variationName: string;
  stepNumber: number;
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
    openingName: 'Lựa Chọn Khai Cuộc',
    variationName: 'Nước đi đầu tiên của Đỏ',
    stepNumber: 1,
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
      {
        move: { from: { r: 0, c: 1 }, to: { r: 2, c: 2 }, notation: 'Mã 2 tiến 3 (M2.3)' },
        name: 'Phản Cung Mã / Đơn Đề Mã',
        frequency: '5% biến chiêu',
        description: 'Đen lên Mã cánh kia nhằm chuẩn bị thế trận Phản Cung Mã linh hoạt.',
        counterMove: 'Binh 7 tiến 1 (B7.1)',
        counterExplanation: 'Khóa chặt chân Mã đối phương, không cho Mã đen tràn lên trung lộ.',
      },
    ],
  },

  // SAU KHI ĐỎ ĐI: Pháo 2 bình 5 (7,7->7,4)
  '7,7->7,4': {
    id: 'after_p2_5',
    openingName: 'Trung Pháo Đương Đầu',
    variationName: 'Chờ phản đòn từ Đen',
    stepNumber: 2,
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
      {
        move: { from: { r: 0, c: 2 }, to: { r: 2, c: 4 }, notation: 'Tượng 3 tiến 5 (T3.5)' },
        name: 'Phi Tượng Cuộc',
        frequency: '8% phòng thủ',
        description: 'Bay Tượng giữ Tốt, không muốn đối kháng quyết liệt sớm.',
        counterMove: 'Mã 2 tiến 3 rồi Binh 5 tiến 1',
        counterExplanation: 'Dồn toàn lực công phá vào khoảng trống giữa cung Tướng của Đen.',
      },
      {
        move: { from: { r: 0, c: 1 }, to: { r: 2, c: 2 }, notation: 'Mã 2 tiến 3 (M2.3)' },
        name: 'Phản Cung Mã',
        frequency: '5% dẻo dai',
        description: 'Đen lên Mã nghịch cánh chuẩn bị dàn thế Phản Cung Mã uyển chuyển.',
        counterMove: 'Binh 7 tiến 1 (B7.1)',
        counterExplanation: 'Khóa chặt không cho Mã đen vươn qua sông.',
      },
      {
        move: { from: { r: 2, c: 1 }, to: { r: 2, c: 4 }, notation: 'Pháo 2 bình 5 (P2-5)' },
        name: 'Nghịch Pháo (Cực kỳ hung hãn)',
        frequency: '2% cảm tử',
        description: 'Đen dùng Pháo nghịch cánh vào giữa, thế trận sinh tử không hòa hoãn.',
        counterMove: 'Mã 2 tiến 3 rồi Xe 1 bình 2',
        counterExplanation: 'Nhanh chóng xuất Xe 2 tiến 4 tuần hà kiềm tỏa Pháo đối phương.',
      },
    ],
  },

  // ==========================================
  // NHÁNH 1: BÌNH PHONG MÃ (Đen đi M8.7)
  // ==========================================
  '7,7->7,4|0,7->2,6': {
    id: 'trung_phao_vs_bpm_step3',
    openingName: 'Trung Pháo Đối Bình Phong Mã',
    variationName: 'Nước thứ 3: Đỏ triển khai Mã cánh phải',
    stepNumber: 3,
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 7 },
      to: { r: 7, c: 6 },
      notation: 'Mã 2 tiến 3 (M2.3)',
      name: 'Lên Mã Cánh Phải Giữ Trung Lộ',
      explanation: 'Bảo vệ Tốt đầu, thiết lập thế trận công thủ toàn diện và chuẩn bị mở đường cho Xe 1 xuất kích tranh tiên.',
      tacticalTip: 'Nước đi chuẩn mực của mọi danh thủ. Đừng vội xuất Xe khi Mã chưa lên bảo vệ Tốt đầu.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 8 }, to: { r: 0, c: 7 }, notation: 'Xe 9 bình 8 (X9-8)' },
        name: 'Đen xuất Xe chiếm lộ 8',
        frequency: '80% chuẩn mực',
        description: 'Đen tranh thủ đưa Xe chủ lực ra lộ thông thoáng nhất.',
        counterMove: 'Xe 1 bình 2 (X1-2)',
        counterExplanation: 'Đỏ lập tức ra Xe 2 đối đầu, không để đối phương chiếm ưu thế trên mặt trận cánh.',
      },
      {
        move: { from: { r: 0, c: 1 }, to: { r: 2, c: 2 }, notation: 'Mã 2 tiến 3 (M2.3)' },
        name: 'Đen lên Mã hoàn tất Bình Phong',
        frequency: '15% sớm',
        description: 'Đen ưu tiên lên cả hai Mã che chắn trung lộ.',
        counterMove: 'Binh 7 tiến 1 (B7.1)',
        counterExplanation: 'Đỏ lập tức dâng Tốt 7 khóa Mã đen lại, tạo đường cho Mã đỏ nhảy lên.',
      },
    ],
  },

  // SAU KHI ĐỎ M2.3 VÀ ĐEN RA XE 9 BÌNH 8
  '7,7->7,4|0,7->2,6|9,7->7,6': {
    id: 'bpm_black_move4',
    openingName: 'Trung Pháo Đối Bình Phong Mã',
    variationName: 'Đen lựa chọn phát triển quân',
    stepNumber: 4,
    turn: 'black',
    recommendedMove: {
      from: { r: 0, c: 8 },
      to: { r: 0, c: 7 },
      notation: 'Xe 9 bình 8 (X9-8)',
      name: 'Xuất Xe Khống Chế Lộ Sườn',
      explanation: 'Nước đi kinh điển của Đen: Mở Xe chủ lực ra kiểm soát lộ 8.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 8 }, to: { r: 0, c: 7 }, notation: 'Xe 9 bình 8 (X9-8)' },
        name: 'Xuất Xe Lộ 8',
        frequency: 'Nước đi số 1 của Đen',
        description: 'Đưa Xe mạnh nhất ra nghênh chiến.',
        counterMove: 'Xe 1 bình 2 (X1-2)',
        counterExplanation: 'Đỏ ra Xe đối xứng, sẵn sàng dâng cao qua sông.',
      },
    ],
  },

  // SAU KHI ĐEN ĐI X9-8 -> ĐỎ NÊN ĐI: Xe 1 bình 2
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7': {
    id: 'bpm_red_move5',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước thứ 5: Đỏ tranh tiên xuất Xe',
    stepNumber: 5,
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 8 },
      to: { r: 9, c: 7 },
      notation: 'Xe 1 bình 2 (X1-2)',
      name: 'Xuất Xe Cánh Phải Chiếm Lộ 2',
      explanation: 'Xe Đỏ ra lộ 2 tạo thế sẵn sàng xông lên qua sông. Đỏ giữ quyền chủ động tấn công.',
      tacticalTip: 'Ai xuất Xe chậm hơn 1 nhịp sẽ lập tức bị ép vào thế phòng thủ bị động.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 1 }, to: { r: 2, c: 2 }, notation: 'Mã 2 tiến 3 (M2.3)' },
        name: 'Đen lên nốt Mã hoàn tất Bình Phong',
        frequency: '75% phổ biến',
        description: 'Hai Mã đen đứng bảo vệ lẫn nhau kiên cố.',
        counterMove: 'Binh 7 tiến 1 (B7.1)',
        counterExplanation: 'Đỏ đẩy Binh 7 tiến 1 khóa Mã 3 của Đen, đồng thời mở đường cho Mã Đỏ vươn lên.',
      },
      {
        move: { from: { r: 2, c: 7 }, to: { r: 6, c: 7 }, notation: 'Pháo 8 tiến 4 (P8.4 - Phong Xa)' },
        name: 'Pháo Phong Xa',
        frequency: '18% chiến thuật phong tỏa',
        description: 'Đen dâng Pháo qua sông định phong tỏa con Xe 2 của Đỏ.',
        counterMove: 'Mã 8 tiến 7 (M8.7)',
        counterExplanation: 'Đỏ không nao núng, phát triển Mã 8 lên kiểm soát trung tâm và chuẩn bị phản pháo.',
      },
    ],
  },

  // SAU KHI ĐEN HOÀN TẤT BÌNH PHONG MÃ (M2.3)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2': {
    id: 'bpm_red_move7',
    openingName: 'Trung Pháo Quá Hà Xa vs Bình Phong Mã',
    variationName: 'Nước thứ 7: Nước cờ chiến lược khóa Mã',
    stepNumber: 7,
    turn: 'red',
    recommendedMove: {
      from: { r: 6, c: 2 },
      to: { r: 5, c: 2 },
      notation: 'Binh 7 tiến 1 (B7.1)',
      name: 'Mở Binh 7 Khóa Chân Mã Đen',
      explanation: 'Nước cờ then chốt bậc nhất! Vừa mở thông lộ cho Mã 3 của Đỏ chuẩn bị vươn lên, vừa ghìm chặt không cho Mã 3 của Đen nhảy lên lộ 4.',
      tacticalTip: 'Binh 7 tiến 1 là linh hồn của thế trận Trung Pháo Quá Hà Xa.',
    },
    opponentBranches: [
      {
        move: { from: { r: 3, c: 6 }, to: { r: 4, c: 6 }, notation: 'Binh 7 tiến 1 (B7.1)' },
        name: 'Đen cũng tiến Binh 7',
        frequency: '85% đối xứng bắt buộc',
        description: 'Đen mở đường cho Mã của mình để chống bị kẹp chặt.',
        counterMove: 'Xe 2 tiến 6 (Quá Hà Xa)',
        counterExplanation: 'Xe Đỏ phóng thẳng qua sông đè đầu hàng Tốt đối phương!',
      },
    ],
  },

  // SAU KHI CẢ HAI TIẾN BINH 7 -> ĐỎ X2.6 (QUÁ HÀ XA)
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6': {
    id: 'bpm_red_move9_qua_ha_xa',
    openingName: 'Tuyệt Kỹ Quá Hà Xa Đè Bẹp Bình Phong Mã',
    variationName: 'Nước thứ 9: Xe vượt sông xông thẳng vào cứ điểm',
    stepNumber: 9,
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 7 },
      to: { r: 3, c: 7 },
      notation: 'Xe 2 tiến 6 (X2.6 - Quá Hà Xa)',
      name: 'Xe 2 Tiến 6 Sang Sông',
      explanation: 'Con Xe Đỏ tiến sâu vào hàng Tốt của Đen, trực tiếp khống chế toàn bộ tiền tuyến và chuẩn bị đè đầu con Mã đen tại (2, 6).',
      tacticalTip: 'Khi Xe đã sang sông, Đen sẽ buộc phải tìm cách phản kích hoặc chịu thế hạ phong.',
    },
    opponentBranches: [
      {
        move: { from: { r: 2, c: 6 }, to: { r: 2, c: 8 }, notation: 'Pháo 8 bình 9 (P8-9 - Đuổi Xe)' },
        name: 'Đen đi Pháo 8 bình 9 đuổi Xe',
        frequency: '70% cao thủ',
        description: 'Đen mở Pháo ra biên dọn đường cho Xe 8 xông lên và hòng đuổi Xe đỏ.',
        counterMove: 'Xe 2 bình 3 (Đè Mã!)',
        counterExplanation: 'Xe Đỏ né sang lộ 3 đè đúng lên đầu Mã đen tại (2, 6). Cánh phải đối phương tê liệt hoàn toàn!',
      },
      {
        move: { from: { r: 0, c: 5 }, to: { r: 1, c: 4 }, notation: 'Sĩ 4 tiến 5 (S4.5)' },
        name: 'Đen củng cố cung Tướng',
        frequency: '25% phòng ngự sâu',
        description: 'Đen gia cố trung tâm an toàn trước.',
        counterMove: 'Mã 8 tiến 7 rồi Pháo 8 bình 7 (Ngũ Thất Pháo)',
        counterExplanation: 'Đỏ chuyển sang thế trận Ngũ Thất Pháo, tập trung song pháo bắn nát cánh Mã đối phương.',
      },
    ],
  },

  // SAU KHI ĐEN ĐUỔI XE (P8-9) -> ĐỎ XE 2 BÌNH 3 ĐÈ MÃ!
  '7,7->7,4|0,7->2,6|9,7->7,6|0,8->0,7|9,8->9,7|0,1->2,2|6,2->5,2|3,6->4,6|9,7->3,7|2,6->2,8': {
    id: 'bpm_red_move11_de_ma',
    openingName: 'Chiến Thuật Ghìm Mã Khóa Cánh',
    variationName: 'Nước thứ 11: Xe 2 bình 3 đè chặt đầu Mã',
    stepNumber: 11,
    turn: 'red',
    recommendedMove: {
      from: { r: 3, c: 7 },
      to: { r: 3, c: 6 },
      notation: 'Xe 2 bình 3 (X2-3)',
      name: 'Xe Đè Đầu Mã Đen',
      explanation: 'Nước cờ sắc sảo như dao cạo! Xe dạt sang lộ 3 đè gãy thế liên hoàn của 2 Mã đen. Mã đen bị ghim tại chỗ không thể cựa quậy.',
      tacticalTip: 'Mã bị ghìm thì toàn bộ cánh cờ của đối thủ sẽ bị phong tỏa.',
    },
    opponentBranches: [
      {
        move: { from: { r: 2, c: 8 }, to: { r: 6, c: 8 }, notation: 'Pháo 9 tiến 4 (P9.4)' },
        name: 'Đen dâng Pháo biên phản kích',
        frequency: '60%',
        description: 'Đen cố gắng đưa Pháo biên sang đe dọa cánh Tượng đỏ.',
        counterMove: 'Mã 8 tiến 7 (M8.7)',
        counterExplanation: 'Đỏ lên Mã còn lại, thế cờ vững như đồng thép, sẵn sàng tổng tấn công.',
      },
    ],
  },

  // ==========================================
  // NHÁNH 2: THUẬN PHÁO (Đen đi P8-5)
  // ==========================================
  '7,7->7,4|2,7->2,4': {
    id: 'trung_phao_vs_thuan_phao_step3',
    openingName: 'Trung Pháo Đối Thuận Pháo Đôi Công',
    variationName: 'Nước thứ 3: Đỏ củng cố Tốt đầu',
    stepNumber: 3,
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 7 },
      to: { r: 7, c: 6 },
      notation: 'Mã 2 tiến 3 (M2.3)',
      name: 'Lên Mã Bảo Vệ Trung Lộ',
      explanation: 'Trong thế Thuận Pháo, hai bên đều chĩa Pháo vào Tốt đầu của nhau. Đỏ phải lên Mã 3 giữ chắc Tốt 5 trước khi nghĩ đến việc xuất công.',
      tacticalTip: 'Ai chủ quan không giữ Tốt đầu trong Thuận Pháo sẽ bị đối phương bắn thủng tim.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 7 }, to: { r: 2, c: 6 }, notation: 'Mã 8 tiến 7 (M8.7)' },
        name: 'Đen cũng lên Mã giữ Tốt',
        frequency: '85% đối xứng',
        description: 'Đen học theo Đỏ lên Mã bảo vệ Tốt đầu.',
        counterMove: 'Xe 1 bình 2 (X1-2)',
        counterExplanation: 'Đỏ nhanh chóng ra Xe chiếm lộ 2, chuẩn bị bài Xe Tuần Hà chặn bờ sông.',
      },
    ],
  },

  // SAU KHI ĐEN CŨNG LÊN MÃ GIỮ TỐT
  '7,7->7,4|2,7->2,4|9,7->7,6|0,7->2,6': {
    id: 'thuan_phao_step5',
    openingName: 'Thuận Pháo Tranh Tiên Xuất Xe',
    variationName: 'Nước thứ 5: Tranh tiên xuất Xe cánh phải',
    stepNumber: 5,
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 8 },
      to: { r: 9, c: 7 },
      notation: 'Xe 1 bình 2 (X1-2)',
      name: 'Xuất Xe Khống Chế Lộ 2',
      explanation: 'Nhanh chóng đưa quân Xe uy lực nhất vào cuộc chiến, chiếm cứ lộ thông suốt.',
      tacticalTip: 'Trong Thuận Pháo, tốc độ ra Xe quyết định thắng bại đến 70%.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 8 }, to: { r: 1, c: 8 }, notation: 'Xe 9 tiến 1 (X9.1 - Hoành Xa)' },
        name: 'Đen chơi Hoành Xa (Xe ngang)',
        frequency: '65% cao thủ',
        description: 'Đen đưa Xe lên 1 bước để chuyển sang lộ 4 hoặc lộ 6 tấn công.',
        counterMove: 'Xe 2 tiến 4 (Tuần Hà Xa)',
        counterExplanation: 'Đỏ tiến Xe lên bờ sông (hàng 5) phong tỏa tuyệt đối bờ sông, biến Hoành Xa của Đen thành vô dụng!',
      },
      {
        move: { from: { r: 0, c: 8 }, to: { r: 0, c: 7 }, notation: 'Xe 9 bình 8 (X9-8 - Trực Xa)' },
        name: 'Đen chơi Trực Xa',
        frequency: '30%',
        description: 'Đen cũng ra Xe thẳng để đối kháng.',
        counterMove: 'Xe 2 tiến 6 (X2.6 - Quá Hà Xa)',
        counterExplanation: 'Đỏ dâng Xe qua sông đè cánh ép đổi quân có lợi.',
      },
    ],
  },

  // SAU KHI ĐEN ĐI HOÀNH XA (X9.1) -> ĐỎ ĐI XE TUẦN HÀ (X2.4)
  '7,7->7,4|2,7->2,4|9,7->7,6|0,7->2,6|9,8->9,7|0,8->1,8': {
    id: 'thuan_phao_step7',
    openingName: 'Chiến Thuật Khắc Chế Hoành Xa Bằng Tuần Hà Xa',
    variationName: 'Nước thứ 7: Xe 2 tiến 4 chốt chặn bờ sông',
    stepNumber: 7,
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 7 },
      to: { r: 5, c: 7 },
      notation: 'Xe 2 tiến 4 (X2.4 - Tuần Hà Xa)',
      name: 'Xe 2 Tiến 4 Lên Bờ Sông',
      explanation: 'Đòn chặn bờ sông tuyệt luân! Xe Đỏ khống chế trọn hàng ngang bờ sông nhà mình, ngăn không cho Xe ngang của Đen vượt qua, đồng thời hỗ trợ dâng Tốt trung lộ.',
      tacticalTip: 'Khi đối thủ đi Hoành Xa, đi Xe Tuần Hà là cách khắc chế tối ưu nhất.',
    },
    opponentBranches: [
      {
        move: { from: { r: 1, c: 8 }, to: { r: 1, c: 3 }, notation: 'Xe 9 bình 4 (X9-4)' },
        name: 'Đen lượn Xe sang lộ sườn',
        frequency: '75%',
        description: 'Đen điều Xe sang lộ 4 nhòm ngó cung Tướng Đỏ.',
        counterMove: 'Binh 5 tiến 1 (Ủi thẳng Tốt đầu!)',
        counterExplanation: 'Đỏ lao Tốt đầu qua sông làm ngòi Pháo! Đòn sấm sét xuyên thẳng vào tâm can Đen không thể cản phá.',
      },
    ],
  },

  // ==========================================
  // NHÁNH 3: PHI TƯỢNG CUỘC (Đen đi T3.5)
  // ==========================================
  '7,7->7,4|0,2->2,4': {
    id: 'trung_phao_vs_phi_tuong_step3',
    openingName: 'Trung Pháo Đột Phá Phi Tượng',
    variationName: 'Nước thứ 3: Lên Mã trợ chiến',
    stepNumber: 3,
    turn: 'red',
    recommendedMove: {
      from: { r: 9, c: 7 },
      to: { r: 7, c: 6 },
      notation: 'Mã 2 tiến 3 (M2.3)',
      name: 'Lên Mã Tiếp Viện',
      explanation: 'Giữ vững Tốt 5 và chuẩn bị phối hợp cùng Pháo đầu mở đợt tổng tấn công xuyên tâm.',
      tacticalTip: 'Khi đối thủ bay Tượng sớm, đáy cung Tướng sẽ lộ điểm yếu chết người.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 7 }, to: { r: 2, c: 6 }, notation: 'Mã 8 tiến 7 (M8.7)' },
        name: 'Đen lên Mã giữ cánh',
        frequency: '80%',
        description: 'Đen phát triển quân cánh phải.',
        counterMove: 'Binh 5 tiến 1 (Ủi Tốt đầu)',
        counterExplanation: 'Đỏ lập tức đẩy Binh 5 tiến 1 khai thác sự thiếu hụt phòng ngự ở trung tâm của Đen.',
      },
    ],
  },

  // SAU KHI ĐEN M8.7 -> ĐỎ ĐẨY BINH 5 TIẾN 1 XUYÊN TIM!
  '7,7->7,4|0,2->2,4|9,7->7,6|0,7->2,6': {
    id: 'phi_tuong_red_step5',
    openingName: 'Đột Phá Sấm Sét Vào Tim Phi Tượng',
    variationName: 'Nước thứ 5: Lao Tốt đầu qua sông',
    stepNumber: 5,
    turn: 'red',
    recommendedMove: {
      from: { r: 6, c: 4 },
      to: { r: 5, c: 4 },
      notation: 'Binh 5 tiến 1 (B5.1 - Ủi Tốt Đầu)',
      name: 'Dâng Binh 5 Tiến 1 Uy Hiếp',
      explanation: 'Vì Tượng đen đã rời đáy lên tâm nên đáy cung Tướng không còn Tượng bảo kê. Đỏ đẩy Binh 5 tiến 1 đâm thẳng vào tim Đen!',
      tacticalTip: 'Đòn Binh 5 tiến 1 là đòn chí mạng khắc chế hoàn toàn Phi Tượng Cuộc.',
    },
    opponentBranches: [
      {
        move: { from: { r: 0, c: 1 }, to: { r: 2, c: 2 }, notation: 'Mã 2 tiến 3 (M2.3)' },
        name: 'Đen vội vã lên nốt Mã',
        frequency: '70%',
        description: 'Đen lúng túng trước nước dâng Tốt đầu.',
        counterMove: 'Binh 5 tiến 1 qua sông ăn Tốt đen!',
        counterExplanation: 'Tốt đỏ ăn qua sông có Pháo đầu bảo kê, sau đó Mã 3 nhảy lên trung lộ chiếm lĩnh toàn cục.',
      },
    ],
  },
};

/**
 * Find the opening node for the current sequence of moves
 */
export function getOpeningNodeForMoves(
  moves: { from: Position; to: Position }[]
): OpeningNode | null {
  // Try exact key first
  const fullKey = moves.map(m => formatPosKey(m.from, m.to)).join('|');
  if (OPENING_TREE[fullKey]) {
    return OPENING_TREE[fullKey];
  }

  // If moves are longer, check if the prefix matches any known node
  for (let len = moves.length; len >= 0; len--) {
    const subKey = moves.slice(0, len).map(m => formatPosKey(m.from, m.to)).join('|');
    if (OPENING_TREE[subKey]) {
      return OPENING_TREE[subKey];
    }
  }

  return null;
}
