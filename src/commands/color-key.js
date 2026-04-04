import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("color-key")
    .description("Remove a specific color and composite over background")
    .argument("<input>", "Input video file")
    .argument("<background>", "Background video or image")
    .option("--color <hex>", "Color to remove (hex, e.g. 0x00FF00)", "0x00FF00")
    .option("--similarity <n>", "Color match tolerance (0.01-1.0)", "0.3")
    .option("--blend <n>", "Edge blending (0.0-1.0)", "0.1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, background, opts) => {
      const out = opts.output || outputName(input, "colorkey");
      const args = [
        "-i", input,
        "-i", background,
        "-filter_complex",
        `[0]colorkey=${opts.color}:${opts.similarity}:${opts.blend}[fg];[1][fg]overlay[out]`,
        "-map", "[out]",
        "-map", "0:a?",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
