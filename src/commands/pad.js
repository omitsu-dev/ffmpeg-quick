import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("pad")
    .description("Add padding / letterbox / pillarbox to video")
    .argument("<input>", "Input video file")
    .argument("<size>", "Target canvas size as WxH (e.g. 1920x1080)")
    .option("--color <hex>", "Padding color", "black")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, size, opts) => {
      const match = size.match(/^(\d+)x(\d+)$/);
      if (!match) {
        console.error("Error: size must be WxH (e.g. 1920x1080).");
        process.exit(1);
      }

      const [, w, h] = match;
      const filter = `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:color=${opts.color}`;
      const out = opts.output || outputName(input, `pad${w}x${h}`);
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
