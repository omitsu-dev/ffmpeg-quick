import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("compress")
    .description("Compress video with H.264 (CRF)")
    .argument("<input>", "Input video file")
    .option("--crf <n>", "Quality (0-51, lower=better)", "23")
    .option("--preset <name>", "Encoding speed preset", "medium")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "compressed");
      const args = [
        "-i", input,
        "-c:v", "libx264",
        "-crf", opts.crf,
        "-preset", opts.preset,
        "-c:a", "aac",
        "-movflags", "+faststart",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
