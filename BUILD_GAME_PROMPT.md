Bạn đang làm việc trong repository:

```text
D:\game\slap-your-boss
```

Project là web game frontend-only tên **Slap Your Boss**, sử dụng Vue 3, TypeScript, Vite, PixiJS và MediaPipe Face Landmarker.

Bạn được giao quyền tự chủ hoàn thành toàn bộ dự án trong một phiên làm việc.

## Chế độ làm việc tự động

Hãy tự thực hiện tất cả công việc cần thiết mà không dừng lại để yêu cầu tôi:

* Duyệt kế hoạch.
* Duyệt từng feature.
* Duyệt từng file.
* Duyệt từng command.
* Xác nhận trước khi cài package.
* Xác nhận trước khi chạy build hoặc test.
* Xác nhận trước khi sửa lỗi.
* Xác nhận trước khi chuyển sang feature tiếp theo.

Không hỏi tôi những câu hỏi có thể giải quyết bằng cách:

* Đọc source code.
* Đọc harness.
* Đọc tài liệu trong repository.
* Kiểm tra package hiện có.
* Chạy command.
* Chọn một mặc định kỹ thuật hợp lý.
* Tạo asset placeholder.
* Chạy thử và sửa lỗi.

Khi có nhiều phương án hợp lệ, hãy tự chọn phương án:

1. Đơn giản nhất.
2. Ít dependency nhất.
3. Dễ bảo trì nhất.
4. Phù hợp với kiến trúc hiện tại nhất.
5. Có thể build và deploy static được.

Chỉ dừng khi gặp blocker thực sự không thể tự giải quyết, chẳng hạn:

* Thiếu credential bắt buộc.
* Thiếu quyền hệ thống không thể thay thế.
* File quan trọng bị hỏng hoàn toàn.
* Yêu cầu mâu thuẫn nghiêm trọng.
* Hành động có thể xóa dữ liệu ngoài repository.

Không dừng chỉ vì một asset chưa có. Hãy tự tạo SVG, Canvas hoặc placeholder không có bản quyền.

## Giới hạn quyền

Chỉ được tạo, sửa, di chuyển hoặc xóa file bên trong:

```text
D:\game\slap-your-boss
```

Không được:

* Xóa thư mục `.git`.
* Sửa file ngoài repository.
* Sửa cấu hình hệ thống.
* Xóa dữ liệu người dùng.
* Đọc hoặc ghi secret không liên quan.
* Chạy command phá hủy ổ đĩa.
* Dùng `git reset --hard`.
* Dùng `git clean -fd`.
* Force push.
* Ghi đè lịch sử Git.
* Tạo backend hoặc database.
* Upload ảnh người dùng lên server.

Được phép:

* Tạo và sửa source code.
* Tạo và sửa tài liệu harness.
* Tạo asset SVG placeholder.
* Cài dependency bằng pnpm khi thực sự cần.
* Chạy dev server.
* Chạy TypeScript check.
* Chạy unit test.
* Chạy build.
* Chạy browser test nếu công cụ hỗ trợ.
* Tự sửa lỗi cho đến khi build thành công.

## Bước bắt buộc đầu tiên

Trước khi code:

1. Đọc toàn bộ:

```text
AGENTS.md
BOOTSTRAP.md
CLAUDE.md
GEMINI.md
package.json
vite.config.ts
tsconfig.json
harness/FEATURE_LIST.md
harness/PROGRESS.md
harness/DECISIONS.md
harness/TEST_CASES.md
harness/RISKS.md
```

2. Đọc tất cả tài liệu liên quan trong:

```text
docs/
```

3. Kiểm tra toàn bộ cấu trúc:

```text
src/
public/
scripts/
templates/
.agents/
```

4. Chạy:

```powershell
node .\scripts\harness-check.mjs
```

5. Kiểm tra các script có thật trong `package.json`.

6. Chạy build baseline trước khi thay đổi:

```powershell
pnpm build
```

Nếu baseline lỗi, hãy phân tích, sửa lỗi nền tảng và ghi lại trong `harness/PROGRESS.md`.

## Quy tắc harness

Luôn giữ:

```text
WIP = 1
```

Tại mỗi thời điểm chỉ được có đúng một feature:

```text
State: active
```

