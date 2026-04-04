import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-visualize")
    .description("Create animated audio visualization video")
    .argument("<input>", "Input audio/video file")
    .option("--mode <mode>", "Visualization: waves, spectrum, histogram", "waves")
    .option("--size <WxH>", "Output video size", "1920x1080")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const match = opts.size.match(/^(\d+)x(\d+)$/);
      if (!match) {
        console.error("Error: --size must be WxH (e.g. 1920x1080).");
        process.exit(1);
      }
      const [, w, h] = match;

      const modeMap = {
        waves: `showwaves=s=${w}x${h}:mode=cline:rate=30:colors=0x00FF00`,
        spectrum: `showspectrum=s=${w}x${h}:mode=combined:color=intensity:slide=scroll`,
        histogram: `ahistogram=s=${w}x${h}:rheight=0.5`,
      };

      const filter = modeMap[opts.mode];
      if (!filter) {
        console.error("Error: --mode must be waves, spectrum, or histogram.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, "visualize", ".mp4");
      const args = ["-i", input, "-filter_complex", filter, "-c:v", "libx264", "-pix_fmt", "yuv420p"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
