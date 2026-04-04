import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-bandpass")
    .description("Apply band-pass filter to audio (keep frequencies in range)")
    .argument("<input>", "Input video/audio file")
    .option("--freq <n>", "Center frequency in Hz", "1000")
    .option("--width <n>", "Band width in Hz", "200")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "bandpass");
      const args = ["-i", input, "-af", `bandpass=f=${opts.freq}:w=${opts.width}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
