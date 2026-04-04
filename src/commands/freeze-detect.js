import { run } from "../run.js";

export function register(program) {
  program
    .command("freeze-detect")
    .description("Detect frozen/static frames in video")
    .argument("<input>", "Input video file")
    .option("--duration <n>", "Minimum freeze duration in seconds", "2")
    .option("--noise <n>", "Noise tolerance (0-1)", "0.001")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .action((input, opts) => {
      const args = [
        "-i", input,
        "-vf", `freezedetect=n=${opts.noise}:d=${opts.duration}`,
        "-f", "null", "-",
      ];

      run(args, { dryRun: opts.dryRun });
    });
}
