import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-highpass")
    .description("Apply high-pass filter to audio (remove low frequencies)")
    .argument("<input>", "Input video/audio file")
    .option("--freq <n>", "Cutoff frequency in Hz", "200")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "highpass");
      const args = ["-i", input, "-af", `highpass=f=${opts.freq}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
