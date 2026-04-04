import { run } from "../run.js";

export function register(program) {
  program
    .command("duration")
    .description("Show duration of a media file")
    .argument("<input>", "Input media file")
    .option("--dry-run", "Print the ffprobe command without running it")
    .action((input, opts) => {
      const args = [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "csv=p=0",
        "-sexagesimal",
        input,
      ];

      run(args, { bin: "ffprobe", dryRun: opts.dryRun });
    });
}
