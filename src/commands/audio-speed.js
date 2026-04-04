import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-speed")
    .description("Change audio playback speed without affecting pitch")
    .argument("<input>", "Input video/audio file")
    .argument("<factor>", "Speed factor (0.5=half, 2.0=double)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, factor, opts) => {
      const out = opts.output || outputName(input, "aspeed");
      const args = ["-i", input, "-af", `atempo=${factor}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