Tuy nhiên, không được dừng sau khi hoàn thành một feature.

Sau mỗi feature:

1. Xác minh Acceptance Criteria.
2. Chạy test liên quan.
3. Chạy production build.
4. Sửa tất cả lỗi.
5. Cập nhật `harness/PROGRESS.md`.
6. Cập nhật trạng thái test trong `harness/TEST_CASES.md`.
7. Cập nhật `harness/DECISIONS.md` nếu có quyết định mới.
8. Cập nhật `harness/RISKS.md` nếu có risk mới.
9. Chuyển feature hiện tại thành `done`.
10. Kích hoạt chính xác một feature backlog tiếp theo.
11. Chạy lại:

```powershell
node .\scripts\harness-check.mjs
```

12. Tiếp tục triển khai feature tiếp theo ngay lập tức.

Không đợi tôi gửi prompt tiếp theo.

Tiếp tục cho đến khi:

```text
Không còn feature backlog
Không còn feature active
Tất cả feature đã done
```

Nếu script harness hiện tại không hỗ trợ chuyển feature tự động, hãy cập nhật `harness/FEATURE_LIST.md` một cách an toàn, vẫn bảo đảm chỉ có một feature active.

## Mục tiêu sản phẩm

Hoàn thành một web game có thể chơi từ đầu đến cuối:

```text
Mở website
→ nhân vật hoạt hình mặc vest xuất hiện
→ nhập tên sếp
→ chọn hoặc chụp ảnh
→ nhận diện khuôn mặt
→ preview mặt trên nhân vật
→ nhấn PLAY
→ 3... 2... 1... SLAP!
→ chơi 15 giây
→ tap hoặc swipe để tát
→ mặt biến dạng hoạt hình
→ combo và điểm tăng
→ hết giờ
→ hiển thị Slap Report
→ chơi lại, đổi ảnh, lưu hoặc share kết quả
```

## Công nghệ bắt buộc

Giữ nguyên:

```text
Vue 3
TypeScript
Vite
PixiJS v8
MediaPipe Face Landmarker
Pointer Events
Web Audio API
Canvas API
localStorage
pnpm
```

Không tạo:

```text
Backend
Spring Boot
Express
Firebase
Database
Đăng nhập
API server
Cloud image storage
AI image generation thời gian thực
```

Build phải tạo static files tại:

```text
dist/
```

## Màn hình bắt đầu

Khi mở website phải hiển thị:

* Logo `SLAP YOUR BOSS`.
* Nhân vật hoạt hình mặc vest.
* Mặt placeholder nếu chưa chọn ảnh.
* Ô nhập tên sếp.
* Nút chọn hoặc chụp ảnh.
* Preview mặt trên nhân vật.
* Nút PLAY.
* Sound toggle.
* Vibration toggle.
* Thông báo quyền riêng tư.

Thông báo:

```text
Your photo is processed only on this device and is never uploaded.
```

Tên sếp:

* Bắt buộc.
* Trim khoảng trắng.
* Tối đa 30 ký tự.
* Không dùng `v-html`.
* Không cho phép chỉ nhập khoảng trắng.

Nút PLAY chỉ bật khi:

* Tên hợp lệ.
* File hợp lệ.
* Detect face thành công.
* Preview sẵn sàng.
* Asset game sẵn sàng.

## Xử lý ảnh

Hỗ trợ:

```text
JPEG
PNG
WEBP
```

Dung lượng tối đa:

```ts
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
```

Yêu cầu:

* Resize ảnh lớn trước khi detect.
* Sửa orientation khi cần.
* Dùng MediaPipe Face Landmarker.
* Nếu có nhiều mặt, chọn mặt lớn nhất.
* Nếu không có mặt, hiển thị lỗi và cho chọn lại.
* Tạo crop và mask mềm.
* Giữ face landmarks cho deformation.
* Chỉ detect một lần sau upload.
* Không detect liên tục trong gameplay.
* Không upload ảnh.
* Không lưu ảnh trong localStorage.
* Revoke Object URL khi đổi ảnh hoặc unmount.

Nếu model MediaPipe chưa tồn tại, chọn một giải pháp hợp lệ:

1. Dùng model asset chính thức được tải khi runtime.
2. Đặt hướng dẫn rõ trong README.
3. Tạo fallback development mode nhưng không được giả vờ rằng face detection đã hoạt động.

