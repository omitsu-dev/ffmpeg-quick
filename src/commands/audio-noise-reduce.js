import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-noise-reduce")
    .description("Reduce background noise from audio using FFT-based denoiser")
    .argument("<input>", "Input video/audio file")
    .option("--strength <n>", "Noise reduction strength in dB (default 12)", "12")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "denoised");
      const args = ["-i", input, "-af", `afftdn=nr=${opts.strength}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
