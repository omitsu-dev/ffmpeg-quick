import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("posterize")
    .description("Reduce color levels (posterization effect)")
    .argument("<input>", "Input video file")
    .option("--levels <n>", "Number of color levels per channel (2-256)", "4")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "posterized");
      const filter = `format=rgb24,lutrgb=r='val-mod(val,256/${opts.levels})':g='val-mod(val,256/${opts.levels})':b='val-mod(val,256/${opts.levels})'`;
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
