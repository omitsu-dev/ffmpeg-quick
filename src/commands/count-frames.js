import { run } from "../run.js";

export function register(program) {
  program
    .command("count-frames")
    .description("Count total number of frames in a video")
    .argument("<input>", "Input video file")
    .option("--dry-run", "Print the ffprobe command without running it")
    .action((input, opts) => {
      const args = [
        "-v", "error",
        "-count_frames",
        "-select_streams", "v:0",
        "-show_entries", "stream=nb_read_frames",
        "-of", "csv=p=0",
        input,
      ];

      run(args, { bin: "ffprobe", dryRun: opts.dryRun });
    });
}
