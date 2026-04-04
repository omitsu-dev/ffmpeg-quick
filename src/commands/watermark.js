import { run } from "../run.js";
import { outputName } from "../utils.js";

const POS_MAP = {
  "top-left": (m) => `${m}:${m}`,
  "top": (m) => `(W-w)/2:${m}`,
  "top-right": (m) => `W-w-${m}:${m}`,
  "left": (m) => `${m}:(H-h)/2`,
  "center": () => "(W-w)/2:(H-h)/2",
  "right": (m) => `W-w-${m}:(H-h)/2`,
  "bottom-left": (m) => `${m}:H-h-${m}`,
  "bottom": (m) => `(W-w)/2:H-h-${m}`,
  "bottom-right": (m) => `W-w-${m}:H-h-${m}`,
};

export function register(program) {
  program
    .command("watermark")
    .description("Add image watermark overlay to video")
    .argument("<input>", "Input video file")
    .argument("<image>", "Watermark image file (PNG recommended)")
    .option("--pos <position>", "Position: top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right", "bottom-right")
    .option("--margin <n>", "Margin from edge in pixels", "10")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, image, opts) => {
      const posFn = POS_MAP[opts.pos];
      if (!posFn) {
        console.error(`Error: --pos must be one of: ${Object.keys(POS_MAP).join(", ")}`);
        process.exit(1);
      }

      const out = opts.output || outputName(input, "watermarked");
      const overlay = posFn(opts.margin);
      const args = [
        "-i", input,
        "-i", image,
        "-filter_complex", `overlay=${overlay}`,
        "-c:a", "copy",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
