import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("rotate")
    .description("Rotate or flip a video")
    .argument("<input>", "Input video file")
    .argument("<angle>", "Rotation: 90, 180, 270, hflip, vflip")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, angle, opts) => {
      const filterMap = {
        "90": "transpose=1",
        "180": "transpose=1,transpose=1",
        "270": "transpose=2",
        "hflip": "hflip",
        "vflip": "vflip",
      };

      const filter = filterMap[angle];
      if (!filter) {
        console.error("Error: angle must be 90, 180, 270, hflip, or vflip.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, `rot${angle}`);
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