Không được âm thầm bỏ face detection.

## Nhân vật mặc vest

Nhân vật gồm:

* Vest.
* Áo sơ mi.
* Cà vạt.
* Thân.
* Cổ.
* Hai tay.
* Vùng đầu để gắn face texture.

Có:

* Idle animation.
* Breathing nhẹ.
* Tie movement.
* Head reaction.
* Hand slap trái và phải.
* Body wobble.

Được dùng:

```text
SVG tự tạo
Canvas
PixiJS Graphics
```

Không dùng asset không rõ giấy phép.

## Countdown và timer

Sau PLAY:

```text
3
2
1
SLAP!
```

Gameplay kéo dài chính xác:

```ts
const GAME_DURATION_MS = 15_000;
```

Dùng:

```ts
performance.now()
```

Không chỉ dựa vào `setInterval`.

Khi hết giờ:

* Dừng nhận input.
* Dừng score.
* Dừng combo.
* Chuyển RESULT.
* Khôi phục cursor.

## Tap và swipe

Dùng Pointer Events:

```text
pointerdown
pointermove
pointerup
pointercancel
```

Tap hợp lệ khi:

* Thời gian ngắn.
* Di chuyển nhỏ.
* Nằm trong hit area đầu hoặc mặt.
* Không nằm trong cooldown.

Swipe hợp lệ khi:

```text
distance >= 40 px
duration <= 500 ms
horizontal movement đủ rõ
```

Một swipe chỉ tạo một SlapEvent.

Không tính từng `pointermove` là cú tát.

Interface:

```ts
interface SlapEvent {
  direction: "LEFT" | "RIGHT";
  inputType: "TAP" | "SWIPE";
  power: number;
  x: number;
  y: number;
  timestamp: number;
}
```

## Con trỏ bàn tay

Trong PLAYING trên desktop:

* Ẩn cursor mặc định trong vùng game.
* Hiển thị bàn tay hoạt hình.
* Có trạng thái READY, DRAGGING và HITTING.
* Theo pointer.
* Lật hướng dựa trên vị trí hoặc swipe.
* Có animation khi tap.
* Không chặn pointer event.
* Dùng SVG tự tạo.
* Không xuất hiện trên thiết bị touch.
* Hết game phải cleanup và trả cursor bình thường.

Không cập nhật Vue reactive state quá mức trong mỗi `pointermove`. Dùng requestAnimationFrame hoặc PixiJS update nếu cần.

## Hiệu ứng cú tát

Mỗi SlapEvent kích hoạt:

* Hand animation.
* Head rotation.
* Face deformation.
* Character reaction.
* Camera shake.
* Impact flash.
* Particle.
* Comic text.
* Slap sound.
* Vibration nếu hỗ trợ.
* Combo update.
* Score update.

Comic text:

```text
SLAP!
POW!
BONK!
WHACK!
BAM!
```

Phong cách cartoon, không có máu hoặc thương tích chân thực.

## Biến dạng khuôn mặt

Không dùng AI image generation.

Ưu tiên:

* MediaPipe landmarks.
* PixiJS Mesh.
* Control points.
* Localized warp.
* Squash and stretch.
* Cheek displacement.
* Mouth distortion.
* Eye movement.
* Head rotation.
* Spring animation.

Các region:

```ts
type FaceRegion =
  | "LEFT_CHEEK"
  | "RIGHT_CHEEK"
  | "LEFT_EYE"
  | "RIGHT_EYE"
  | "MOUTH"
  | "NOSE"
  | "JAW"
  | "FOREHEAD";
```

Spring:

```ts
velocityX += (originX - x) * spring;
velocityY += (originY - y) * spring;

velocityX *= damping;
velocityY *= damping;

x += velocityX;
y += velocityY;
```

Mặc định:

```ts
const SPRING = 0.12;
const DAMPING = 0.82;
```

Nếu full mesh chưa thể hoạt động ổn định, triển khai deformation MVP bằng:

* Mesh đơn giản.
* Local control points.
* Scale X/Y.
* Skew.
* Cheek displacement.
* Head rotation.
* Mouth và eye overlays.

