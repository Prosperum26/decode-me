# Decode Me

  Decode Me là một puzzle game về việc giải mã một ngôn ngữ viết chưa biết. Người chơi nhìn thấy một đoạn văn được mã hóa bằng glyph, một từ mục tiêu bằng tiếng Anh, rồi dùng pattern, deduction và các thông tin thu được từ những lần thử trước để tìm đúng chuỗi glyph.

  ## Bắt đầu

  Yêu cầu Node.js và npm.

  ```bash
  npm install
  npm run dev
  ```

  Các lệnh khác:

  ```bash
  npm run lint       # Kiểm tra ESLint
  npm run build      # TypeScript check và production build
  npm run preview    # Chạy thử production build
  ```

  ## Công nghệ

  - React 19 và TypeScript.
  - Vite 8.
  - React Compiler qua Babel plugin.
  - ESLint với các rule cơ bản cho TypeScript và React Hooks.
  - CSS thuần trong `src/index.css`, kết hợp Tailwind CSS v4 qua PostCSS.

  ## Cấu trúc chính

  ```text
  src/
    App.tsx                         # Điều hướng nhẹ theo pathname
    index.css                       # Design tokens, layout và animation
    app/
      layout.tsx                    # Shell dùng chung
      page.tsx                      # Trang chủ
      play/page.tsx                 # Gameplay và trạng thái round
      about/page.tsx                # Trang giới thiệu
      archive/page.tsx              # Trang archive
    components/
      game/                         # Passage, target word và Eye
      layout/                       # Background và layout visuals
      ui/                           # Nút, scramble text và cursor trail
    data/
      glyphs.ts                     # Glyph pool và alphabet cố định
      passages.ts                   # Bộ passage curated
    lib/
      cipher.ts                     # Mapping glyph <-> letter
      puzzle-generator.ts           # Tạo và validate puzzle
  ```

  ## Gameplay

  Mỗi round cung cấp:

  1. Một encoded passage liên tục hoặc không đều, không để lộ word boundary.
  2. Một target word bằng tiếng Anh cần tìm trong passage.

  Người chơi chọn các glyph để thử một từ. Kết quả sai không chỉ là thất bại: vùng đã thử được đánh dấu để người chơi có thể giữ Eye và kiểm tra evidence. Evidence giúp suy ra quan hệ glyph-letter, nhận ra pattern lặp lại và hình thành giả thuyết mới.

  Khi tìm đúng target:

  ```text
  CORRECT TARGET
      -> DECODE ENTIRE PASSAGE
      -> COMPLETE ROUND
      -> NEXT ROUND
  ```

  Vòng lặp cốt lõi:

  ```text
  FIND PASSAGE -> READ TARGET -> SEARCH GLYPH SEQUENCE -> MAKE A GUESS

  WRONG   -> MARK AS EVIDENCE -> HOLD EYE -> LEARN GLYPHS -> TRY AGAIN
  CORRECT -> DECODE PASSAGE -> COMPLETE ROUND -> NEXT ROUND
  ```

  ### Quy tắc ngôn ngữ

  - Mapping glyph không đổi giữa các puzzle.
  - Puzzle dùng chung `FIXED_CIPHER_MAPPING`; không tạo alphabet mới cho từng round.
  - Plaintext không được hiển thị trước khi giải đúng.
  - Encoded passage là đối tượng tương tác chính, không biến game thành form nhập đáp án.
  - Tiến trình của người chơi là kiến thức về ngôn ngữ, không phải XP, lives, combat, score hay time limit.

  ### Độ khó

  Độ khó tăng bằng độ phức tạp suy luận: passage dài hơn, pattern ít rõ hơn, nhiều candidate hơn và cần dựa nhiều hơn vào glyph đã biết. Không dùng hình phạt nhân tạo để làm game khó hơn.

  ## Hiệu ứng giao diện

  - Target word và tiêu đề có hiệu ứng scramble: glyph ngẫu nhiên được thay theo interval khoảng 35ms và khóa dần từ trái sang phải.
  - Cursor trail gồm các chấm bám theo con trỏ bằng `requestAnimationFrame` và lerp 35%; các chấm sau nhỏ và mờ dần.
  - Các animation được tắt khi người dùng bật `prefers-reduced-motion`.

  ## Phạm vi hiện tại

  Đã có nền tảng MVP: fixed glyph mapping, passage dataset, puzzle generator, target selection, đánh dấu các vùng đã thử, Eye reveal, round states và các trang chính. Một số chi tiết gameplay vẫn cố ý để mở và không được tự ý quyết định:

  - Cách chọn span: click, drag hay start/end selection.
  - UI cuối cùng của Eye và giới hạn hint.
  - Scoring, sound, story, mobile interaction và số round cuối cùng.
  - Thuật toán difficulty và puzzle generation ở phiên bản hoàn thiện.

  Các quyết định trên cần được chốt rõ ràng trước khi triển khai. Những thay đổi gameplay phải giữ nguyên nguyên tắc discovery, evidence, persistent language và reasoning.

  ## Nguyên tắc phát triển

  - Ưu tiên discovery hơn instruction.
  - Một lần thử sai phải tạo ra thông tin có ích.
  - Không tự động giải puzzle thay người chơi.
  - Không thay đổi glyph mapping cố định nếu chưa được yêu cầu rõ ràng.
  - Không thêm hệ thống không phục vụ trực tiếp việc giải mã.
