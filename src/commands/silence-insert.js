import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("silence-insert")
    .description("Insert a duration of silence at a specific time position")
    .argument("<input>", "Input video/audio file")
    .argument("<at>", "Insert position in seconds")
    .argument("<duration>", "Duration of silence in seconds")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, at, duration, opts) => {
      const out = opts.output || outputName(input, "silence-ins");
      const args = [
        "-i", input,
        "-af", `apad=pad_dur=${duration}:pad_len=0,adelay=${Math.round(parseFloat(at) * 1000)}|${Math.round(parseFloat(at) * 1000)}`,
        "-c:v", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
