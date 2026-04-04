import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("color")
    .description("Adjust brightness, contrast, and saturation")
    .argument("<input>", "Input video file")
    .option("--brightness <value>", "Brightness adjustment (-1.0 to 1.0)", "0")
    .option("--contrast <value>", "Contrast adjustment (-1000 to 1000, default 1)", "1")
    .option("--saturation <value>", "Saturation adjustment (0 = grayscale, 1 = normal, 3 = max)", "1")
    .option("--gamma <value>", "Gamma adjustment (0.1 to 10.0)", "1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `eq=brightness=${opts.brightness}:contrast=${opts.contrast}:saturation=${opts.saturation}:gamma=${opts.gamma}`;
      const out = opts.output || outputName(input, "color");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
