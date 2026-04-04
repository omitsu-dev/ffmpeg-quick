import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("encode-h265")
    .description("Encode video with H.265/HEVC codec")
    .argument("<input>", "Input video file")
    .option("--crf <n>", "Quality (0-51, lower=better)", "28")
    .option("--preset <p>", "Encoding preset (ultrafast to veryslow)", "medium")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "h265", ".mkv");
      const args = [
        "-i", input,
        "-c:v", "libx265",
        "-crf", opts.crf,
        "-preset", opts.preset,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
