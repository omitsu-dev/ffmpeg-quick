import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("boomerang")
    .description("Create a boomerang effect (forward + reverse loop)")
    .argument("<input>", "Input video file")
    .option("--no-audio", "Remove audio from output")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "boomerang");
      const filter = "[0:v]split[fwd][rev];[rev]reverse[reversed];[fwd][reversed]concat=n=2:v=1:a=0";

      const args = ["-i", input, "-filter_complex", filter];

      if (opts.audio === false) {
        args.push("-an");
      } else {
        args.push("-c:a", "copy");
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
