import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("extract-audio-channel")
    .description("Extract a single audio channel (left or right)")
    .argument("<input>", "Input video/audio file")
    .argument("<channel>", "Channel to extract: left or right")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, channel, opts) => {
      if (channel !== "left" && channel !== "right") {
        console.error("Error: channel must be left or right.");
        process.exit(1);
      }

      const layout = channel === "left" ? "FL" : "FR";
      const out = opts.output || outputName(input, channel);
      const args = ["-i", input, "-af", `pan=mono|c0=${layout}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
