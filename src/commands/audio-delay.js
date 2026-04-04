import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-delay")
    .description("Delay or advance audio track (fix audio sync)")
    .argument("<input>", "Input video file")
    .argument("<ms>", "Delay in milliseconds (positive = delay audio, negative = advance)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, ms, opts) => {
      const delay = parseInt(ms, 10);
      if (isNaN(delay)) {
        console.error("Error: delay must be a number in milliseconds.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, "synced");
      const args = ["-i", input];

      if (delay >= 0) {
        args.push("-af", `adelay=${delay}|${delay}`, "-c:v", "copy");
      } else {
        // Negative = advance audio by trimming the start
        const trimSec = Math.abs(delay) / 1000;
        args.push("-af", `atrim=start=${trimSec},asetpts=PTS-STARTPTS`, "-c:v", "copy");
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
