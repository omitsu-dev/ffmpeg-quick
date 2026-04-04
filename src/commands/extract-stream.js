import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("extract-stream")
    .description("Extract a specific stream by index (video, audio, or subtitle)")
    .argument("<input>", "Input media file")
    .argument("<stream>", "Stream specifier (e.g. v:0, a:1, s:0)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, stream, opts) => {
      const typeMap = { v: ".mp4", a: ".aac", s: ".srt" };
      const type = stream.split(":")[0];
      const ext = typeMap[type] || "";
      const out = opts.output || outputName(input, `stream-${stream.replace(":", "")}`, ext);
      const args = ["-i", input, "-map", `0:${stream}`, "-c", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
