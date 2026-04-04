import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("stereo")
    .description("Convert audio channels (mono ↔ stereo)")
    .argument("<input>", "Input video/audio file")
    .option("--mode <mode>", "Channel mode: mono, stereo, 5.1", "stereo")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const channelMap = {
        mono: "1",
        stereo: "2",
        "5.1": "6",
      };

      const channels = channelMap[opts.mode];
      if (!channels) {
        console.error("Error: --mode must be mono, stereo, or 5.1.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, opts.mode);
      const args = ["-i", input, "-ac", channels, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
