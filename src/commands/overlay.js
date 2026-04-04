import { run } from "../run.js";
import { outputName } from "../utils.js";

const POSITIONS = {
  "top-left":     "10:10",
  "top-right":    "main_w-overlay_w-10:10",
  "bottom-left":  "10:main_h-overlay_h-10",
  "bottom-right": "main_w-overlay_w-10:main_h-overlay_h-10",
  "center":       "(main_w-overlay_w)/2:(main_h-overlay_h)/2",
};

export function register(program) {
  program
    .command("overlay")
    .description("Picture-in-picture — overlay a video on top of another")
    .argument("<base>", "Base (background) video file")
    .argument("<pip>", "Overlay (foreground) video file")
    .option("--pos <position>", "Position: top-left, top-right, bottom-left, bottom-right, center", "bottom-right")
    .option("--scale <width>", "Scale overlay width in pixels (height auto)", "320")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((base, pip, opts) => {
      const pos = POSITIONS[opts.pos];
      if (!pos) {
        console.error(`Error: --pos must be one of: ${Object.keys(POSITIONS).join(", ")}`);
        process.exit(1);
      }

      const scale = parseInt(opts.scale, 10);
      const filter = `[1:v]scale=${scale}:-1[pip];[0:v][pip]overlay=${pos}`;

      const out = opts.output || outputName(base, "pip");
      const args = [
        "-i", base,
        "-i", pip,
        "-filter_complex", filter,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
