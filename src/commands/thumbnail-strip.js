import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("thumbnail-strip")
    .description("Create a horizontal filmstrip from video frames")
    .argument("<input>", "Input video file")
    .option("--frames <n>", "Number of frames to capture", "10")
    .option("--height <n>", "Height of each frame", "120")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const n = parseInt(opts.frames);
      const out = opts.output || outputName(input, "strip", ".jpg");
      const vf = `select='not(mod(n\\,${Math.max(1, Math.floor(100 / n))}))' ,scale=-1:${opts.height},tile=${n}x1`;
      const args = ["-i", input, "-frames:v", "1", "-vf", vf];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