Hiệu ứng méo mặt phải nhìn thấy rõ. Không được thay bằng việc chỉ xoay toàn bộ ảnh.

## Năm cấp biến dạng

```text
0–19%:
đầu nghiêng, má rung nhẹ

20–39%:
mặt lệch, miệng rung, sao nhỏ

40–59%:
má phồng, miệng méo, đầu wobble

60–79%:
mắt đảo, squash/stretch, cà vạt bay

80–100%:
dizzy stars, khói hoạt hình, deformation cực đại
```

## Combo

```ts
const COMBO_WINDOW_MS = 450;
const COMBO_RESET_MS = 700;
```

```ts
const comboMultiplier =
  1 + Math.min(combo, 30) * 0.03;
```

Mốc:

```text
5  → NICE!
10 → GREAT!
20 → RAGE MODE!
30 → UNSTOPPABLE!
50 → CORPORATE FURY!
```

## Điểm

Kết quả:

```ts
interface GameResult {
  bossName: string;
  durationMs: number;
  totalSlaps: number;
  maxCombo: number;
  faceDamage: number;
  stressReleased: number;
  bestSlap: number;
  finalScore: number;
  rank: string;
}
```

Raw damage:

```ts
rawDamage += slapPower * comboMultiplier;
```

Face Damage:

```ts
faceDamage = Math.round(
  100 * (1 - Math.exp(-rawDamage / 1200)),
);
```

Final Score:

```ts
finalScore = Math.round(
  faceDamage * 0.4 +
    stressReleased * 0.4 +
    Math.min(bestSlap, 100) * 0.2,
);
```

Rank:

```text
0–29   Calm Employee
30–49  Office Rookie
50–69  Deadline Fighter
70–89  Corporate Survivor
90–100 Boss Battle Legend
```

Các công thức phải nằm trong module thuần, không viết trực tiếp trong component.

## Audio và vibration

Dùng Web Audio API.

Có:

* Countdown sound.
* Nhiều slap sound.
* Heavy slap sound.
* Combo sound.
* Finish sound.

Sau khi nhấn PLAY:

```ts
await audioContext.resume();
```

Có sound toggle.

Rung:

```ts
navigator.vibrate?.(duration);
```

Có vibration toggle.

Nếu browser không hỗ trợ, game vẫn hoạt động bình thường.

## Slap Report

Sau game hiển thị:

```text
SLAP REPORT

Boss: Mr. Kim
Total Slaps: 187
Max Combo: 42
Face Damage: 94%
Stress Released: 88%
Best Slap: 71

Rank:
CORPORATE SURVIVOR
```

Nút:

```text
SLAP AGAIN
NEW BOSS
SAVE REPORT
SHARE
```

SLAP AGAIN:

* Giữ tên và ảnh.
* Reset toàn bộ gameplay.
* Bắt đầu countdown lại.

NEW BOSS:

* Xóa tên.
* Xóa ảnh.
* Revoke Object URL.
* Reset face.
* Quay LANDING.

SAVE REPORT:

* Render PNG bằng Canvas.
* Kích thước khoảng 1080 × 1350.
* Có nhân vật, tên, score và rank.

SHARE:

* Dùng Web Share API khi hỗ trợ.
* Fallback download PNG.

## Local storage

Chỉ lưu:

* Total games.
* Highest score.
* Highest damage.
* Highest combo.
* Best slap.
* Sound setting.
* Vibration setting.

Không lưu:

* Ảnh.
* Base64.
* Landmarks.
* Face texture.
* File người dùng.

## Cấu trúc code

Không đặt toàn bộ logic trong:

```text
App.vue
GameCanvas.vue
```

Tách ít nhất:

```text
components/
composables/
game/
services/
utils/
types/
```

Tách riêng:

* State machine.
* Boss profile.
* File validation.
* Face detection.
* Image processing.
* PixiJS lifecycle.
* Input.
* Deformation.
* Combo.
* Scoring.
* Audio.
* Particle.
* Cursor.
* Report export.

Không dùng `any` trừ khi thư viện bắt buộc.

## Hiệu năng và cleanup

Mục tiêu 60 FPS trên điện thoại tầm trung.

Bắt buộc:

