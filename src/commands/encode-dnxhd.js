import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("encode-dnxhd")
    .description("Encode video with DNxHR codec (for Avid editing workflows)")
    .argument("<input>", "Input video file")
    .option("--profile <p>", "DNxHR profile: lb, sq, hq, hqx, 444", "hq")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "dnxhr", ".mxf");
      const args = [
        "-i", input,
        "-c:v", "dnxhd",
        "-profile:v", `dnxhr_${opts.profile}`,
        "-c:a", "pcm_s16le",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
