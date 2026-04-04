import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("cinematic")
    .description("Add cinematic letterbox bars (2.35:1 widescreen look)")
    .argument("<input>", "Input video file")
    .option("--ratio <n>", "Aspect ratio width (e.g. 2.35 for 2.35:1)", "2.35")
    .option("--color <name>", "Bar color", "black")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const ratio = parseFloat(opts.ratio);
      // Calculate bar height based on target aspect ratio
      const filter = `crop=iw:iw/${ratio},pad=iw:iw/(16/9):(ow-iw)/2:(oh-ih)/2:color=${opts.color}`;
      const out = opts.output || outputName(input, "cinematic");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
