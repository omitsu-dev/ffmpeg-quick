import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("tile")
    .description("Create contact sheet / thumbnail grid from video")
    .argument("<input>", "Input video file")
    .option("--cols <n>", "Number of columns", "4")
    .option("--rows <n>", "Number of rows", "4")
    .option("--width <px>", "Width of each thumbnail", "320")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const cols = parseInt(opts.cols, 10);
      const rows = parseInt(opts.rows, 10);
      const total = cols * rows;
      const filter = `select='not(mod(n\\,${Math.max(1, Math.floor(1))}))' ,scale=${opts.width}:-1,tile=${cols}x${rows}`;

      const out = opts.output || outputName(input, `tile${cols}x${rows}`, ".jpg");
      const args = [
        "-i", input,
        "-frames:v", "1",
        "-vf", `select='isnan(prev_selected_t)+gte(t-prev_selected_t\\,1)',scale=${opts.width}:-1,tile=${cols}x${rows}`,
        "-q:v", "2",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
