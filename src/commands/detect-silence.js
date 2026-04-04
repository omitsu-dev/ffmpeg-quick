import { run } from "../run.js";

export function register(program) {
  program
    .command("detect-silence")
    .description("Detect silent sections in audio/video")
    .argument("<input>", "Input video/audio file")
    .option("--threshold <dB>", "Silence threshold in dB", "-30")
    .option("--duration <sec>", "Minimum silence duration in seconds", "2")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .action((input, opts) => {
      const filter = `silencedetect=noise=${opts.threshold}dB:d=${opts.duration}`;
      const args = ["-i", input, "-af", filter, "-f", "null", "-"];

      run(args, { dryRun: opts.dryRun });
    });
}
