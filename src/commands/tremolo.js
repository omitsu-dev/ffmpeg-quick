import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("tremolo")
    .description("Apply tremolo (volume oscillation) effect to audio")
    .argument("<input>", "Input video/audio file")
    .option("--freq <n>", "Modulation frequency in Hz", "5")
    .option("--depth <n>", "Modulation depth (0-1)", "0.5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "tremolo");
      const args = ["-i", input, "-af", `tremolo=f=${opts.freq}:d=${opts.depth}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
