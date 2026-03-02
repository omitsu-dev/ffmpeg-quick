# ffmpeg-quick

[English](#english) | [日本語](#japanese)

---

<a id="english"></a>

## English

FFmpeg is the most powerful video tool out there. But every time you use it, this happens:

```bash
# "I just want to compress a video..."
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -movflags +faststart output.mp4
```

```bash
# "I just want to make a GIF..."
ffmpeg -ss 10 -t 3 -i input.mp4 \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

What was `-c:v` again? What's the default for `-crf`? How does the palettegen filter syntax work?

**Every time you Google it. Every time you open Stack Overflow. Every time you copy-paste.**

ffmpeg-quick skips the "Google → copy-paste" loop:

```bash
npx ffmpeg-quick compress input.mp4
npx ffmpeg-quick gif input.mp4 -s 10 -d 3
```

All you need to remember is a verb. `compress`, `gif`, `audio`. Add options only when you need them.

### Install

```bash
npm install -g ffmpeg-quick
```

Or run directly with npx:

```bash
npx ffmpeg-quick compress input.mp4
```

> **Prerequisite:** [FFmpeg](https://ffmpeg.org/download.html) must be installed on your system.

### Commands

| Command | Description |
|---------|-------------|
| `compress` | Compress video with H.264 (CRF) |
| `gif` | Create GIF from video |
| `webm` | Convert to WebM (VP9) |
| `hls` | Generate HLS segments for streaming |
| `audio` | Extract audio as MP3 |
| `thumbnail` | Extract a thumbnail image |
| `strip-audio` | Remove audio track |
| `info` | Show media info (ffprobe) |
| `concat` | Join multiple videos into one |
| `subtitle` | Burn subtitles into video |
| `speed` | Change playback speed |
| `stabilize` | Stabilize shaky video (2-pass) |
| `trim` | Cut a section from a video |
| `resize` | Resize video to a target width or height |
| `crop` | Crop a region from the video |

### Usage

```bash
# Compress video (H.264, CRF 23)
npx ffmpeg-quick compress input.mp4

# Create GIF (start at 10s, 3s duration)
npx ffmpeg-quick gif input.mp4 -s 10 -d 3

# Convert to WebM
npx ffmpeg-quick webm input.mp4

# Generate HLS segments
npx ffmpeg-quick hls input.mp4

# Extract audio as MP3
npx ffmpeg-quick audio input.mp4

# Extract thumbnail at 5s
npx ffmpeg-quick thumbnail input.mp4 -s 5

# Remove audio track
npx ffmpeg-quick strip-audio input.mp4

# Show media info
npx ffmpeg-quick info input.mp4

# Join videos (auto temp file, no manual file list)
npx ffmpeg-quick concat part1.mp4 part2.mp4 part3.mp4

# Burn subtitles with custom style
npx ffmpeg-quick subtitle input.mp4 subs.srt --font-size 28 --color yellow

# 2x speed (auto atempo chaining)
npx ffmpeg-quick speed input.mp4 2

# Stabilize shaky footage (2-pass, automatic)
npx ffmpeg-quick stabilize shaky.mp4

# Trim video (start at 30s, 10s duration)
npx ffmpeg-quick trim input.mp4 -s 30 -d 10

# Resize to 1280px width (height auto)
npx ffmpeg-quick resize input.mp4 -w 1280

# Crop center 1280x720 region
npx ffmpeg-quick crop input.mp4 1280x720
```

### Common Options

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Output file path (default: auto-generated) |
| `--dry-run` | Print the FFmpeg command without running it |
| `-y` | Overwrite output without asking |

### Command Options

**compress**
- `--crf <n>` — Quality factor, 0-51 (default: 23)
- `--preset <name>` — Encoding speed preset (default: medium)

**gif**
- `-s, --start <sec>` — Start time in seconds (default: 0)
- `-d, --duration <sec>` — Duration in seconds (default: 5)
- `--fps <n>` — Frames per second (default: 15)
- `--width <px>` — Output width (default: 480)

**webm**
- `--crf <n>` — Quality factor, 0-63 (default: 30)

**hls**
- `--segment <sec>` — Segment duration (default: 6)

**thumbnail**
- `-s, --start <sec>` — Time position in seconds (default: 1)

**concat**
- `--re-encode` — Re-encode streams (use when input codecs differ)

**subtitle**
- `--font-size <n>` — Font size (default: 24)
- `--color <name>` — Font color: white, yellow, red, green, cyan (default: white)
- `--position <pos>` — Position: bottom, top, center (default: bottom)

**speed**
- `<factor>` — Speed multiplier (e.g. 2 = 2x faster, 0.5 = half speed)
- `--no-audio` — Remove audio (useful for timelapse)

**stabilize**
- `--strength <n>` — Smoothing strength, 1-30 (default: 10)
- `--shakiness <n>` — Input shakiness estimate, 1-10 (default: 5)

**trim**
- `-s, --start <time>` — Start time in seconds or HH:MM:SS (default: 0)
- `-d, --duration <time>` — Duration in seconds
- `-t, --to <time>` — End time in seconds or HH:MM:SS

**resize**
- `-w, --width <px>` — Target width (height auto-scaled)
- `-h, --height <px>` — Target height (width auto-scaled)

**crop**
- `<size>` — Crop size as WxH (e.g. 1280x720)
- `--pos <x:y>` — Top-left position (default: center)

### The Hard Stuff, Made Easy

These commands solve problems that send you down a rabbit hole every time:

**`concat`** — No more manual file lists. Just pass your files:
```bash
# Without ffmpeg-quick: create temp file list, run concat demuxer, delete temp file
# With ffmpeg-quick:
npx ffmpeg-quick concat intro.mp4 main.mp4 outro.mp4
```

**`stabilize`** — 2-pass processing in one command:
```bash
# Without ffmpeg-quick: run pass 1 (detect), then pass 2 (transform), then delete .trf file
# With ffmpeg-quick:
npx ffmpeg-quick stabilize shaky.mp4
```

**`speed`** — No mental math with `setpts` and `atempo`:
```bash
# Without ffmpeg-quick: setpts=0.25*PTS (inverse!), atempo=2.0,atempo=2.0 (chained!)
# With ffmpeg-quick:
npx ffmpeg-quick speed input.mp4 4
```

**`subtitle`** — No escaping nightmares:
```bash
# Without ffmpeg-quick: force_style syntax, Windows path colon escaping, ASS alignment codes
# With ffmpeg-quick:
npx ffmpeg-quick subtitle video.mp4 subs.srt --font-size 28 --color yellow
```

### `--dry-run` — Learn Instead of Googling

"But I don't know what it's doing under the hood..."

Add `--dry-run` to print the FFmpeg command without executing it:

```bash
$ npx ffmpeg-quick gif --dry-run input.mp4 -s 10 -d 3

  ffmpeg -ss 10 -t 3 -i input.mp4 -vf fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse -loop 0 input-output.gif
```

For those who want to learn FFmpeg, it doubles as a cheat sheet that always gives you the right command.

### Links

- Blog: [32blog.com](https://32blog.com) — FFmpeg guides and more
- X: [@omitsu_dev](https://x.com/omitsu_dev)

---

<a id="japanese"></a>

## 日本語

FFmpegは最強の動画ツール。でも毎回こうなる：

```bash
# 「動画を圧縮したいだけなのに…」
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -movflags +faststart output.mp4
```

```bash
# 「GIF作りたいだけなのに…」
ffmpeg -ss 10 -t 3 -i input.mp4 \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

`-c:v`って何だっけ。`-crf`のデフォルトいくつだっけ。GIFのpalettegen構文どうだっけ。

**毎回ググる。毎回Stack Overflowを開く。毎回コピペする。**

ffmpeg-quickはその「ググる→コピペ」をスキップする：

```bash
npx ffmpeg-quick compress input.mp4
npx ffmpeg-quick gif input.mp4 -s 10 -d 3
```

覚えることは動詞だけ。`compress`、`gif`、`audio`。オプションは必要なときだけ足す。

### インストール

```bash
npm install -g ffmpeg-quick
```

npxで直接実行もできます：

```bash
npx ffmpeg-quick compress input.mp4
```

> **前提条件:** [FFmpeg](https://ffmpeg.org/download.html) がインストールされている必要があります。

### コマンド一覧

| コマンド | 説明 |
|---------|------|
| `compress` | H.264 (CRF) で動画を圧縮 |
| `gif` | 動画からGIFを作成 |
| `webm` | WebM (VP9) に変換 |
| `hls` | HLSセグメントを生成 |
| `audio` | 音声をMP3で抽出 |
| `thumbnail` | サムネイル画像を抽出 |
| `strip-audio` | 音声トラックを除去 |
| `info` | メディア情報を表示 (ffprobe) |
| `concat` | 複数の動画を結合 |
| `subtitle` | 字幕を焼き込み |
| `speed` | 再生速度を変更 |
| `stabilize` | 手ブレ補正（2パス） |
| `trim` | 動画の一部を切り出し |
| `resize` | 解像度を変更 |
| `crop` | 動画の一部を切り抜き |

### 使い方

```bash
# 動画を圧縮（H.264, CRF 23）
npx ffmpeg-quick compress input.mp4

# GIF作成（10秒地点から3秒間）
npx ffmpeg-quick gif input.mp4 -s 10 -d 3

# WebMに変換
npx ffmpeg-quick webm input.mp4

# HLSセグメント生成
npx ffmpeg-quick hls input.mp4

# 音声をMP3で抽出
npx ffmpeg-quick audio input.mp4

# 5秒地点のサムネイルを抽出
npx ffmpeg-quick thumbnail input.mp4 -s 5

# 音声トラックを除去
npx ffmpeg-quick strip-audio input.mp4

# メディア情報を表示
npx ffmpeg-quick info input.mp4

# 動画を結合（一時ファイル不要、並べるだけ）
npx ffmpeg-quick concat part1.mp4 part2.mp4 part3.mp4

# 字幕焼き込み（スタイル指定も簡単）
npx ffmpeg-quick subtitle input.mp4 subs.srt --font-size 28 --color yellow

# 2倍速（atempoチェーン自動）
npx ffmpeg-quick speed input.mp4 2

# 手ブレ補正（2パス自動実行）
npx ffmpeg-quick stabilize shaky.mp4

# 動画の切り出し（30秒地点から10秒間）
npx ffmpeg-quick trim input.mp4 -s 30 -d 10

# 幅1280pxにリサイズ（高さ自動）
npx ffmpeg-quick resize input.mp4 -w 1280

# 中央を1280x720で切り抜き
npx ffmpeg-quick crop input.mp4 1280x720
```

### 共通オプション

| オプション | 説明 |
|-----------|------|
| `-o, --output <path>` | 出力ファイルパス（デフォルト: 自動生成） |
| `--dry-run` | FFmpegコマンドを表示するだけで実行しない |
| `-y` | 上書き確認をスキップ |

### コマンド別オプション

**compress**
- `--crf <n>` — 品質（0-51、低いほど高品質、デフォルト: 23）
- `--preset <name>` — エンコード速度プリセット（デフォルト: medium）

**gif**
- `-s, --start <sec>` — 開始位置（秒、デフォルト: 0）
- `-d, --duration <sec>` — 長さ（秒、デフォルト: 5）
- `--fps <n>` — フレームレート（デフォルト: 15）
- `--width <px>` — 出力幅（デフォルト: 480）

**webm**
- `--crf <n>` — 品質（0-63、低いほど高品質、デフォルト: 30）

**hls**
- `--segment <sec>` — セグメント長（デフォルト: 6秒）

**thumbnail**
- `-s, --start <sec>` — 抽出位置（秒、デフォルト: 1）

**concat**
- `--re-encode` — 再エンコード（コーデックが異なるファイルの結合時に使用）

**subtitle**
- `--font-size <n>` — フォントサイズ（デフォルト: 24）
- `--color <name>` — 文字色: white, yellow, red, green, cyan（デフォルト: white）
- `--position <pos>` — 表示位置: bottom, top, center（デフォルト: bottom）

**speed**
- `<factor>` — 速度倍率（例: 2 = 2倍速、0.5 = スロー）
- `--no-audio` — 音声を除去（タイムラプス向け）

**stabilize**
- `--strength <n>` — 補正の強さ 1-30（デフォルト: 10）
- `--shakiness <n>` — 入力のブレ推定値 1-10（デフォルト: 5）

**trim**
- `-s, --start <time>` — 開始位置（秒 or HH:MM:SS、デフォルト: 0）
- `-d, --duration <time>` — 長さ（秒）
- `-t, --to <time>` — 終了位置（秒 or HH:MM:SS）

**resize**
- `-w, --width <px>` — 幅を指定（高さ自動）
- `-h, --height <px>` — 高さを指定（幅自動）

**crop**
- `<size>` — 切り抜きサイズ WxH（例: 1280x720）
- `--pos <x:y>` — 左上の位置（デフォルト: center）

### 面倒なやつ、全部やります

毎回ググるハメになるやつを1コマンドに：

**`concat`** — ファイルリスト手作り不要。並べるだけ：
```bash
# 素のFFmpeg: 一時ファイル作成 → concat demuxer実行 → 一時ファイル削除
# ffmpeg-quick:
npx ffmpeg-quick concat intro.mp4 main.mp4 outro.mp4
```

**`stabilize`** — 2パス処理を1コマンドで：
```bash
# 素のFFmpeg: パス1(解析) → パス2(適用) → .trfファイル削除
# ffmpeg-quick:
npx ffmpeg-quick stabilize shaky.mp4
```

**`speed`** — `setpts`の逆数計算も`atempo`チェーンも不要：
```bash
# 素のFFmpeg: setpts=0.25*PTS（逆数!）, atempo=2.0,atempo=2.0（チェーン!）
# ffmpeg-quick:
npx ffmpeg-quick speed input.mp4 4
```

**`subtitle`** — エスケープ地獄からの解放：
```bash
# 素のFFmpeg: force_style構文、Windowsパスの:衝突、ASSアライメントコード…
# ffmpeg-quick:
npx ffmpeg-quick subtitle video.mp4 subs.srt --font-size 28 --color yellow
```

### `--dry-run` — ググる代わりに

「でも中で何やってるかわからないのは怖い」

`--dry-run` をつけると、実行せずにFFmpegコマンドだけ表示する：

```bash
$ npx ffmpeg-quick gif --dry-run input.mp4 -s 10 -d 3

  ffmpeg -ss 10 -t 3 -i input.mp4 -vf fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse -loop 0 input-output.gif
```

FFmpegを学びたい人にとっては「正しいコマンドを教えてくれるチートシート」にもなる。

### リンク

- ブログ: [32blog.com](https://32blog.com) — FFmpegガイド等
- X: [@omitsu_dev](https://x.com/omitsu_dev)

## License

MIT
