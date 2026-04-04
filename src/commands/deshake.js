import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("deshake")
    .description("Stabilize shaky video using built-in deshake filter")
    .argument("<input>", "Input video file")
    .option("--rx <n>", "Max x-axis shake in pixels", "64")
    .option("--ry <n>", "Max y-axis shake in pixels", "64")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "deshake");
      const args = ["-i", input, "-vf", `deshake=rx=${opts.rx}:ry=${opts.ry}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
