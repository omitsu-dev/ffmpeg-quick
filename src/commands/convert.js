import { run } from "../run.js";
import { basename, dirname, join } from "node:path";

export function register(program) {
  program
    .command("convert")
    .description("Convert between video/audio formats (mp4, mov, avi, mkv, webm, mp3, wav, ...)")
    .argument("<input>", "Input file")
    .argument("<format>", "Target format / extension (e.g. mp4, mov, avi, mkv, mp3)")
    .option("--copy", "Stream copy without re-encoding (fast)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, format, opts) => {
      const fmt = format.replace(/^\./, "");
      const dir = dirname(input);
      const base = basename(input).replace(/\.[^.]+$/, "");
      const out = opts.output || join(dir, `${base}.${fmt}`);

      const args = ["-i", input];

      if (opts.copy) {
        args.push("-c", "copy");
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
