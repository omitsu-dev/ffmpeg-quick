import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("text")
    .description("Draw text / title onto video")
    .argument("<input>", "Input video file")
    .argument("<string>", "Text to draw")
    .option("--pos <position>", "Position: top-left, top, top-right, center, bottom-left, bottom, bottom-right", "center")
    .option("--font-size <n>", "Font size", "48")
    .option("--color <name>", "Text color", "white")
    .option("--bg <color>", "Background box color (e.g. black@0.5 for semi-transparent)")
    .option("--start <sec>", "Show text from this time (seconds)")
    .option("--end <sec>", "Hide text after this time (seconds)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, string, opts) => {
      const posMap = {
        "top-left": "x=20:y=20",
        "top": "x=(w-text_w)/2:y=20",
        "top-right": "x=w-text_w-20:y=20",
        "center": "x=(w-text_w)/2:y=(h-text_h)/2",
        "bottom-left": "x=20:y=h-text_h-20",
        "bottom": "x=(w-text_w)/2:y=h-text_h-20",
        "bottom-right": "x=w-text_w-20:y=h-text_h-20",
      };

      const pos = posMap[opts.pos];
      if (!pos) {
        console.error(`Error: --pos must be one of: ${Object.keys(posMap).join(", ")}`);
        process.exit(1);
      }

      const escapedText = string.replace(/'/g, "'\\\\\\''").replace(/:/g, "\\:");
      let filter = `drawtext=text='${escapedText}':fontsize=${opts.fontSize}:fontcolor=${opts.color}:${pos}`;

      if (opts.bg) {
        filter += `:box=1:boxcolor=${opts.bg}:boxborderw=8`;
      }

      if (opts.start !== undefined && opts.end !== undefined) {
        filter += `:enable='between(t,${opts.start},${opts.end})'`;
      } else if (opts.start !== undefined) {
        filter += `:enable='gte(t,${opts.start})'`;
      } else if (opts.end !== undefined) {
        filter += `:enable='lte(t,${opts.end})'`;
      }

      const out = opts.output || outputName(input, "text");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
