import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("sepia")
    .description("Apply sepia tone effect to video")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "sepia");
      const filter = "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131:0";
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
