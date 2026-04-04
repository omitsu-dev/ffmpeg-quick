import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("flanger")
    .description("Apply flanger effect to audio")
    .argument("<input>", "Input video/audio file")
    .option("--speed <Hz>", "Modulation speed in Hz", "0.5")
    .option("--depth <ms>", "Modulation depth in ms", "2")
    .option("--mix <n>", "Dry/wet mix (0.0-1.0)", "0.7")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `flanger=speed=${opts.speed}:depth=${opts.depth}:mix=${opts.mix}`;
      const out = opts.output || outputName(input, "flanger");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
