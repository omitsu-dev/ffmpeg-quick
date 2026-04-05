import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("interlace")
    .description("Convert progressive video to interlaced")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "interlaced");
      const args = ["-i", input, "-vf", "interlace", "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
