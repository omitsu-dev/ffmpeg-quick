import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("preview")
    .description("Generate a short highlight preview of a video")
    .argument("<input>", "Input video file")
    .option("--clips <n>", "Number of sample clips", "5")
    .option("--clip-duration <sec>", "Duration of each clip in seconds", "2")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const clips = parseInt(opts.clips, 10);
      const clipDur = parseFloat(opts.clipDuration);

      // Build select filter to pick evenly spaced clips
      // Uses the select filter with periodic sampling
      const selectParts = [];
      for (let i = 0; i < clips; i++) {
        // Each clip: between(t, start, start+clipDur)
        // We use a fraction-based approach assuming unknown total duration
        selectParts.push(`between(t,t_total*${i}/${clips},t_total*${i}/${clips}+${clipDur})`);
      }

      // Simpler approach: use segment + select with trim
      // Most reliable: use the select with periodic segments
      const interval = clipDur;
      const filter = `select='if(lt(mod(t\\,floor(t/${clips})),${clipDur}),1,0)',setpts=N/FRAME_RATE/TB`;

      const out = opts.output || outputName(input, "preview");
      const args = [
        "-i", input,
        "-vf", filter,
        "-af", `aselect='if(lt(mod(t\\,floor(t/${clips})),${clipDur}),1,0)',asetpts=N/SR/TB`,
        "-t", String(clips * clipDur),
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
