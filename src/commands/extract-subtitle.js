import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("extract-subtitle")
    .description("Extract subtitle track from video as .srt file")
    .argument("<input>", "Input video file")
    .option("--stream <n>", "Subtitle stream index", "0")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "sub", ".srt");
      const args = ["-i", input, "-map", `0:s:${opts.stream}`, "-c:s", "srt"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
