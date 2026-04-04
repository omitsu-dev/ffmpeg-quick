import { run } from "../run.js";
import { basename, dirname, join } from "node:path";

export function register(program) {
  program
    .command("frames-to-video")
    .description("Create video from sequential image frames")
    .argument("<pattern>", "Input frame pattern (e.g. frame-%04d.png or 'img_*.jpg')")
    .option("--fps <n>", "Output frame rate", "30")
    .option("--codec <name>", "Video codec", "libx264")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((pattern, opts) => {
      const dir = dirname(pattern);
      const base = basename(pattern).replace(/[-_]?%\d*d/, "").replace(/\.[^.]+$/, "");
      const out = opts.output || join(dir, `${base || "output"}-video.mp4`);

      const args = [
        "-framerate", opts.fps,
        "-i", pattern,
        "-c:v", opts.codec,
        "-pix_fmt", "yuv420p",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
