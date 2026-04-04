import { run } from "../run.js";

export function register(program) {
  program
    .command("scene-cut")
    .description("Split video at scene changes automatically")
    .argument("<input>", "Input video file")
    .option("--threshold <n>", "Scene change threshold (0-1, lower=more sensitive)", "0.3")
    .option("-o, --output <pattern>", "Output pattern (e.g. scene_%03d.mp4)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const ext = input.includes(".") ? input.split(".").pop() : "mp4";
      const out = opts.output || `scene_%03d.${ext}`;
      const args = [
        "-i", input,
        "-f", "segment",
        "-segment_format", ext,
        "-vf", `select='gt(scene,${opts.threshold})'`,
        "-c:a", "copy",
        "-reset_timestamps", "1",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
