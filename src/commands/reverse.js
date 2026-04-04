import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("reverse")
    .description("Reverse a video (plays backwards)")
    .argument("<input>", "Input video file")
    .option("--no-audio", "Remove audio from output")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "reversed");
      const args = ["-i", input];

      if (opts.audio === false) {
        args.push("-vf", "reverse", "-an");
      } else {
        args.push("-vf", "reverse", "-af", "areverse");
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
