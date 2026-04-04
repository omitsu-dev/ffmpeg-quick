import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-channels")
    .description("Set audio channel count (e.g. mono, stereo, 5.1)")
    .argument("<input>", "Input video/audio file")
    .argument("<channels>", "Number of channels (1=mono, 2=stereo, 6=5.1)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, channels, opts) => {
      const out = opts.output || outputName(input, `ch${channels}`);
      const args = ["-i", input, "-ac", channels, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
