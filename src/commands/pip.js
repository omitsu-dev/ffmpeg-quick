import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("pip")
    .description("Picture-in-picture: overlay a small video on a main video")
    .argument("<main>", "Main (background) video")
    .argument("<small>", "Small (overlay) video")
    .option("--pos <position>", "Position: top-left, top-right, bottom-left, bottom-right", "bottom-right")
    .option("--scale <n>", "Scale of overlay relative to main (0.1-1.0)", "0.25")
    .option("--margin <n>", "Margin from edge in pixels", "10")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((main, small, opts) => {
      const out = opts.output || outputName(main, "pip");
      const m = opts.margin;
      const posMap = {
        "top-left": `${m}:${m}`,
        "top-right": `main_w-overlay_w-${m}:${m}`,
        "bottom-left": `${m}:main_h-overlay_h-${m}`,
        "bottom-right": `main_w-overlay_w-${m}:main_h-overlay_h-${m}`,
      };
      const xy = posMap[opts.pos] || posMap["bottom-right"];
      const args = [
        "-i", main,
        "-i", small,
        "-filter_complex",
        `[1]scale=iw*${opts.scale}:ih*${opts.scale}[pip];[0][pip]overlay=${xy}`,
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
