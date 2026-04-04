import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("timecode")
    .description("Burn timecode / timestamp overlay onto video")
    .argument("<input>", "Input video file")
    .option("--pos <position>", "Position: top-left, top-right, bottom-left, bottom-right", "top-left")
    .option("--font-size <n>", "Font size", "24")
    .option("--color <name>", "Text color", "white")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const posMap = {
        "top-left": "x=10:y=10",
        "top-right": "x=w-text_w-10:y=10",
        "bottom-left": "x=10:y=h-text_h-10",
        "bottom-right": "x=w-text_w-10:y=h-text_h-10",
      };

      const pos = posMap[opts.pos];
      if (!pos) {
        console.error(`Error: --pos must be one of: ${Object.keys(posMap).join(", ")}`);
        process.exit(1);
      }

      const filter = `drawtext=text='%{pts\\:hms}':fontsize=${opts.fontSize}:fontcolor=${opts.color}:${pos}:box=1:boxcolor=black@0.5:boxborderw=4`;
      const out = opts.output || outputName(input, "timecode");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
