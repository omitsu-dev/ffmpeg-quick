import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("alpha")
    .description("Export video with alpha channel (transparent background)")
    .argument("<input>", "Input video file")
    .option("--color <hex>", "Color to make transparent", "0x00FF00")
    .option("--similarity <n>", "Color match tolerance (0.01-1.0)", "0.3")
    .option("--blend <n>", "Edge blending (0.0-1.0)", "0.1")
    .option("-o, --output <path>", "Output file path (.webm or .mov recommended)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `colorkey=${opts.color}:${opts.similarity}:${opts.blend},format=yuva420p`;
      const out = opts.output || outputName(input, "alpha", ".webm");
      const args = [
        "-i", input,
        "-vf", filter,
        "-c:v", "libvpx-vp9",
        "-auto-alt-ref", "0",
        "-c:a", "libopus",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
