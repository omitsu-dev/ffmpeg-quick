import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("vignette")
    .description("Apply vignette (dark edges) effect")
    .argument("<input>", "Input video file")
    .option("--angle <radians>", "Vignette angle (larger = stronger, default PI/5)", "PI/5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "vignette");
      const args = ["-i", input, "-vf", `vignette=angle=${opts.angle}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
