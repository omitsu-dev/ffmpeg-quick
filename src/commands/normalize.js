import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("normalize")
    .description("Normalize audio volume (loudnorm EBU R128)")
    .argument("<input>", "Input video/audio file")
    .option("--target <LUFS>", "Target loudness in LUFS", "-16")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `loudnorm=I=${opts.target}:TP=-1.5:LRA=11`;
      const out = opts.output || outputName(input, "normalized");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
