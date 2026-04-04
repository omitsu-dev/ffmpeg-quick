import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("encode-vp9")
    .description("Encode video with VP9 codec (WebM compatible)")
    .argument("<input>", "Input video file")
    .option("--crf <n>", "Quality (0-63, lower=better)", "31")
    .option("--speed <n>", "Encoding speed (0-5, lower=better quality)", "1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "vp9", ".webm");
      const args = [
        "-i", input,
        "-c:v", "libvpx-vp9",
        "-crf", opts.crf,
        "-b:v", "0",
        "-cpu-used", opts.speed,
        "-c:a", "libopus",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
