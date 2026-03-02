import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("crop")
    .description("Crop a region from the video")
    .argument("<input>", "Input video file")
    .argument("<size>", "Crop size as WxH (e.g. 1280x720)")
    .option("--pos <x:y>", "Top-left position of crop area", "center")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, size, opts) => {
      const match = size.match(/^(\d+)x(\d+)$/);
      if (!match) {
        console.error("Error: size must be WxH (e.g. 1280x720).");
        process.exit(1);
      }

      const [, w, h] = match;
      let x, y;

      if (opts.pos === "center") {
        x = `(in_w-${w})/2`;
        y = `(in_h-${h})/2`;
      } else {
        const posMatch = opts.pos.match(/^(\d+):(\d+)$/);
        if (!posMatch) {
          console.error("Error: --pos must be x:y (e.g. 100:50).");
          process.exit(1);
        }
        [, x, y] = posMatch;
      }

      const out = opts.output || outputName(input, `crop${w}x${h}`);
      const args = [
        "-i", input,
        "-vf", `crop=${w}:${h}:${x}:${y}`,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
