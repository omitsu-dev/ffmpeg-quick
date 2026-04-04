import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("subtitle-burn")
    .description("Burn (hardcode) subtitles into video permanently")
    .argument("<input>", "Input video file")
    .argument("<srt>", "Subtitle file (.srt, .ass)")
    .option("--font-size <n>", "Font size", "24")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, srt, opts) => {
      const out = opts.output || outputName(input, "burned");
      const args = [
        "-i", input,
        "-vf", `subtitles=${srt}:force_style='FontSize=${opts.fontSize}'`,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
