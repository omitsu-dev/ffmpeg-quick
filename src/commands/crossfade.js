import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("crossfade")
    .description("Join two videos with a crossfade transition")
    .argument("<input1>", "First video file")
    .argument("<input2>", "Second video file")
    .argument("<duration>", "Crossfade duration in seconds (e.g. 1)")
    .option("--transition <type>", "Transition type: fade, wipeleft, wiperight, wipeup, wipedown, slideleft, slideright, slideup, slidedown, circlecrop, rectcrop, distance, fadeblack, fadewhite, radial, smoothleft, smoothright, smoothup, smoothdown, squeezev, squeezeh", "fade")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input1, input2, duration, opts) => {
      const filter = `xfade=transition=${opts.transition}:duration=${duration}:offset=0`;
      const out = opts.output || outputName(input1, "crossfade");
      const args = [
        "-i", input1,
        "-i", input2,
        "-filter_complex", filter,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
