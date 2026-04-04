import { run } from "../run.js";

export function register(program) {
  program
    .command("video-to-frames")
    .description("Extract all frames from video as images")
    .argument("<input>", "Input video file")
    .option("--fps <n>", "Extract at specific fps (default: all frames)")
    .option("--format <fmt>", "Image format: png or jpg", "png")
    .option("-o, --output <pattern>", "Output pattern (e.g. frame_%04d.png)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || `frame_%04d.${opts.format}`;
      const args = ["-i", input];

      if (opts.fps) {
        args.push("-vf", `fps=${opts.fps}`);
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
