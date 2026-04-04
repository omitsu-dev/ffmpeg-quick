import { run } from "../run.js";
import { outputName, parsePositiveNumber } from "../utils.js";

/**
 * Build atempo filter chain for a given speed multiplier.
 * atempo only accepts values in [0.5, 100.0], but for quality
 * we chain multiple atempo=2.0 filters for speeds > 2x.
 */
function buildAtempo(speed) {
  const parts = [];
  let remaining = speed;

  if (speed >= 1) {
    while (remaining > 2.0) {
      parts.push("atempo=2.0");
      remaining /= 2.0;
    }
    parts.push(`atempo=${remaining}`);
  } else {
    while (remaining < 0.5) {
      parts.push("atempo=0.5");
      remaining /= 0.5;
    }
    parts.push(`atempo=${remaining}`);
  }

  return parts.join(",");
}

export function register(program) {
  program
    .command("speed")
    .description("Change playback speed (timelapse / slow motion)")
    .argument("<input>", "Input video file")
    .argument("<factor>", "Speed multiplier (e.g. 2 = 2x faster, 0.5 = half speed)")
    .option("--no-audio", "Remove audio (useful for timelapse)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, factor, opts) => {
      const speed = parsePositiveNumber(factor, "speed factor");

      const suffix = speed >= 1 ? `${speed}x` : `slow${speed}x`;
      const out = opts.output || outputName(input, suffix);

      // Video: setpts = (1/speed) * PTS
      const setpts = `setpts=${(1 / speed).toFixed(6)}*PTS`;

      const args = ["-i", input];

      if (opts.audio === false) {
        args.push("-filter:v", setpts, "-an");
      } else {
        const atempo = buildAtempo(speed);
        args.push("-filter:v", setpts, "-filter:a", atempo);
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
