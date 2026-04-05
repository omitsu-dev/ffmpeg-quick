import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("encode-av1")
    .description("Encode video with AV1 codec (libaom-av1)")
    .argument("<input>", "Input video file")
    .option("--crf <n>", "Quality (0-63, lower=better)", "30")
    .option("--speed <n>", "Encoding speed (0-8, higher=faster)", "6")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "av1", ".mkv");
      const args = [
        "-i", input,
        "-c:v", "libaom-av1",
        "-crf", opts.crf,
        "-b:v", "0",
        "-cpu-used", opts.speed,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
