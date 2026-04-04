import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-lowpass")
    .description("Apply low-pass filter to audio (remove high frequencies)")
    .argument("<input>", "Input video/audio file")
    .option("--freq <n>", "Cutoff frequency in Hz", "3000")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "lowpass");
      const args = ["-i", input, "-af", `lowpass=f=${opts.freq}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
