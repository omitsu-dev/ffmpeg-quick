import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("transpose")
    .description("Transpose video (swap rows and columns)")
    .argument("<input>", "Input video file")
    .option("--dir <n>", "Direction: 0=90ccw+vflip, 1=90cw, 2=90ccw, 3=90cw+vflip", "1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "transposed");
      const args = ["-i", input, "-vf", `transpose=${opts.dir}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
