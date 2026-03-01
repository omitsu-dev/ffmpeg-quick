import { run } from "../run.js";

export function register(program) {
  program
    .command("info")
    .description("Show media file information (ffprobe)")
    .argument("<input>", "Input media file")
    .option("--dry-run", "Print the ffprobe command without running it")
    .action((input, opts) => {
      const args = [
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        input,
      ];
      run(args, { bin: "ffprobe", dryRun: opts.dryRun });
    });
}
