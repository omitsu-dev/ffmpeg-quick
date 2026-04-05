import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("censor")
    .description("Censor (bleep) audio in a specific time range")
    .argument("<input>", "Input video/audio file")
    .option("-s, --start <time>", "Start time in seconds", "0")
    .option("-e, --end <time>", "End time in seconds")
    .option("--freq <hz>", "Bleep frequency in Hz", "1000")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      if (!opts.end) {
        console.error("Error: --end (-e) is required.");
        process.exit(1);
      }

      const between = `between(t,${opts.start},${opts.end})`;
      const filterComplex =
        `[0:a]volume=enable='${between}':volume=0[a0];` +
        `[1:a]volume=enable='${between}':volume=1:eval=frame[a1];` +
        `[a0][a1]amix=inputs=2:duration=first[aout]`;

      const out = opts.output || outputName(input, "censored");
      const args = [
        "-i", input,
        "-f", "lavfi", "-i", `sine=frequency=${opts.freq}`,
        "-filter_complex", filterComplex,
        "-map", "0:v?",
        "-map", "[aout]",
        "-c:v", "copy",
        "-shortest",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
