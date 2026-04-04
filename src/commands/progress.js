import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("progress")
    .description("Add a progress bar overlay to video")
    .argument("<input>", "Input video file")
    .argument("<duration>", "Total video duration in seconds")
    .option("--pos <position>", "Position: top or bottom", "bottom")
    .option("--color <name>", "Progress bar color", "red")
    .option("--height <px>", "Bar height in pixels", "5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, duration, opts) => {
      const h = opts.height;
      const y = opts.pos === "top" ? "0" : `ih-${h}`;
      const filter = `drawbox=x=0:y=${y}:w='iw*t/${duration}':h=${h}:color=${opts.color}:t=fill`;

      const out = opts.output || outputName(input, "progress");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
