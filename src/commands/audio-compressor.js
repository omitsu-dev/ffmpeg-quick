import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-compressor")
    .description("Apply dynamic range compression to audio")
    .argument("<input>", "Input video/audio file")
    .option("--threshold <dB>", "Threshold in dB", "-20")
    .option("--ratio <n>", "Compression ratio (e.g. 4 = 4:1)", "4")
    .option("--attack <ms>", "Attack time in ms", "20")
    .option("--release <ms>", "Release time in ms", "250")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `acompressor=threshold=${opts.threshold}dB:ratio=${opts.ratio}:attack=${opts.attack}:release=${opts.release}`;
      const out = opts.output || outputName(input, "compressed-audio");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
