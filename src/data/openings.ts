import type { Position } from '../types/chess';

export interface OpeningStep {
  stepIndex: number;
  turn: 'red' | 'black';
  from: Position;
  to: Position;
  notation: string;
  title: string;
  explanation: string;
  opponentOptions?: {
    moveName: string;
    description: string;
    counterMove: string;
    counterExplanation: string;
  }[];
}

export interface OpeningVariation {
  id: string;
  name: string;
  vietnameseName: string;
  opponentDefense: string;
  rating: string;
  tagline: string;
  overview: string;
  goldenRules: string[];
  steps: OpeningStep[];
}

export const OPENING_BOOK: OpeningVariation[] = [
  {
    id: 'trung-phao-binh-phong-ma',
    name: 'Trung Pháo Quá Hà Xa',
    vietnameseName: 'Trung Pháo Đối Bình Phong Mã',
    opponentDefense: 'Bình Phong Mã (Mã 8 tiến 7)',
    rating: '⭐⭐⭐⭐⭐ (Khai cuộc số 1)',
    tagline: 'Khai cuộc uy lực, bài bản và phổ biến nhất trong lịch sử cờ tướng đỉnh cao',
    overview: 'Đỏ chủ động vào Pháo đầu đè trung lộ. Đen lên hai Mã hình thành thế Bình Phong Mã vững như bàn thạch. Đỏ lập tức mở Binh 7 và phi Xe qua sông (Quá Hà Xa) đè ép trực tiếp cánh quân của đối phương.',
    goldenRules: [
      'Xe 1 phải ra lộ 2 ngay ở nước thứ 3 để tranh tiên.',
      'Binh 7 tiến 1 là nước then chốt để vừa mở đường cho Mã đỏ, vừa phong tỏa Mã đối thủ.',
      'Xe 2 tiến 6 qua sông để đè Mã hoặc ép đổi quân có lợi.',
    ],
    steps: [
      {
        stepIndex: 1,
        turn: 'red',
        from: { r: 7, c: 7 }, // P2
        to: { r: 7, c: 4 },   // P5
        notation: 'Pháo 2 bình 5',
        title: 'Khai thông trung lộ',
        explanation: 'Khởi đầu mẫu mực. Chiếm cứ trung tâm, khóa chặt Tốt đầu và nhắm thẳng cung Tướng của đối thủ.',
      },
      {
        stepIndex: 2,
        turn: 'black',
        from: { r: 0, c: 7 }, // M8
        to: { r: 2, c: 6 },   // M7
        notation: 'Mã 8 tiến 7',
        title: 'Đối thủ bảo vệ Tốt đầu',
        explanation: 'Đen chọn cách đỡ kiên cố nhất: lên Mã giữ Tốt đầu, chuẩn bị cho thế trận Bình Phong Mã.',
      },
      {
        stepIndex: 3,
        turn: 'red',
        from: { r: 9, c: 7 }, // M2
        to: { r: 7, c: 6 },   // M3
        notation: 'Mã 2 tiến 3',
        title: 'Bảo vệ Pháo & giữ Tốt trung lộ',
        explanation: 'Phát triển Mã cánh phải giữ chắc Tốt đầu, đồng thời chuẩn bị thông đường cho Xe 1 xuất kích.',
      },
      {
        stepIndex: 4,
        turn: 'black',
        from: { r: 0, c: 8 }, // X9
        to: { r: 0, c: 7 },   // X8
        notation: 'Xe 9 bình 8',
        title: 'Đen xuất Xe chiếm lộ 8',
        explanation: 'Đen tranh thủ mở Xe mạnh nhất ra lộ thông thoáng.',
      },
      {
        stepIndex: 5,
        turn: 'red',
        from: { r: 9, c: 8 }, // X1
        to: { r: 9, c: 7 },   // X2
        notation: 'Xe 1 bình 2',
        title: 'Xuất Xe trực chiến đối đầu',
        explanation: 'Không để Đen độc chiếm lộ sườn. Xe Đỏ ra lộ 2 tạo thế sẵn sàng xông lên qua sông.',
      },
      {
        stepIndex: 6,
        turn: 'black',
        from: { r: 0, c: 1 }, // M2
        to: { r: 2, c: 2 },   // M3
        notation: 'Mã 2 tiến 3',
        title: 'Đen hoàn tất Bình Phong Mã',
        explanation: 'Hai Mã đen đứng bảo vệ lẫn nhau, che chắn hoàn hảo toàn bộ tuyến giữa.',
      },
      {
        stepIndex: 7,
        turn: 'red',
        from: { r: 6, c: 2 }, // B7
        to: { r: 5, c: 2 },   // B7+1
        notation: 'Binh 7 tiến 1',
        title: 'Nước cờ chiến lược: Khóa Mã đen',
        explanation: 'Vừa kích hoạt Mã 3 của Đỏ chuẩn bị vươn lên, vừa ngăn không cho Mã 3 của Đen nhảy lên lộ 4.',
      },
      {
        stepIndex: 8,
        turn: 'black',
        from: { r: 3, c: 6 }, // B7
        to: { r: 4, c: 6 },   // B7+1
        notation: 'Binh 7 tiến 1',
        title: 'Đen cũng mở đường cho Mã',
        explanation: 'Nước đối phó đối xứng bắt buộc để giải phóng cánh quân của Đen.',
      },
      {
        stepIndex: 9,
        turn: 'red',
        from: { r: 9, c: 7 }, // X2
        to: { r: 3, c: 7 },   // X2+6
        notation: 'Xe 2 tiến 6 (Quá Hà Xa)',
        title: 'Tuyệt đỉnh công kích: Xe vượt sông',
        explanation: 'Quân Xe Đỏ tiến sâu vào hàng Tốt của Đen, khống chế toàn bộ mặt trận và chuẩn bị đè đầu Mã đen.',
        opponentOptions: [
          {
            moveName: 'Nếu Đen đi: Pháo 8 bình 9 (Đuổi Xe)',
            description: 'Đen mở Pháo ra biên định đuổi Xe của bạn đi nơi khác.',
            counterMove: 'Bạn đi ngay: Xe 2 bình 3 (Đè Mã!)',
            counterExplanation: 'Xe Đỏ dạt vào lộ 3 đè đúng lên đầu Mã đen tại (2, 6). Mã đen bị ghìm chặt không thở nổi, cánh phải đối phương tê liệt hoàn toàn!',
          },
          {
            moveName: 'Nếu Đen đi: Sĩ 4 tiến 5 (Củng cố Cung Tướng)',
            description: 'Đen chọn lối đánh an toàn, gia cố phòng thủ trung lộ.',
            counterMove: 'Bạn đi ngay: Mã 8 tiến 7 rồi Pháo 8 bình 7',
            counterExplanation: 'Xuất nốt Mã cánh trái, chuyển sang thế trận Ngũ Thất Pháo (Pháo lộ 5 và Pháo lộ 7) tập trung hỏa lực bắn phá nát cánh Mã đối phương.',
          },
        ],
      },
    ],
  },
  {
    id: 'trung-phao-thuan-phao',
    name: 'Trung Pháo Đối Thuận Pháo',
    vietnameseName: 'Thuận Pháo Đôi Công',
    opponentDefense: 'Thuận Pháo (Pháo 8 bình 5)',
    rating: '⭐⭐⭐⭐ (Đôi công nảy lửa)',
    tagline: 'Thế trận đôi công quyết liệt nhất: Ai tính toán sâu hơn, người đó đè bẹp đối thủ',
    overview: 'Đỏ vào Pháo 2 bình 5, Đen đáp trả bằng Pháo 8 bình 5 vào cùng cánh. Hai khẩu pháo đầu cùng nhắm vào tim nhau. Trận chiến đòi hỏi tốc độ ra Xe thần tốc và đòn Binh 5 tiến 1 phá toang tuyến giữa.',
    goldenRules: [
      'Sau khi vào pháo, phải lên Mã 2 tiến 3 giữ Tốt ngay.',
      'Xuất Xe 1 bình 2 sớm hơn đối phương 1 nhịp.',
      'Tiến Xe 2 lên hàng tuần hà (Xe 2 tiến 4) để vừa giữ bờ sông vừa linh hoạt điều động.',
    ],
    steps: [
      {
        stepIndex: 1,
        turn: 'red',
        from: { r: 7, c: 7 },
        to: { r: 7, c: 4 },
        notation: 'Pháo 2 bình 5',
        title: 'Vào Pháo đầu',
        explanation: 'Đỏ đi tiên, chiếm trung lộ áp đặt thế trận.',
      },
      {
        stepIndex: 2,
        turn: 'black',
        from: { r: 2, c: 7 }, // b_c2 at c=7
        to: { r: 2, c: 4 },   // to c=4
        notation: 'Pháo 8 bình 5',
        title: 'Đen Thuận Pháo đối đầu',
        explanation: 'Đen chấp nhận khiêu chiến đôi công trực tiếp, không phòng thủ rụt rè.',
      },
      {
        stepIndex: 3,
        turn: 'red',
        from: { r: 9, c: 7 },
        to: { r: 7, c: 6 },
        notation: 'Mã 2 tiến 3',
        title: 'Lên Mã bảo vệ trung lộ',
        explanation: 'Bảo vệ Tốt 5 khỏi hỏa lực Pháo đen, giữ vững căn cứ địa.',
      },
      {
        stepIndex: 4,
        turn: 'black',
        from: { r: 0, c: 7 },
        to: { r: 2, c: 6 },
        notation: 'Mã 8 tiến 7',
        title: 'Đen lên Mã giữ Tốt',
        explanation: 'Đen cũng lên Mã giữ Tốt đối ứng.',
      },
      {
        stepIndex: 5,
        turn: 'red',
        from: { r: 9, c: 8 },
        to: { r: 9, c: 7 },
        notation: 'Xe 1 bình 2',
        title: 'Tranh tiên xuất Xe',
        explanation: 'Nhanh chóng đưa quân Xe chủ lực ra trận chiếm lộ huyết mạch.',
      },
      {
        stepIndex: 6,
        turn: 'black',
        from: { r: 0, c: 8 },
        to: { r: 1, c: 8 }, // X9+1
        notation: 'Xe 9 tiến 1 (Hoành Xa)',
        title: 'Đen đi Hoành Xa (Xe ngang)',
        explanation: 'Đen định đưa Xe lên rồi chuyển sang lộ 4 hoặc lộ 6 tấn công.',
      },
      {
        stepIndex: 7,
        turn: 'red',
        from: { r: 9, c: 7 },
        to: { r: 5, c: 7 }, // X2+4
        notation: 'Xe 2 tiến 4 (Tuần Hà Xa)',
        title: 'Đòn chặn bờ sông: Tuần Hà Xa',
        explanation: 'Xe Đỏ chặn ngang bờ sông nhà mình. Con Xe này vừa phong tỏa không cho Xe đen tràn qua, vừa sẵn sàng dạt sang cánh hỗ trợ công kích.',
        opponentOptions: [
          {
            moveName: 'Nếu Đen ham công đi: Xe 9 bình 4 hoặc Xe 9 bình 6',
            description: 'Đen vội vã đưa xe sang cánh nhòm ngó.',
            counterMove: 'Bạn đi ngay: Binh 5 tiến 1 (Lao Tốt đầu!)',
            counterExplanation: 'Đẩy thẳng Tốt đầu lên sông làm ngòi Pháo. Kết hợp Mã 3 nhảy lên trung lộ, đòn đánh trực diện này sẽ xuyên thủng tim phòng ngự của Đen!',
          },
        ],
      },
    ],
  },
  {
    id: 'trung-phao-pha-phi-tuong',
    name: 'Trung Pháo Phá Phi Tượng',
    vietnameseName: 'Đột Phá Xuyên Tim Phi Tượng',
    opponentDefense: 'Phi Tượng Cuộc (Tượng 3 tiến 5)',
    rating: '⭐⭐⭐⭐ (Khắc chế phòng ngự)',
    tagline: 'Khai thác triệt để sơ hở tim trung lộ khi đối thủ bay Tượng sớm',
    overview: 'Nhiều người chơi thích bay Tượng ngay nước đầu để phòng thủ chắc chắn. Tuy nhiên, khi Tượng rời đáy lên tâm, đáy cung Tướng bị hở sườn. Trung Pháo sẽ dồn toàn lực đâm thủng Tốt đầu để kết liễu nhanh gọn.',
    goldenRules: [
      'Khi đối phương bay Tượng, không đánh dàn trải mà đánh thẳng vào Tốt 5.',
      'Ủi Binh 5 tiến 1 liên tục qua sông làm cầu nối cho Mã và Pháo.',
    ],
    steps: [
      {
        stepIndex: 1,
        turn: 'red',
        from: { r: 7, c: 7 },
        to: { r: 7, c: 4 },
        notation: 'Pháo 2 bình 5',
        title: 'Vào Pháo đầu',
        explanation: 'Đỏ ghim chặt trung lộ đối phương.',
      },
      {
        stepIndex: 2,
        turn: 'black',
        from: { r: 0, c: 2 }, // Elephant at col 2
        to: { r: 2, c: 4 },   // to col 4
        notation: 'Tượng 3 tiến 5 (Phi Tượng)',
        title: 'Đen lên Tượng giữa',
        explanation: 'Đen chủ trương hòa hoãn, bảo vệ Tốt đầu bằng Tượng.',
      },
      {
        stepIndex: 3,
        turn: 'red',
        from: { r: 9, c: 7 },
        to: { r: 7, c: 6 },
        notation: 'Mã 2 tiến 3',
        title: 'Lên Mã tiếp viện',
        explanation: 'Giữ Tốt 5 và chuẩn bị đợt tổng tấn công trung lộ.',
      },
      {
        stepIndex: 4,
        turn: 'black',
        from: { r: 0, c: 7 },
        to: { r: 2, c: 6 },
        notation: 'Mã 8 tiến 7',
        title: 'Đen lên Mã giữ cánh',
        explanation: 'Đen tiếp tục phát triển quân bình thường.',
      },
      {
        stepIndex: 5,
        turn: 'red',
        from: { r: 6, c: 4 }, // Binh 5
        to: { r: 5, c: 4 },   // B5+1
        notation: 'Binh 5 tiến 1 (Ủi Tốt đầu)',
        title: 'Đòn sấm sét: Đột phá trung lộ',
        explanation: 'Vì Tượng đen đã lên giữa nên tim Đen không còn Tượng dự phòng ở đáy. Đỏ đẩy Binh 5 tiến 1 xông thẳng qua sông uy hiếp!',
        opponentOptions: [
          {
            moveName: 'Nếu Đen lên Sĩ hoặc Mã cánh kia',
            description: 'Đen lúng túng trước nước dâng Tốt đầu.',
            counterMove: 'Bạn đi tiếp: Binh 5 tiến 1 qua sông ăn Tốt đen!',
            counterExplanation: 'Tốt đỏ ăn qua sông có Pháo đầu bảo kê, sau đó Mã 3 nhảy lên (Mã 3 tiến 5) chiếm lĩnh tâm điểm, thế công sấm sét không thể cản phá.',
          },
        ],
      },
    ],
  },
];
