import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-normalize-peak")
    .description("Normalize audio to peak level (simple peak normalization)")
    .argument("<input>", "Input video/audio file")
    .option("--peak <dB>", "Target peak level in dB (e.g. 0, -1, -3)", "0")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "peak-norm");
      const args = [
        "-i", input,
        "-af", `loudnorm=I=-24:TP=${opts.peak}:LRA=7:linear=true`,
        "-c:v", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
