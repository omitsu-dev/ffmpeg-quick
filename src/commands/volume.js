import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("volume")
    .description("Adjust audio volume")
    .argument("<input>", "Input video/audio file")
    .argument("<level>", "Volume level: 0.5 = half, 2.0 = double, or dB like 3dB / -5dB")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, level, opts) => {
      const out = opts.output || outputName(input, `vol${level.replace(/[^a-zA-Z0-9.-]/g, "")}`);
      const args = ["-i", input, "-af", `volume=${level}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
