import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("edge")
    .description("Apply edge detection filter")
    .argument("<input>", "Input video file")
    .option("--mode <mode>", "Detection mode: sobel, prewitt, roberts", "sobel")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const modeMap = {
        sobel: "edgedetect=mode=colormix:high=0",
        prewitt: "prewitt",
        roberts: "roberts",
      };

      const filter = modeMap[opts.mode];
      if (!filter) {
        console.error("Error: --mode must be sobel, prewitt, or roberts.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, "edge");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
