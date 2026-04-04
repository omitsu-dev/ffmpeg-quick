import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("reverb")
    .description("Add reverb effect to audio")
    .argument("<input>", "Input video/audio file")
    .option("--delay <ms>", "Reverb delay in ms", "40")
    .option("--decay <n>", "Decay factor (0.0-1.0)", "0.5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `aecho=0.8:0.88:${opts.delay}:${opts.decay}`;
      const out = opts.output || outputName(input, "reverb");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
