import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("trim-silence")
    .description("Remove silent sections from audio/video")
    .argument("<input>", "Input video/audio file")
    .option("--threshold <dB>", "Silence threshold in dB", "-30")
    .option("--min-duration <sec>", "Minimum silence duration to remove", "0.5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `silenceremove=start_periods=1:start_duration=0:start_threshold=${opts.threshold}dB:stop_periods=-1:stop_duration=${opts.minDuration}:stop_threshold=${opts.threshold}dB`;
      const out = opts.output || outputName(input, "trimmed-silence");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
