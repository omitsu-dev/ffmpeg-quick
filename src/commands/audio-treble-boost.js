import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-treble-boost")
    .description("Boost treble frequencies in audio")
    .argument("<input>", "Input video/audio file")
    .option("--gain <n>", "Treble boost gain in dB", "5")
    .option("--freq <n>", "Center frequency for treble", "3000")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "treble-boost");
      const args = ["-i", input, "-af", `treble=g=${opts.gain}:f=${opts.freq}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
