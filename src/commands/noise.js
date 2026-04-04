import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("noise")
    .description("Add film grain / noise to video")
    .argument("<input>", "Input video file")
    .option("--strength <n>", "Noise intensity (1-100)", "20")
    .option("--type <type>", "Noise type: uniform or gaussian", "gaussian")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const flags = opts.type === "uniform" ? "u" : "a";
      const filter = `noise=alls=${opts.strength}:allf=t+${flags}`;
      const out = opts.output || outputName(input, "noisy");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
