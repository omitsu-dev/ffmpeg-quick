import { run } from "../run.js";
import { outputName, parsePositiveNumber } from "../utils.js";

export function register(program) {
  program
    .command("freeze")
    .description("Freeze a frame for a specified duration")
    .argument("<input>", "Input video file")
    .argument("<at>", "Time position to freeze (seconds or HH:MM:SS)")
    .argument("<hold>", "How long to hold the freeze (seconds)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, at, hold, opts) => {
      const holdSec = parsePositiveNumber(hold, "hold duration");
      const filter = `freezedetect=n=0:d=0,freezeframes=first=${at}:last=${at}:replace=${at}`;

      // Use tpad approach: freeze at a specific point
      const freezeFilter = `tpad=stop_mode=clone:stop_duration=0,setpts='if(gte(T,${at}),if(lte(T,${at}+${holdSec}),${at}/TB,PTS-${holdSec}/TB),PTS)'`;

      const out = opts.output || outputName(input, "freeze");
      const args = ["-i", input, "-vf", freezeFilter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
