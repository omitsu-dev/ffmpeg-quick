import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-eq")
    .description("Apply audio equalizer (bass / treble adjustment)")
    .argument("<input>", "Input video/audio file")
    .option("--bass <dB>", "Bass gain in dB (-20 to 20)", "0")
    .option("--treble <dB>", "Treble gain in dB (-20 to 20)", "0")
    .option("--mid <dB>", "Mid-range gain in dB (-20 to 20)", "0")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filters = [];
      if (opts.bass !== "0") filters.push(`bass=g=${opts.bass}`);
      if (opts.treble !== "0") filters.push(`treble=g=${opts.treble}`);
      if (opts.mid !== "0") filters.push(`equalizer=f=1000:t=h:width=500:g=${opts.mid}`);

      if (filters.length === 0) {
        console.error("Error: specify at least --bass, --treble, or --mid.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, "eq");
      const args = ["-i", input, "-af", filters.join(","), "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
