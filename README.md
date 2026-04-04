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

ffmpeg-quick skips the "Google -> copy-paste" loop:

```bash
npx ffmpeg-quick compress input.mp4
npx ffmpeg-quick gif input.mp4 -s 10 -d 3
```

All you need to remember is a verb. `compress`, `gif`, `audio`. Add options only when you need them.

**157 commands. Zero overlap. One tool.**

### Install

```bash
npm install -g ffmpeg-quick
```

Or run directly with npx:

```bash
npx ffmpeg-quick compress input.mp4
```

> **Prerequisite:** [FFmpeg](https://ffmpeg.org/download.html) must be installed on your system.

### Commands (157)

#### Video Encoding & Conversion

| Command | Description |
|---------|-------------|
| `compress` | Compress video with H.264 (CRF) |
| `convert` | Convert between video/audio formats (mp4, mov, avi, mkv, webm, mp3, wav, ...) |
| `encode-h265` | Encode video with H.265/HEVC codec |
| `encode-av1` | Encode video with AV1 codec (high efficiency) |
| `encode-vp9` | Encode video with VP9 codec (WebM compatible) |
| `encode-prores` | Encode video with Apple ProRes codec (for editing) |
| `encode-dnxhd` | Encode video with DNxHR codec (for Avid editing workflows) |
| `bitrate` | Re-encode video to a target bitrate (file size control) |
| `hdr-to-sdr` | Convert HDR video to SDR with tone mapping |

#### Video Editing

| Command | Description |
|---------|-------------|
| `trim` | Cut a section from a video |
| `split` | Split video into segments of equal duration |
| `segment` | Split video into fixed-duration segments |
| `concat` | Concatenate multiple video files |
| `speed` | Change playback speed (timelapse / slow motion) |
| `reverse` | Reverse a video (plays backwards) |
| `boomerang` | Create a boomerang effect (forward + reverse loop) |
| `loop` | Loop a video N times |
| `freeze` | Freeze a frame for a specified duration |
| `repeat-frame` | Hold the last frame of a video for extra seconds |
| `crossfade` | Join two videos with a crossfade transition |
| `fade-between` | Add fade-to-black transition between two videos |
| `censor` | Censor a time range with blur + silence |

#### Video Transform

| Command | Description |
|---------|-------------|
| `resize` | Resize video to a target width or height |
| `crop` | Crop a region from the video |
| `rotate` | Rotate or flip a video |
| `transpose` | Transpose video (swap rows and columns) |
| `mirror` | Create mirror effect (original + flipped side by side) |
| `aspect` | Change display aspect ratio (e.g. 16:9, 4:3, 1:1) |
| `pad` | Add padding / letterbox / pillarbox to video |
| `scale2x` | Upscale video by 2x using pixel-art scaler |
| `border` | Add a decorative border / frame around video |
| `backdrop` | Add blurred background to vertical video (for 16:9 output) |
#### Video Filters & Effects

| Command | Description |
|---------|-------------|
| `blur` | Apply blur or mosaic effect to video |
| `sharpen` | Sharpen video (unsharp mask) |
| `denoise` | Reduce noise from video or audio |
| `deblock` | Remove block artifacts from compressed video |
| `deflicker` | Remove flicker from video (useful for timelapse) |
| `deinterlace` | Remove interlacing artifacts from video |
| `interlace` | Convert progressive video to interlaced |
| `field-order` | Change interlaced field order (TFF / BFF) |
| `deshake` | Stabilize shaky video using built-in deshake filter |
| `stabilize` | Stabilize shaky video (2-pass vidstab) |
| `color` | Adjust brightness, contrast, and saturation |
| `chroma` | Adjust hue / color temperature |
| `color-balance` | Adjust color balance for shadows, midtones, and highlights |
| `equalize` | Auto-correct colors with histogram equalization |
| `lut` | Apply a 3D LUT file for color grading |
| `grayscale` | Convert video to grayscale (black & white) |
| `sepia` | Apply sepia tone effect to video |
| `negative` | Invert colors (negative effect) |
| `posterize` | Reduce color levels (posterization effect) |
| `vintage` | Apply vintage / retro film effect |
| `cinematic` | Add cinematic letterbox bars (2.35:1 widescreen look) |
| `vignette` | Apply vignette (dark edges) effect |
| `edge` | Apply edge detection filter |
| `glitch` | Apply digital glitch / datamosh effect |
| `pixelate` | Apply pixel art / mosaic effect to video |
| `noise` | Add film grain / noise to video |
| `motion-blur` | Apply motion blur effect to video |
| `fade` | Add fade-in / fade-out effect |
| `zoom` | Apply Ken Burns style zoom and pan effect |
| `interpolate` | Frame interpolation for smooth slow motion |

#### Video Overlay & Composition

| Command | Description |
|---------|-------------|
| `watermark` | Add image watermark overlay to video |
| `text` | Draw text / title onto video |
| `drawbox` | Draw a rectangle / border onto video |
| `timecode` | Burn timecode / timestamp overlay onto video |
| `video-info-overlay` | Burn technical info (frame, pts, type) as text overlay |
| `progress` | Add a progress bar overlay to video |
| `pip` | Picture-in-picture: overlay a small video on a main video |
| `pip-grid` | Arrange multiple videos in a grid layout (2x2, 3x3) |
| `stack` | Stack two videos side by side or top/bottom |
| `blend` | Blend two videos together with opacity |
| `chromakey` | Remove green/blue screen background (chroma key) |
| `color-key` | Remove a specific color and composite over background |
| `alpha` | Export video with alpha channel (transparent background) |
| `delogo` | Remove a logo/watermark from a specific area of video |
| `histogram-overlay` | Add histogram overlay to video (for color analysis) |
| `oscilloscope` | Add oscilloscope overlay to video |
| `channel-split` | Split and display individual color channels |

#### Image & Frame Operations

| Command | Description |
|---------|-------------|
| `thumbnail` | Extract a thumbnail image from video |
| `snapshot` | Extract frames at regular intervals as images |
| `tile` | Create contact sheet / thumbnail grid from video |
| `thumbnail-grid` | Generate a contact sheet / thumbnail grid from video |
| `thumbnail-strip` | Create a horizontal filmstrip from video frames |
| `video-to-frames` | Extract all frames from video as images |
| `frames-to-video` | Create video from sequential image frames |
| `slideshow` | Create slideshow video from multiple images |
| `picture` | Create video from a still image + audio file |
| `gif` | Create GIF from video |
| `gif-to-video` | Convert GIF to video (MP4) |
| `frame-step` | Keep every Nth frame (create time-lapse effect) |
#### Audio Processing

| Command | Description |
|---------|-------------|
| `audio` | Extract audio as MP3 |
| `strip-audio` | Remove audio track from video |
| `volume` | Adjust audio volume |
| `normalize` | Normalize audio volume (loudnorm EBU R128) |
| `audio-normalize-peak` | Normalize audio to peak level |
| `audio-compressor` | Apply dynamic range compression to audio |
| `limiter` | Apply audio limiter to prevent clipping |
| `audio-gate` | Apply noise gate to silence audio below threshold |
| `loudness-meter` | Measure audio loudness (LUFS, peak, LRA) |
| `audio-eq` | Apply audio equalizer (bass / treble adjustment) |
| `audio-bass-boost` | Boost bass frequencies in audio |
| `audio-treble-boost` | Boost treble frequencies in audio |
| `audio-lowpass` | Apply low-pass filter (remove high frequencies) |
| `audio-highpass` | Apply high-pass filter (remove low frequencies) |
| `audio-bandpass` | Apply band-pass filter (keep frequencies in range) |
| `audio-noise-reduce` | Reduce background noise from audio (FFT-based) |

#### Audio Effects

| Command | Description |
|---------|-------------|
| `audio-fade` | Fade audio in/out without affecting video |
| `audio-delay` | Delay or advance audio track (fix audio sync) |
| `audio-pitch` | Change audio pitch without changing speed |
| `audio-speed` | Change audio playback speed without affecting pitch |
| `audio-reverse` | Reverse audio only (video unchanged) |
| `reverb` | Add reverb effect to audio |
| `echo-effect` | Add echo / delay effect to audio |
| `chorus` | Add chorus effect to audio |
| `phaser` | Apply phaser effect to audio |
| `flanger` | Apply flanger effect to audio |
| `tremolo` | Apply tremolo (volume oscillation) effect |
| `vibrato` | Apply vibrato (pitch oscillation) effect |
| `audio-karaoke` | Remove vocals from audio (center channel removal) |
| `audio-stereo-widen` | Widen stereo image of audio |
| `pan-audio` | Pan audio left/right (stereo positioning) |

#### Audio Editing

| Command | Description |
|---------|-------------|
| `mix-audio` | Mix a secondary audio track (BGM, narration) into video |
| `replace-audio` | Replace audio track with a different audio file |
| `concat-audio` | Concatenate multiple audio files |
| `multi-audio` | Add multiple audio tracks to a video (e.g. multilingual) |
| `mute` | Mute audio in a specific time range |
| `silence-insert` | Insert a duration of silence at a specific position |
| `trim-silence` | Remove silent sections from audio/video |
| `stereo` | Convert audio channels (mono / stereo / 5.1) |
| `surround` | Upmix stereo audio to 5.1 surround sound |
| `sample-rate` | Change audio sample rate (e.g. 44100, 48000) |
| `bit-depth` | Change audio bit depth (16, 24, 32) |
| `extract-audio-channel` | Extract a single audio channel (left or right) |

#### Streaming

| Command | Description |
|---------|-------------|
| `hls` | Generate HLS segments for streaming |
| `dash` | Generate MPEG-DASH segments for adaptive streaming |

#### Subtitles

| Command | Description |
|---------|-------------|
| `subtitle` | Soft-embed subtitles into video |
| `subtitle-burn` | Burn (hardcode) subtitles into video permanently |
| `sidecar` | Embed subtitle file as a selectable track |
| `extract-subtitle` | Extract subtitle track from video as .srt file |

#### Analysis & Detection

| Command | Description |
|---------|-------------|
| `info` | Show media file information (ffprobe) |
| `duration` | Show duration of a media file |
| `count-frames` | Count total number of frames in a video |
| `compare` | Side-by-side comparison of two videos (before/after) |
| `detect-silence` | Detect silent sections in audio/video |
| `blackdetect` | Detect black frames / black scenes in video |
| `scenes` | Detect scene changes and split video at each cut |
| `crop-detect` | Detect optimal crop area (e.g. remove black bars) |
| `freeze-detect` | Detect frozen/static frames in video |
| `waveform` | Generate audio waveform image |
| `spectrum` | Generate audio spectrogram image |
| `audio-visualize` | Create animated audio visualization video |

#### Metadata & Streams

| Command | Description |
|---------|-------------|
| `metadata` | Write metadata tags to a video/audio file |
| `embed-thumbnail` | Embed a thumbnail/cover image into video or audio file |
| `extract-stream` | Extract a specific stream by index (video, audio, or subtitle) |

#### Preview

| Command | Description |
|---------|-------------|
| `preview` | Generate a short highlight preview of a video |
### Usage

```bash
# Compress video (H.264, CRF 23)
npx ffmpeg-quick compress input.mp4

# Create GIF (start at 10s, 3s duration)
npx ffmpeg-quick gif input.mp4 -s 10 -d 3

# Generate HLS segments
npx ffmpeg-quick hls input.mp4

# Extract audio as MP3
npx ffmpeg-quick audio input.mp4

# Join videos (auto temp file, no manual file list)
npx ffmpeg-quick concat part1.mp4 part2.mp4 part3.mp4

# 2x speed (auto atempo chaining)
npx ffmpeg-quick speed input.mp4 2

# Stabilize shaky footage (2-pass, automatic)
npx ffmpeg-quick stabilize shaky.mp4

# Trim video (start at 30s, 10s duration)
npx ffmpeg-quick trim input.mp4 -s 30 -d 10

# Picture-in-picture
npx ffmpeg-quick pip main.mp4 small.mp4 --pos bottom-right --scale 0.25

# Remove vocals (karaoke)
npx ffmpeg-quick audio-karaoke input.mp4

# Encode to H.265 (half the file size of H.264)
npx ffmpeg-quick encode-h265 input.mp4 --crf 24

# Convert HDR to SDR
npx ffmpeg-quick hdr-to-sdr input.mp4
```

### Common Options

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Output file path (default: auto-generated) |
| `--dry-run` | Print the FFmpeg command without running it |
| `-y` | Overwrite output without asking |

### The Hard Stuff, Made Easy

These commands solve problems that send you down a rabbit hole every time:

**`concat`** -- No more manual file lists. Just pass your files:
```bash
# Without ffmpeg-quick: create temp file list, run concat demuxer, delete temp file
# With ffmpeg-quick:
npx ffmpeg-quick concat intro.mp4 main.mp4 outro.mp4
```

**`stabilize`** -- 2-pass processing in one command:
```bash
# Without ffmpeg-quick: run pass 1 (detect), then pass 2 (transform), then delete .trf file
# With ffmpeg-quick:
npx ffmpeg-quick stabilize shaky.mp4
```

**`speed`** -- No mental math with `setpts` and `atempo`:
```bash
# Without ffmpeg-quick: setpts=0.25*PTS (inverse!), atempo=2.0,atempo=2.0 (chained!)
# With ffmpeg-quick:
npx ffmpeg-quick speed input.mp4 4
```

**`pip`** -- Picture-in-picture without filter_complex nightmares:
```bash
# Without ffmpeg-quick: -filter_complex "[1]scale=iw*0.25:ih*0.25[pip];[0][pip]overlay=..."
# With ffmpeg-quick:
npx ffmpeg-quick pip main.mp4 cam.mp4 --pos top-right --scale 0.3
```

**`audio-karaoke`** -- Remove vocals in one command:
```bash
# Without ffmpeg-quick: -af "pan=stereo|c0=c0-c1|c1=c1-c0" (what?)
# With ffmpeg-quick:
npx ffmpeg-quick audio-karaoke song.mp4
```

### `--dry-run` -- Learn Instead of Googling

"But I don't know what it's doing under the hood..."

Add `--dry-run` to print the FFmpeg command without executing it:

```bash
$ npx ffmpeg-quick gif --dry-run input.mp4 -s 10 -d 3

  ffmpeg -ss 10 -t 3 -i input.mp4 -vf fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse -loop 0 input-output.gif
```

For those who want to learn FFmpeg, it doubles as a cheat sheet that always gives you the right command.

### Links

- Blog: [32blog.com](https://32blog.com) -- FFmpeg guides and more
- X: [@omitsu_dev](https://x.com/omitsu_dev)
---

<a id="japanese"></a>

## 日本語

FFmpegは最強の動画ツール。でも毎回こうなる:

```bash
# 「動画を圧縮したいだけなのに...」
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -movflags +faststart output.mp4
```

```bash
# 「GIF作りたいだけなのに...」
ffmpeg -ss 10 -t 3 -i input.mp4 \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

`-c:v`って何だっけ。`-crf`のデフォルトいくつだっけ。GIFのpalettegen構文どうだっけ。

**毎回ググる。毎回Stack Overflowを開く。毎回コピペする。**

ffmpeg-quickはその「ググる -> コピペ」をスキップする:

```bash
npx ffmpeg-quick compress input.mp4
npx ffmpeg-quick gif input.mp4 -s 10 -d 3
```

覚えることは動詞だけ。`compress`、`gif`、`audio`。オプションは必要なときだけ足す。

**157コマンド。重複ゼロ。ツールひとつ。**

### インストール

```bash
npm install -g ffmpeg-quick
```

npxで直接実行もできます:

```bash
npx ffmpeg-quick compress input.mp4
```

> **前提条件:** [FFmpeg](https://ffmpeg.org/download.html) がインストールされている必要があります。

### コマンド一覧 (157)

#### 動画エンコード・変換

| コマンド | 説明 |
|---------|------|
| `compress` | H.264 (CRF) で動画を圧縮 |
| `convert` | フォーマット変換 (mp4, mov, avi, mkv, webm, mp3, wav, ...) |
| `encode-h265` | H.265/HEVC コーデックでエンコード |
| `encode-av1` | AV1 コーデックでエンコード（高効率） |
| `encode-vp9` | VP9 コーデックでエンコード（WebM互換） |
| `encode-prores` | Apple ProRes でエンコード（編集向け） |
| `encode-dnxhd` | DNxHR でエンコード（Avid編集向け） |
| `bitrate` | ビットレート指定で再エンコード（ファイルサイズ制御） |
| `hdr-to-sdr` | HDR動画をSDRに変換（トーンマッピング） |

#### 動画編集

| コマンド | 説明 |
|---------|------|
| `trim` | 動画の一部を切り出し |
| `split` | 均等な長さで分割 |
| `segment` | 固定秒数で分割 |
| `concat` | 複数の動画を結合 |
| `speed` | 再生速度を変更（タイムラプス/スローモーション） |
| `reverse` | 逆再生 |
| `boomerang` | ブーメランエフェクト（順再生+逆再生ループ） |
| `loop` | N回ループ |
| `freeze` | 指定フレームで一時停止 |
| `repeat-frame` | 最後のフレームを延長 |
| `crossfade` | クロスフェードで2つの動画を結合 |
| `fade-between` | フェード・トゥ・ブラックで2つの動画を結合 |
| `censor` | 時間範囲をぼかし+消音でセンサー |

#### 動画変形

| コマンド | 説明 |
|---------|------|
| `resize` | 解像度を変更 |
| `crop` | 切り抜き |
| `rotate` | 回転・反転 |
| `transpose` | 転置（行列入れ替え） |
| `mirror` | ミラーエフェクト |
| `aspect` | アスペクト比を変更 (16:9, 4:3, 1:1) |
| `pad` | パディング/レターボックス/ピラーボックス |
| `scale2x` | 2倍アップスケール |
| `border` | 装飾ボーダーを追加 |
| `backdrop` | 縦動画にぼかし背景を追加（16:9出力用） |

#### 動画フィルター・エフェクト

| コマンド | 説明 |
|---------|------|
| `blur` | ぼかし/モザイク |
| `sharpen` | シャープ化 |
| `denoise` | ノイズ除去 |
| `deblock` | ブロックノイズ除去 |
| `deflicker` | フリッカー除去 |
| `deinterlace` | インターレース解除 |
| `interlace` | プログレッシブをインターレースに変換 |
| `field-order` | フィールドオーダー変更 (TFF/BFF) |
| `deshake` | 手ブレ補正（deshakeフィルタ） |
| `stabilize` | 手ブレ補正（2パスvidstab） |
| `color` | 明るさ・コントラスト・彩度を調整 |
| `chroma` | 色相/色温度を調整 |
| `color-balance` | シャドウ/ミッドトーン/ハイライトのカラーバランス |
| `equalize` | ヒストグラム均等化で色自動補正 |
| `lut` | 3D LUTファイルでカラーグレーディング |
| `grayscale` | グレースケール（白黒）変換 |
| `sepia` | セピア調エフェクト |
| `negative` | ネガ反転 |
| `posterize` | ポスタリゼーション |
| `vintage` | レトロ/ヴィンテージエフェクト |
| `cinematic` | シネマティックレターボックス（2.35:1） |
| `vignette` | ビネットエフェクト（周辺減光） |
| `edge` | エッジ検出フィルタ |
| `glitch` | デジタルグリッチエフェクト |
| `pixelate` | ピクセルアート/モザイクエフェクト |
| `noise` | フィルムグレイン/ノイズを追加 |
| `motion-blur` | モーションブラー |
| `fade` | フェードイン/フェードアウト |
| `zoom` | ケンバーンズ風ズーム&パン |
| `interpolate` | フレーム補間（スムーズスローモーション） |
#### 動画オーバーレイ・合成

| コマンド | 説明 |
|---------|------|
| `watermark` | 透かし画像をオーバーレイ |
| `text` | テキスト/タイトルを描画 |
| `drawbox` | 矩形/ボーダーを描画 |
| `timecode` | タイムコードを焼き込み |
| `video-info-overlay` | 技術情報（フレーム番号、PTS等）を焼き込み |
| `progress` | プログレスバーをオーバーレイ |
| `pip` | ピクチャーインピクチャー |
| `pip-grid` | 複数動画をグリッド配置 (2x2, 3x3) |
| `stack` | 2つの動画を並べる（横/縦） |
| `blend` | 2つの動画を透過ブレンド |
| `chromakey` | グリーン/ブルースクリーン合成 |
| `color-key` | 任意の色を除去して合成 |
| `alpha` | アルファチャンネル付きで出力 |
| `delogo` | ロゴ/ウォーターマークを除去 |
| `histogram-overlay` | ヒストグラムオーバーレイ |
| `oscilloscope` | オシロスコープオーバーレイ |
| `channel-split` | カラーチャンネル分離表示 |

#### 画像・フレーム操作

| コマンド | 説明 |
|---------|------|
| `thumbnail` | サムネイル画像を抽出 |
| `snapshot` | 一定間隔でフレームを画像出力 |
| `tile` | コンタクトシート/サムネイルグリッド |
| `thumbnail-grid` | コンタクトシート生成 |
| `thumbnail-strip` | 横長フィルムストリップ生成 |
| `video-to-frames` | 全フレームを画像で出力 |
| `frames-to-video` | 連番画像から動画を作成 |
| `slideshow` | 複数画像からスライドショー動画 |
| `picture` | 静止画+音声から動画を作成 |
| `gif` | 動画からGIFを作成 |
| `gif-to-video` | GIFをMP4に変換 |
| `frame-step` | N番目ごとのフレームを残す（タイムラプス効果） |

#### 音声処理

| コマンド | 説明 |
|---------|------|
| `audio` | 音声をMP3で抽出 |
| `strip-audio` | 音声トラックを除去 |
| `volume` | 音量調整 |
| `normalize` | ラウドネス正規化 (EBU R128) |
| `audio-normalize-peak` | ピーク正規化 |
| `audio-compressor` | ダイナミックレンジ圧縮 |
| `limiter` | リミッター（クリッピング防止） |
| `audio-gate` | ノイズゲート |
| `loudness-meter` | ラウドネス測定 (LUFS, ピーク, LRA) |
| `audio-eq` | イコライザー |
| `audio-bass-boost` | 低音ブースト |
| `audio-treble-boost` | 高音ブースト |
| `audio-lowpass` | ローパスフィルタ |
| `audio-highpass` | ハイパスフィルタ |
| `audio-bandpass` | バンドパスフィルタ |
| `audio-noise-reduce` | 音声ノイズ除去（FFTベース） |

#### 音声エフェクト

| コマンド | 説明 |
|---------|------|
| `audio-fade` | 音声フェードイン/アウト（映像はそのまま） |
| `audio-delay` | 音声の遅延/同期調整 |
| `audio-pitch` | ピッチ変更（速度はそのまま） |
| `audio-speed` | 再生速度変更（ピッチはそのまま） |
| `audio-reverse` | 音声のみ逆再生 |
| `reverb` | リバーブ |
| `echo-effect` | エコー/ディレイ |
| `chorus` | コーラス |
| `phaser` | フェイザー |
| `flanger` | フランジャー |
| `tremolo` | トレモロ（音量振動） |
| `vibrato` | ビブラート（ピッチ振動） |
| `audio-karaoke` | ボーカル除去（カラオケ） |
| `audio-stereo-widen` | ステレオイメージ拡張 |
| `pan-audio` | 左右パンニング |

#### 音声編集

| コマンド | 説明 |
|---------|------|
| `mix-audio` | BGM/ナレーションをミックス |
| `replace-audio` | 音声トラックを差し替え |
| `concat-audio` | 複数の音声ファイルを結合 |
| `multi-audio` | 複数音声トラックを追加（多言語等） |
| `mute` | 時間範囲をミュート |
| `silence-insert` | 無音を挿入 |
| `trim-silence` | 無音部分を除去 |
| `stereo` | チャンネル変換（モノラル/ステレオ/5.1） |
| `surround` | ステレオを5.1サラウンドにアップミックス |
| `sample-rate` | サンプルレート変更 |
| `bit-depth` | ビット深度変更 (16, 24, 32) |
| `extract-audio-channel` | 左/右チャンネルを抽出 |

#### ストリーミング

| コマンド | 説明 |
|---------|------|
| `hls` | HLSセグメント生成 |
| `dash` | MPEG-DASHセグメント生成 |

#### 字幕

| コマンド | 説明 |
|---------|------|
| `subtitle` | 字幕をソフト埋め込み |
| `subtitle-burn` | 字幕をハードコード（焼き込み） |
| `sidecar` | 字幕を選択可能トラックとして埋め込み |
| `extract-subtitle` | 字幕トラックを.srtで抽出 |

#### 分析・検出

| コマンド | 説明 |
|---------|------|
| `info` | メディア情報を表示 (ffprobe) |
| `duration` | 長さを表示 |
| `count-frames` | 総フレーム数をカウント |
| `compare` | 2つの動画を横並び比較 |
| `detect-silence` | 無音区間を検出 |
| `blackdetect` | 黒フレーム/黒シーンを検出 |
| `scenes` | シーンチェンジ検出+分割 |
| `crop-detect` | 最適クロップ領域を検出（黒帯除去等） |
| `freeze-detect` | 静止フレームを検出 |
| `waveform` | 波形画像を生成 |
| `spectrum` | スペクトログラム画像を生成 |
| `audio-visualize` | 音声ビジュアライゼーション動画を生成 |

#### メタデータ・ストリーム

| コマンド | 説明 |
|---------|------|
| `metadata` | メタデータタグを書き込み |
| `embed-thumbnail` | サムネイル/カバー画像を埋め込み |
| `extract-stream` | 特定ストリームを抽出 |

#### プレビュー

| コマンド | 説明 |
|---------|------|
| `preview` | 動画のハイライトプレビューを生成 |

### 使い方

```bash
# 動画を圧縮（H.264, CRF 23）
npx ffmpeg-quick compress input.mp4

# GIF作成（10秒地点から3秒間）
npx ffmpeg-quick gif input.mp4 -s 10 -d 3

# 動画を結合（並べるだけ）
npx ffmpeg-quick concat part1.mp4 part2.mp4 part3.mp4

# 2倍速
npx ffmpeg-quick speed input.mp4 2

# 手ブレ補正（2パス自動実行）
npx ffmpeg-quick stabilize shaky.mp4

# ピクチャーインピクチャー
npx ffmpeg-quick pip main.mp4 cam.mp4 --pos top-right --scale 0.3

# ボーカル除去（カラオケ）
npx ffmpeg-quick audio-karaoke song.mp4

# H.265エンコード（H.264の半分のファイルサイズ）
npx ffmpeg-quick encode-h265 input.mp4 --crf 24

# HDRからSDRに変換
npx ffmpeg-quick hdr-to-sdr input.mp4
```

### 共通オプション

| オプション | 説明 |
|-----------|------|
| `-o, --output <path>` | 出力ファイルパス（デフォルト: 自動生成） |
| `--dry-run` | FFmpegコマンドを表示するだけで実行しない |
| `-y` | 上書き確認をスキップ |

### 面倒なやつ、全部やります

毎回ググるハメになるやつを1コマンドに:

**`concat`** -- ファイルリスト手作り不要。並べるだけ:
```bash
npx ffmpeg-quick concat intro.mp4 main.mp4 outro.mp4
```

**`stabilize`** -- 2パス処理を1コマンドで:
```bash
npx ffmpeg-quick stabilize shaky.mp4
```

**`speed`** -- `setpts`の逆数計算も`atempo`チェーンも不要:
```bash
npx ffmpeg-quick speed input.mp4 4
```

**`pip`** -- filter_complexの悪夢からの解放:
```bash
npx ffmpeg-quick pip main.mp4 cam.mp4 --pos top-right --scale 0.3
```

**`audio-karaoke`** -- ボーカル除去が1コマンド:
```bash
npx ffmpeg-quick audio-karaoke song.mp4
```

### `--dry-run` -- ググる代わりに

`--dry-run` をつけると、実行せずにFFmpegコマンドだけ表示する:

```bash
$ npx ffmpeg-quick gif --dry-run input.mp4 -s 10 -d 3

  ffmpeg -ss 10 -t 3 -i input.mp4 -vf fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse -loop 0 input-output.gif
```

FFmpegを学びたい人にとっては「正しいコマンドを教えてくれるチートシート」にもなる。

### リンク

- ブログ: [32blog.com](https://32blog.com) -- FFmpegガイド等
- X: [@omitsu_dev](https://x.com/omitsu_dev)

## Related Articles

- [How to Install FFmpeg 8.0 -- Windows, Mac & Linux Guide](https://32blog.com/en/ffmpeg/ffmpeg-install-guide) -- Setup FFmpeg before using this tool
- [The Complete Guide to Video Compression with FFmpeg](https://32blog.com/en/ffmpeg/ffmpeg-video-compression-guide) -- Deep dive into compression settings

## License

MIT
