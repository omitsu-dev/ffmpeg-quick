import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("chromakey")
    .description("Remove green/blue screen background (chroma key)")
    .argument("<input>", "Input video with green/blue screen")
    .argument("<background>", "Background image or video")
    .option("--color <hex>", "Key color to remove", "0x00FF00")
    .option("--similarity <n>", "Color match tolerance (0.01-1.0, lower=stricter)", "0.3")
    .option("--blend <n>", "Edge blending (0.0-1.0)", "0.1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, background, opts) => {
      const filter = `[0:v]colorkey=${opts.color}:${opts.similarity}:${opts.blend}[fg];[1:v][fg]overlay[out]`;
      const out = opts.output || outputName(input, "keyed");
      const args = [
        "-i", input,
        "-i", background,
        "-filter_complex", filter,
        "-map", "[out]",
        "-map", "0:a?",
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
