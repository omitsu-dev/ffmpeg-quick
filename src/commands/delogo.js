import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("delogo")
    .description("Remove a logo/watermark from a specific area of video")
    .argument("<input>", "Input video file")
    .argument("<region>", "Logo region as x:y:w:h (e.g. 10:10:100:50)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, region, opts) => {
      const [x, y, w, h] = region.split(":");
      const out = opts.output || outputName(input, "delogo");
      const args = ["-i", input, "-vf", `delogo=x=${x}:y=${y}:w=${w}:h=${h}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
