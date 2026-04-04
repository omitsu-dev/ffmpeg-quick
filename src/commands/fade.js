import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("fade")
    .description("Add fade-in / fade-out effect")
    .argument("<input>", "Input video file")
    .option("--in <seconds>", "Fade-in duration in seconds", "0")
    .option("--out <seconds>", "Fade-out duration in seconds", "0")
    .option("--duration <seconds>", "Total video duration (required for fade-out)")
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

      const vfilters = [];
      const afilters = [];

      if (fadeIn > 0) {
        vfilters.push(`fade=t=in:st=0:d=${fadeIn}`);
        afilters.push(`afade=t=in:st=0:d=${fadeIn}`);
      }

      if (fadeOut > 0) {
        const dur = parseFloat(opts.duration);
        const startOut = dur - fadeOut;
        vfilters.push(`fade=t=out:st=${startOut}:d=${fadeOut}`);
        afilters.push(`afade=t=out:st=${startOut}:d=${fadeOut}`);
      }

      const out = opts.output || outputName(input, "fade");
      const args = ["-i", input, "-vf", vfilters.join(","), "-af", afilters.join(",")];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
