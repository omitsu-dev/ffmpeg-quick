import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("frame-step")
    .description("Keep every Nth frame (create time-lapse effect)")
    .argument("<input>", "Input video file")
    .argument("<n>", "Keep every Nth frame")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, n, opts) => {
      const out = opts.output || outputName(input, "step");
      const args = [
        "-i", input,
        "-vf", `select='not(mod(n\\,${n}))',setpts=N/FRAME_RATE/TB`,
        "-an",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
