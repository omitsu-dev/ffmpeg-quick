import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("drawbox")
    .description("Draw a rectangle / border onto video")
    .argument("<input>", "Input video file")
    .argument("<region>", "Box region as x:y:w:h (e.g. 100:50:200:150)")
    .option("--color <name>", "Box color", "red")
    .option("--thickness <n>", "Border thickness (or 'fill' for solid)", "3")
    .option("--start <sec>", "Show from this time (seconds)")
    .option("--end <sec>", "Hide after this time (seconds)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, region, opts) => {
      const match = region.match(/^(\d+):(\d+):(\d+):(\d+)$/);
      if (!match) {
        console.error("Error: region must be x:y:w:h (e.g. 100:50:200:150).");
        process.exit(1);
      }

      const [, x, y, w, h] = match;
      const t = opts.thickness === "fill" ? "fill" : opts.thickness;
      let filter = `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=${opts.color}:t=${t}`;

      if (opts.start !== undefined && opts.end !== undefined) {
        filter += `:enable='between(t,${opts.start},${opts.end})'`;
      } else if (opts.start !== undefined) {
        filter += `:enable='gte(t,${opts.start})'`;
      } else if (opts.end !== undefined) {
        filter += `:enable='lte(t,${opts.end})'`;
      }

      const out = opts.output || outputName(input, "boxed");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
