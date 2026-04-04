import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("color-balance")
    .description("Adjust color balance for shadows, midtones, and highlights")
    .argument("<input>", "Input video file")
    .option("--rs <n>", "Red shadow adjustment (-1.0 to 1.0)", "0")
    .option("--gs <n>", "Green shadow adjustment (-1.0 to 1.0)", "0")
    .option("--bs <n>", "Blue shadow adjustment (-1.0 to 1.0)", "0")
    .option("--rm <n>", "Red midtone adjustment (-1.0 to 1.0)", "0")
    .option("--gm <n>", "Green midtone adjustment (-1.0 to 1.0)", "0")
    .option("--bm <n>", "Blue midtone adjustment (-1.0 to 1.0)", "0")
    .option("--rh <n>", "Red highlight adjustment (-1.0 to 1.0)", "0")
    .option("--gh <n>", "Green highlight adjustment (-1.0 to 1.0)", "0")
    .option("--bh <n>", "Blue highlight adjustment (-1.0 to 1.0)", "0")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `colorbalance=rs=${opts.rs}:gs=${opts.gs}:bs=${opts.bs}:rm=${opts.rm}:gm=${opts.gm}:bm=${opts.bm}:rh=${opts.rh}:gh=${opts.gh}:bh=${opts.bh}`;
      const out = opts.output || outputName(input, "balanced");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
