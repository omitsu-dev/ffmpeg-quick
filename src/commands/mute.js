import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("mute")
    .description("Mute audio in a specific time range")
    .argument("<input>", "Input video file")
    .option("-s, --start <time>", "Start time of mute in seconds or HH:MM:SS", "0")
    .option("-e, --end <time>", "End time of mute in seconds or HH:MM:SS")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      if (!opts.end) {
        console.error("Error: --end (-e) is required.");
        process.exit(1);
      }

      const filter = `volume=enable='between(t,${opts.start},${opts.end})':volume=0`;
      const out = opts.output || outputName(input, "muted");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
