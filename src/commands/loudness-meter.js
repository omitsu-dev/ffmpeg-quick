import { run } from "../run.js";

export function register(program) {
  program
    .command("loudness-meter")
    .description("Measure audio loudness (EBU R128)")
    .argument("<input>", "Input video/audio file")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .action((input, opts) => {
      const args = ["-i", input, "-af", "ebur128", "-f", "null", "-"];
      run(args, { dryRun: opts.dryRun });
    });
}
