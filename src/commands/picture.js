import { run } from "../run.js";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("picture")
    .description("Create video from a still image + audio file")
    .argument("<image>", "Input image file (jpg, png)")
    .argument("<audio>", "Input audio file (mp3, wav, etc.)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((image, audio, opts) => {
      const dir = dirname(audio);
      const base = basename(audio, extname(audio));
      const out = opts.output || join(dir, `${base}-video.mp4`);

      const args = [
        "-loop", "1",
        "-i", image,
        "-i", audio,
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-shortest",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
