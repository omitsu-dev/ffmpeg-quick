import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("chorus")
    .description("Add chorus effect to audio")
    .argument("<input>", "Input video/audio file")
    .option("--depth <ms>", "Modulation depth in ms", "2")
    .option("--speed <Hz>", "Modulation speed in Hz", "0.5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `chorus=0.5:0.9:50|60|70:0.4|0.32|0.28:${opts.depth}|${opts.depth}|${opts.depth}:${opts.speed}|${opts.speed}|${opts.speed}`;
      const out = opts.output || outputName(input, "chorus");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
