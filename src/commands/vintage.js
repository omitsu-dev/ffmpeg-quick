import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("vintage")
    .description("Apply vintage / retro film effect")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      // Combine: slight sepia tone + reduced saturation + vignette + grain
      const filter = [
        "colorchannelmixer=.35:.75:.20:0:.30:.65:.17:0:.25:.50:.13:0",
        "eq=saturation=0.7:contrast=1.1:brightness=0.02",
        "vignette=angle=PI/4",
        "noise=alls=15:allf=t+a",
      ].join(",");

      const out = opts.output || outputName(input, "vintage");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
