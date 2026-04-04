import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("chroma")
    .description("Adjust hue / color temperature")
    .argument("<input>", "Input video file")
    .option("--hue <degrees>", "Hue rotation in degrees (-180 to 180)", "0")
    .option("--saturation <n>", "Saturation multiplier (0-3)", "1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `hue=h=${opts.hue}:s=${opts.saturation}`;
      const out = opts.output || outputName(input, "chroma");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
