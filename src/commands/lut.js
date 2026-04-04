import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("lut")
    .description("Apply a 3D LUT file for color grading")
    .argument("<input>", "Input video file")
    .argument("<lutfile>", "LUT file path (.cube, .3dl)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, lutfile, opts) => {
      const out = opts.output || outputName(input, "graded");
      const args = ["-i", input, "-vf", `lut3d=${lutfile}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
