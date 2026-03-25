import { run } from "../run.js";
import { outputName } from "../utils.js";

const POS_MAP = {
  topleft: (m) => `${m}:${m}`,
  top: (m) => `(W-w)/2:${m}`,
  topright: (m) => `W-w-${m}:${m}`,
  left: (m) => `${m}:(H-h)/2`,
  center: () => "(W-w)/2:(H-h)/2",
  right: (m) => `W-w-${m}:(H-h)/2`,
  bottomleft: (m) => `${m}:H-h-${m}`,
  bottom: (m) => `(W-w)/2:H-h-${m}`,
  bottomright: (m) => `W-w-${m}:H-h-${m}`,
};

export function register(program) {
  program
    .command("watermark")
    .description("Add image watermark overlay to video")
    .argument("<input>", "Input video file")
    .argument("<image>", "Watermark image file (PNG recommended)")
    .option("--position <pos>", "Position: topleft, top, topright, left, center, right, bottomleft, bottom, bottomright", "bottomright")
    .option("--margin <n>", "Margin from edge in pixels", "10")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, image, opts) => {
      const out = opts.output || outputName(input, "watermarked");
      const posFn = POS_MAP[opts.position] || POS_MAP.bottomright;
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
