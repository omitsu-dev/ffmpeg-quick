import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("oscilloscope")
    .description("Add oscilloscope overlay to video (audio visualization on video)")
    .argument("<input>", "Input video file with audio")
    .option("--size <n>", "Oscilloscope size (0.0-1.0)", "0.5")
    .option("--pos <position>", "Position: top-left, top-right, bottom-left, bottom-right, center", "bottom-right")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const posMap = {
        "top-left": "x=0:y=0",
        "top-right": "x=1:y=0",
        "bottom-left": "x=0:y=1",
        "bottom-right": "x=1:y=1",
        "center": "x=0.5:y=0.5",
      };

      const pos = posMap[opts.pos];
      if (!pos) {
        console.error(`Error: --pos must be one of: ${Object.keys(posMap).join(", ")}`);
        process.exit(1);
      }

      const filter = `avectorscope=s=320x320:zoom=1.5:draw=line,format=yuva420p[osc];[0:v][osc]overlay=W*0.7:H*0.7`;
      const out = opts.output || outputName(input, "oscilloscope");
      const args = ["-i", input, "-filter_complex", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
