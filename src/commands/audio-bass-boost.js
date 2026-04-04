import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-bass-boost")
    .description("Boost bass frequencies in audio")
    .argument("<input>", "Input video/audio file")
    .option("--gain <n>", "Bass boost gain in dB", "10")
    .option("--freq <n>", "Center frequency for bass", "100")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "bass-boost");
      const args = ["-i", input, "-af", `bass=g=${opts.gain}:f=${opts.freq}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
