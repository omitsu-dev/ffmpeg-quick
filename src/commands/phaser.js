import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("phaser")
    .description("Apply phaser effect to audio")
    .argument("<input>", "Input video/audio file")
    .option("--speed <Hz>", "Modulation speed in Hz", "0.5")
    .option("--decay <n>", "Decay factor (0.0-1.0)", "0.4")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `aphaser=speed=${opts.speed}:decay=${opts.decay}`;
      const out = opts.output || outputName(input, "phaser");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
