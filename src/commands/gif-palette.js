import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("gif-palette")
    .description("Create high-quality GIF using palette optimization")
    .argument("<input>", "Input video file")
    .option("--fps <n>", "Output frame rate", "15")
    .option("--width <n>", "Output width (-1 for auto)", "480")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "palette", ".gif");
      const args = [
        "-i", input,
        "-filter_complex",
        `fps=${opts.fps},scale=${opts.width}:-1:flags=lanczos[x];[x]split[a][b];[a]palettegen[p];[b][p]paletteuse`,
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
