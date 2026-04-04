import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-gate")
    .description("Apply noise gate to silence audio below threshold")
    .argument("<input>", "Input video/audio file")
    .option("--threshold <dB>", "Gate threshold in dB", "-30")
    .option("--attack <ms>", "Attack time in ms", "20")
    .option("--release <ms>", "Release time in ms", "250")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `agate=threshold=${opts.threshold}dB:attack=${opts.attack}:release=${opts.release}`;
      const out = opts.output || outputName(input, "gated");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
