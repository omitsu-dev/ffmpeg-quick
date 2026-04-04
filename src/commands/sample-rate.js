import { run } from "../run.js";
import { outputName, parsePositiveNumber } from "../utils.js";

export function register(program) {
  program
    .command("sample-rate")
    .description("Change audio sample rate (e.g. 44100, 48000, 96000)")
    .argument("<input>", "Input video/audio file")
    .argument("<rate>", "Target sample rate in Hz (e.g. 44100, 48000)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, rate, opts) => {
      const sr = parsePositiveNumber(rate, "sample rate");
      const out = opts.output || outputName(input, `${Math.floor(sr)}hz`);
      const args = ["-i", input, "-ar", String(Math.floor(sr)), "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