* Không detect face trong game loop.
* Không tạo object không cần thiết mỗi frame.
* Pool particle nếu phù hợp.
* Cleanup pointer listener.
* Cleanup requestAnimationFrame.
* Cleanup timer.
* Cleanup AudioNode.
* Cleanup PixiJS Application.
* Cleanup texture.
* Cleanup Object URL.
* Không nhân đôi listener khi SLAP AGAIN.
* Không leak khi đổi ảnh nhiều lần.

## Responsive

Ưu tiên:

```text
360 px
375 px
390 px
414 px
430 px
```

Yêu cầu:

* Mobile-first.
* Không overflow ngang.
* Touch target đủ lớn.
* Dùng `100dvh`.
* Hỗ trợ safe-area.
* `touch-action: none` trong game.
* Vẫn chơi được bằng desktop mouse.

## Kiểm thử bắt buộc

Tạo test cho logic thuần nếu Vitest đã có hoặc có thể thêm hợp lý:

* clamp.
* Boss name validation.
* Image validation.
* Swipe power.
* Combo multiplier.
* Combo reset.
* Face Damage.
* Stress Released.
* Final Score.
* Rank.

Sau mỗi feature chạy những script thực sự tồn tại:

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Không tự giả định script. Hãy đọc `package.json`.

Build là bắt buộc.

Nếu build lỗi:

1. Đọc toàn bộ lỗi.
2. Sửa.
3. Chạy lại.
4. Lặp đến khi thành công.

Không chuyển feature khi build vẫn lỗi.

## Browser verification

Nếu có browser tool:

1. Chạy dev server.
2. Mở game.
3. Kiểm tra landing.
4. Kiểm tra responsive.
5. Kiểm tra input.
6. Kiểm tra countdown.
7. Kiểm tra gameplay.
8. Kiểm tra result.
9. Kiểm tra console.
10. Chụp screenshot hoặc artifact nếu harness yêu cầu.

Nếu không có browser tool, ghi rõ phần nào chỉ được kiểm tra bằng build hoặc unit test.

## README và deploy

Cập nhật README gồm:

```text
Giới thiệu
Stack
Cài đặt
Chạy development
Test
Build
Preview
Quyền riêng tư
Browser support
Hạn chế
Deploy Cloudflare Pages
```

Cloudflare Pages:

```text
Build command: pnpm build
Output directory: dist
```

## Tiêu chí hoàn thành toàn dự án

Chỉ hoàn thành khi:

* Tất cả feature trong FEATURE_LIST đã done.
* Không còn active feature.
* Harness check thành công.
* TypeScript không lỗi.
* Test quan trọng thành công.
* Production build thành công.
* Landing hoạt động.
* Nhân vật vest hiển thị.
* Nhập tên hoạt động.
* Upload ảnh hoạt động.
* Face detection hoạt động.
* Preview hoạt động.
* PLAY validation hoạt động.
* Countdown hoạt động.
* Game đúng 15 giây.
* Tap hoạt động.
* Swipe hoạt động.
* Cursor bàn tay hoạt động.
* Face deformation nhìn thấy rõ.
* Combo hoạt động.
* Score hoạt động.
* Audio toggle hoạt động.
* Vibration fallback hoạt động.
* Slap Report hoạt động.
* SLAP AGAIN hoạt động.
* NEW BOSS hoạt động.
* SAVE REPORT hoạt động.
* SHARE fallback hoạt động.
* Không có backend.
* Không upload ảnh.
* Không có memory leak rõ ràng.
* README hoàn chỉnh.

## Báo cáo cuối cùng

Sau khi hoàn thành toàn bộ, báo cáo:

```text
Tổng quan kết quả
Danh sách feature hoàn thành
File chính đã tạo
File chính đã sửa
Test đã chạy
Kết quả build
Kết quả harness check
Các quyết định kỹ thuật
Các fallback đã sử dụng
Các hạn chế còn lại
Hướng dẫn chạy game
Hướng dẫn deploy
```

Không tuyên bố một tính năng hoạt động nếu chưa được kiểm tra bằng test, build hoặc browser verification.

Bắt đầu ngay bây giờ.

Không chỉ lập kế hoạch.

Hãy đọc repository, chạy harness check, chạy baseline build và trực tiếp triển khai toàn bộ các feature theo thứ tự cho đến khi dự án hoàn thành.
