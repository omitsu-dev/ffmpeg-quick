import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("border")
    .description("Add a decorative border / frame around video")
    .argument("<input>", "Input video file")
    .option("--width <px>", "Border width in pixels", "20")
    .option("--color <name>", "Border color", "white")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const w = opts.width;
      const filter = `pad=iw+${w}*2:ih+${w}*2:${w}:${w}:color=${opts.color}`;
      const out = opts.output || outputName(input, "bordered");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
