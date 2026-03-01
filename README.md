# ffmpeg-quick

Quick FFmpeg presets for common video tasks. No more memorizing complex commands.

[English](#english) | [日本語](#japanese)

---

<a id="english"></a>

## English

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

### Learning Mode

Use `--dry-run` to see the exact FFmpeg command without executing it:

```bash
$ npx ffmpeg-quick compress --dry-run input.mp4

  ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -movflags +faststart input-compressed.mp4
```

### Links

- Blog: [32blog.com](https://32blog.com) — FFmpeg guides and more
- X: [@omitsu_dev](https://x.com/omitsu_dev)

---

<a id="japanese"></a>

## 日本語

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

### 学習モード

`--dry-run` で実行せずにFFmpegコマンドを確認できます：

```bash
$ npx ffmpeg-quick compress --dry-run input.mp4

  ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -movflags +faststart input-compressed.mp4
```

### リンク

- ブログ: [32blog.com](https://32blog.com) — FFmpegガイド等
- X: [@omitsu_dev](https://x.com/omitsu_dev)

## License

MIT
