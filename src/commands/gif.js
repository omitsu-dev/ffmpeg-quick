import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("gif")
    .description("Create GIF from video")
    .argument("<input>", "Input video file")
    .option("-s, --start <sec>", "Start time in seconds", "0")
    .option("-d, --duration <sec>", "Duration in seconds", "5")
    .option("--fps <n>", "Frames per second", "15")
    .option("--width <px>", "Output width in pixels", "480")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "output", ".gif");
      const filter = `fps=${opts.fps},scale=${opts.width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;
      const args = [
        "-ss", opts.start,
        "-t", opts.duration,
        "-i", input,
        "-vf", filter,
        "-loop", "0",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
