import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("embed-thumbnail")
    .description("Embed a thumbnail image into a video file")
    .argument("<input>", "Input video file")
    .argument("<thumbnail>", "Thumbnail image file (jpg/png)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, thumbnail, opts) => {
      const out = opts.output || outputName(input, "thumb");
      const args = [
        "-i", input,
        "-i", thumbnail,
        "-map", "0",
        "-map", "1",
        "-c", "copy",
        "-c:v:1", "png",
        "-disposition:v:1", "attached_pic",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
