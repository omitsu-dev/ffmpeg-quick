import { run } from "../run.js";
import { parsePositiveNumber } from "../utils.js";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("snapshot")
    .description("Extract frames at regular intervals as images")
    .argument("<input>", "Input video file")
    .option("--interval <seconds>", "Capture interval in seconds", "1")
    .option("--format <fmt>", "Output image format (jpg, png)", "jpg")
    .option("-o, --output <pattern>", "Output pattern (e.g. frame-%03d.jpg)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const interval = parsePositiveNumber(opts.interval, "interval");

      const dir = dirname(input);
      const base = basename(input, extname(input));
      const ext = opts.format === "png" ? "png" : "jpg";
      const out = opts.output || join(dir, `${base}-snap-%04d.${ext}`);

      const fpsValue = 1 / interval;
      const args = ["-i", input, "-vf", `fps=${fpsValue}`, "-q:v", "2"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
