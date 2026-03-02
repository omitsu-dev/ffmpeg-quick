import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("resize")
    .description("Resize video to a target width or height")
    .argument("<input>", "Input video file")
    .option("-w, --width <px>", "Target width (height auto-scaled)")
    .option("-h, --height <px>", "Target height (width auto-scaled)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      if (!opts.width && !opts.height) {
        console.error("Error: specify --width (-w) or --height (-h).");
        process.exit(1);
      }

      const w = opts.width || "-2";
      const h = opts.height || "-2";
      const label = opts.width ? `${opts.width}w` : `${opts.height}h`;
      const out = opts.output || outputName(input, label);

      const args = [
        "-i", input,
        "-vf", `scale=${w}:${h}`,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
