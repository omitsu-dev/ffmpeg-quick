import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("deinterlace")
    .description("Remove interlacing artifacts from video")
    .argument("<input>", "Input video file")
    .option("--mode <mode>", "Deinterlace mode: yadif (default) or bwdif (better quality)", "yadif")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const validModes = ["yadif", "bwdif"];
      if (!validModes.includes(opts.mode)) {
        console.error(`Error: --mode must be one of: ${validModes.join(", ")}`);
        process.exit(1);
      }

      const out = opts.output || outputName(input, "deinterlaced");
      const args = ["-i", input, "-vf", opts.mode, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
