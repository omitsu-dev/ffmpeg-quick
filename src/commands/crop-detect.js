import { run } from "../run.js";

export function register(program) {
  program
    .command("crop-detect")
    .description("Detect optimal crop area (e.g. remove black bars)")
    .argument("<input>", "Input video file")
    .option("--limit <n>", "Black threshold (0-255)", "24")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .action((input, opts) => {
      const args = [
        "-i", input,
        "-vf", `cropdetect=limit=${opts.limit}:round=2:reset=0`,
        "-f", "null", "-",
      ];

      run(args, { dryRun: opts.dryRun });
    });
}
