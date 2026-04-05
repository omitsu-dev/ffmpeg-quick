import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-reverse")
    .description("Reverse audio only (keep video forward)")
    .argument("<input>", "Input video/audio file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "audio-reversed");
      const args = ["-i", input, "-af", "areverse", "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
