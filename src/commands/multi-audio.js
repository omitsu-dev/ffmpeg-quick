import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("multi-audio")
    .description("Add multiple audio tracks to a video (e.g. multilingual)")
    .argument("<video>", "Input video file")
    .argument("<audios...>", "Audio files to add as separate tracks")
    .option("-o, --output <path>", "Output file path (.mkv recommended)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((video, audios, opts) => {
      const out = opts.output || outputName(video, "multi-audio", ".mkv");
      const args = ["-i", video];

      for (const a of audios) {
        args.push("-i", a);
      }

      args.push("-map", "0:v");
      args.push("-map", "0:a?");
      for (let i = 0; i < audios.length; i++) {
        args.push("-map", `${i + 1}:a`);
      }
      args.push("-c", "copy");

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
