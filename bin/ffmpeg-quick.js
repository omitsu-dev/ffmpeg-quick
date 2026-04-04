#!/usr/bin/env node

import { Command } from "commander";
import { register as compress } from "../src/commands/compress.js";
import { register as gif } from "../src/commands/gif.js";
import { register as hls } from "../src/commands/hls.js";
import { register as audio } from "../src/commands/audio.js";
import { register as thumbnail } from "../src/commands/thumbnail.js";
import { register as stripAudio } from "../src/commands/strip-audio.js";
import { register as info } from "../src/commands/info.js";
import { register as concat } from "../src/commands/concat.js";
import { register as subtitle } from "../src/commands/subtitle.js";
import { register as speed } from "../src/commands/speed.js";
import { register as stabilize } from "../src/commands/stabilize.js";
import { register as trim } from "../src/commands/trim.js";
import { register as resize } from "../src/commands/resize.js";
import { register as crop } from "../src/commands/crop.js";
import { register as watermark } from "../src/commands/watermark.js";
import { register as denoise } from "../src/commands/denoise.js";
import { register as rotate } from "../src/commands/rotate.js";
import { register as fade } from "../src/commands/fade.js";
import { register as reverse } from "../src/commands/reverse.js";
import { register as volume } from "../src/commands/volume.js";
import { register as fps } from "../src/commands/fps.js";
import { register as snapshot } from "../src/commands/snapshot.js";
import { register as split } from "../src/commands/split.js";
import { register as overlay } from "../src/commands/overlay.js";
import { register as convert } from "../src/commands/convert.js";
import { register as loop } from "../src/commands/loop.js";
import { register as blur } from "../src/commands/blur.js";
import { register as mirror } from "../src/commands/mirror.js";
import { register as picture } from "../src/commands/picture.js";
import { register as color } from "../src/commands/color.js";
import { register as mute } from "../src/commands/mute.js";
import { register as pipGrid } from "../src/commands/pip-grid.js";
import { register as boomerang } from "../src/commands/boomerang.js";
import { register as deinterlace } from "../src/commands/deinterlace.js";

const program = new Command();

program
  .name("ffmpeg-quick")
  .description("Quick FFmpeg presets for common video tasks")
  .version("1.5.0");

compress(program);
gif(program);
hls(program);
audio(program);
thumbnail(program);
stripAudio(program);
info(program);
concat(program);
subtitle(program);
speed(program);
stabilize(program);
trim(program);
resize(program);
crop(program);
watermark(program);
denoise(program);
rotate(program);
fade(program);
reverse(program);
volume(program);
fps(program);
snapshot(program);
split(program);
overlay(program);
convert(program);
loop(program);
blur(program);
mirror(program);
picture(program);
color(program);
mute(program);
pipGrid(program);
boomerang(program);
deinterlace(program);

program.parse();
