import { run } from "../run.js";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("scenes")
    .description("Detect scene changes and split video at each cut")
    .argument("<input>", "Input video file")
    .option("--threshold <n>", "Scene change sensitivity (0.0-1.0, lower=more splits)", "0.3")
    .option("-o, --output <pattern>", "Output pattern (e.g. scene-%03d.mp4)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const dir = dirname(input);
      const base = basename(input, extname(input));
      const ext = extname(input);
      const out = opts.output || join(dir, `${base}-scene%03d${ext}`);

      const args = [
        "-i", input,
        "-filter_complex", `select='gt(scene,${opts.threshold})',setpts=N/FRAME_RATE/TB`,
        "-f", "segment",
        "-reset_timestamps", "1",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
