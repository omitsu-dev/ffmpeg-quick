import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("thumbnail-grid")
    .description("Generate a contact sheet / thumbnail grid from video")
    .argument("<input>", "Input video file")
    .option("--cols <n>", "Number of columns", "4")
    .option("--rows <n>", "Number of rows", "4")
    .option("--width <n>", "Width of each thumbnail", "320")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const total = parseInt(opts.cols) * parseInt(opts.rows);
      const out = opts.output || outputName(input, "grid", ".jpg");
      const vf = `select='not(mod(n\\,${Math.max(1, Math.floor(100 / total))}))' ,scale=${opts.width}:-1,tile=${opts.cols}x${opts.rows}`;
      const args = ["-i", input, "-frames:v", "1", "-vf", vf];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
