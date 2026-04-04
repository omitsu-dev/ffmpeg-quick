import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("glitch")
    .description("Apply digital glitch / datamosh effect")
    .argument("<input>", "Input video file")
    .option("--intensity <n>", "Glitch intensity (1-100)", "30")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const intensity = parseInt(opts.intensity, 10);
      // Combine color channel shifting + noise for glitch look
      const shift = Math.max(1, Math.floor(intensity / 5));
      const noiseAmount = Math.min(intensity, 50);
      const filter = [
        `rgbashift=rh=${shift}:bh=-${shift}:rv=${Math.floor(shift / 2)}:bv=-${Math.floor(shift / 2)}`,
        `noise=alls=${noiseAmount}:allf=t`,
        `eq=contrast=1.2`,
      ].join(",");

      const out = opts.output || outputName(input, "glitch");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
