import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("bit-depth")
    .description("Change audio bit depth (16, 24, 32)")
    .argument("<input>", "Input video/audio file")
    .argument("<bits>", "Target bit depth: 16, 24, or 32")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, bits, opts) => {
      const formatMap = {
        "16": "s16",
        "24": "s24",
        "32": "s32",
      };

      const fmt = formatMap[bits];
      if (!fmt) {
        console.error("Error: bit depth must be 16, 24, or 32.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, `${bits}bit`);
      const args = ["-i", input, "-sample_fmt", fmt, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
