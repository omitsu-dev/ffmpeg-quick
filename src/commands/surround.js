import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("surround")
    .description("Upmix stereo audio to 5.1 surround sound")
    .argument("<input>", "Input video/audio file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "surround");
      const args = [
        "-i", input,
        "-ac", "6",
        "-c:v", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
