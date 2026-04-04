import { run } from "../run.js";
import { outputName, parsePositiveNumber } from "../utils.js";

export function register(program) {
  program
    .command("loop")
    .description("Loop a video N times")
    .argument("<input>", "Input video file")
    .argument("<count>", "Number of loops (e.g. 3 = play 3 times)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, count, opts) => {
      const n = parsePositiveNumber(count, "loop count");

      const out = opts.output || outputName(input, `loop${Math.floor(n)}`);
      const args = [
        "-stream_loop", String(Math.floor(n) - 1),
        "-i", input,
        "-c", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
