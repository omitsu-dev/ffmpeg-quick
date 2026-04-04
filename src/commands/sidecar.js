import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("sidecar")
    .description("Embed subtitle file as a selectable track (not burned in)")
    .argument("<input>", "Input video file")
    .argument("<sub>", "Subtitle file (.srt, .ass, .vtt)")
    .option("--language <lang>", "Subtitle language code (e.g. en, ja, es)", "und")
    .option("--title <text>", "Subtitle track title")
    .option("-o, --output <path>", "Output file path (must be .mkv for multiple subs)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, sub, opts) => {
      const out = opts.output || outputName(input, "subtitled", ".mkv");
      const args = [
        "-i", input,
        "-i", sub,
        "-c", "copy",
        "-c:s", "srt",
        "-map", "0:v",
        "-map", "0:a",
        "-map", "1:0",
        "-metadata:s:s:0", `language=${opts.language}`,
      ];

      if (opts.title) {
        args.push("-metadata:s:s:0", `title=${opts.title}`);
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
