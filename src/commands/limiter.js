import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("limiter")
    .description("Apply audio limiter to prevent clipping")
    .argument("<input>", "Input video/audio file")
    .option("--limit <dB>", "Limit level in dB", "-1")
    .option("--attack <ms>", "Attack time in ms", "5")
    .option("--release <ms>", "Release time in ms", "50")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `alimiter=limit=${opts.limit}dB:attack=${opts.attack}:release=${opts.release}`;
      const out = opts.output || outputName(input, "limited");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
