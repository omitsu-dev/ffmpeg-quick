#!/usr/bin/env node

import { Command } from "commander";
import { register as compress } from "../src/commands/compress.js";
import { register as gif } from "../src/commands/gif.js";
import { register as webm } from "../src/commands/webm.js";
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

const program = new Command();

program
  .name("ffmpeg-quick")
  .description("Quick FFmpeg presets for common video tasks")
  .version("1.2.0");

compress(program);
gif(program);
webm(program);
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

program.parse();
