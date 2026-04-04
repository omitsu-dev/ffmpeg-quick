import { run } from "../run.js";

export function register(program) {
  program
    .command("blackdetect")
    .description("Detect black frames / black scenes in video")
    .argument("<input>", "Input video file")
    .option("--threshold <n>", "Black pixel threshold (0.0-1.0)", "0.98")
    .option("--duration <sec>", "Minimum black scene duration", "0.5")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .action((input, opts) => {
      const filter = `blackdetect=d=${opts.duration}:pix_th=${opts.threshold}`;
      const args = ["-i", input, "-vf", filter, "-f", "null", "-"];

      run(args, { dryRun: opts.dryRun });
    });
}
