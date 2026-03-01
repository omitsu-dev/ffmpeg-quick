import { run } from "../run.js";
import { outputName } from "../utils.js";
import { resolve } from "node:path";

/**
 * Escape a file path for use in FFmpeg's subtitle filter.
 * Handles Windows drive colons and special characters.
 */
function escapeSubPath(p) {
  const abs = resolve(p);
  // FFmpeg subtitle filter treats : and \ as special chars
  return abs.replace(/\\/g, "/").replace(/:/g, "\\:");
}

export function register(program) {
  program
    .command("subtitle")
    .description("Burn subtitles into video")
    .argument("<input>", "Input video file")
    .argument("<sub>", "Subtitle file (.srt, .ass, .vtt)")
    .option("--font-size <n>", "Font size", "24")
    .option("--color <name>", "Font color (white, yellow, etc.)", "white")
    .option("--position <pos>", "Position: bottom, top, center", "bottom")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, sub, opts) => {
      const out = opts.output || outputName(input, "subtitled");

      const colorMap = {
        white: "&H00FFFFFF",
        yellow: "&H0000FFFF",
        red: "&H000000FF",
        green: "&H0000FF00",
        cyan: "&H00FFFF00",
      };
      const color = colorMap[opts.color] || colorMap.white;

      const alignMap = { bottom: "2", top: "8", center: "5" };
      const align = alignMap[opts.position] || "2";

      const escapedSub = escapeSubPath(sub);
      const style = `FontSize=${opts.fontSize},PrimaryColour=${color},Alignment=${align}`;
      const filter = `subtitles=${escapedSub}:force_style='${style}'`;

      const args = [
        "-i", input,
        "-vf", filter,
        "-c:a", "copy",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
