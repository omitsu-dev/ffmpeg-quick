import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("backdrop")
    .description("Add blurred background to vertical video (for 16:9 output)")
    .argument("<input>", "Input vertical video file")
    .option("--size <WxH>", "Output canvas size", "1920x1080")
    .option("--blur <n>", "Background blur strength", "20")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const match = opts.size.match(/^(\d+)x(\d+)$/);
      if (!match) {
        console.error("Error: --size must be WxH (e.g. 1920x1080).");
        process.exit(1);
      }
      const [, w, h] = match;

      const filter = [
        `[0:v]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},boxblur=${opts.blur}[bg]`,
        `[0:v]scale=${w}:${h}:force_original_aspect_ratio=decrease[fg]`,
        `[bg][fg]overlay=(W-w)/2:(H-h)/2`,
      ].join(";");

      const out = opts.output || outputName(input, "backdrop");
      const args = ["-i", input, "-filter_complex", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
