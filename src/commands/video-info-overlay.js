import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("video-info-overlay")
    .description("Burn technical info (frame, pts, type) as text overlay")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "info-overlay");
      const vf = "drawtext=text='frame %{n} | pts %{pts\\:hms} | type %{pict_type}':x=10:y=10:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.5";
      const args = ["-i", input, "-vf", vf, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
