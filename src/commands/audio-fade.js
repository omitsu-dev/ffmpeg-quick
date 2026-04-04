import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-fade")
    .description("Fade audio in/out without affecting video")
    .argument("<input>", "Input video/audio file")
    .option("--in <seconds>", "Fade-in duration in seconds", "0")
    .option("--out <seconds>", "Fade-out duration in seconds", "0")
    .option("--duration <seconds>", "Total audio duration (required for fade-out)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const fadeIn = parseFloat(opts.in);
      const fadeOut = parseFloat(opts.out);

      if (fadeIn === 0 && fadeOut === 0) {
        console.error("Error: specify at least --in or --out duration.");
        process.exit(1);
      }

      if (fadeOut > 0 && !opts.duration) {
        console.error("Error: --duration is required when using --out.");
        process.exit(1);
      }

      const filters = [];
      if (fadeIn > 0) {
        filters.push(`afade=t=in:st=0:d=${fadeIn}`);
      }
      if (fadeOut > 0) {
        const dur = parseFloat(opts.duration);
        filters.push(`afade=t=out:st=${dur - fadeOut}:d=${fadeOut}`);
      }

      const out = opts.output || outputName(input, "audiofade");
      const args = ["-i", input, "-af", filters.join(","), "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
