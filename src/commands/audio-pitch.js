import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-pitch")
    .description("Change audio pitch without changing speed")
    .argument("<input>", "Input video/audio file")
    .argument("<semitones>", "Pitch shift in semitones (e.g. 2, -3)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, semitones, opts) => {
      const n = parseFloat(semitones);
      if (isNaN(n)) {
        console.error("Error: semitones must be a number (e.g. 2, -3).");
        process.exit(1);
      }

      // rubberband pitch shift: 2^(semitones/12)
      const factor = Math.pow(2, n / 12);
      const filter = `rubberband=pitch=${factor.toFixed(6)}`;
      const suffix = n >= 0 ? `pitch+${n}` : `pitch${n}`;
      const out = opts.output || outputName(input, suffix);
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
