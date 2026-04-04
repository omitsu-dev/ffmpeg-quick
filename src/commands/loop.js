import { run } from "../run.js";
import { outputName } from "../utils.js";

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
      const n = parseInt(count, 10);
      if (isNaN(n) || n < 1) {
        console.error("Error: loop count must be a positive integer.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, `loop${n}`);
      const args = [
        "-stream_loop", String(n - 1),
        "-i", input,
        "-c", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
