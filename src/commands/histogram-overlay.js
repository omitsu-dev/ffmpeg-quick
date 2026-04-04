import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("histogram-overlay")
    .description("Add histogram overlay to video (for color analysis)")
    .argument("<input>", "Input video file")
    .option("--mode <mode>", "Histogram mode: levels, waveform, parade", "levels")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      let filter;
      if (opts.mode === "waveform") {
        filter = "split[main][wave];[wave]waveform=mode=column:size=320x240[w];[main][w]overlay=W-w-10:H-h-10";
      } else if (opts.mode === "parade") {
        filter = "split[main][par];[par]waveform=mode=column:display=parade:size=320x240[p];[main][p]overlay=W-w-10:H-h-10";
      } else {
        filter = "split[main][hist];[hist]histogram=size=320x240[h];[main][h]overlay=W-w-10:H-h-10";
      }

      const out = opts.output || outputName(input, "histogram");
      const args = ["-i", input, "-filter_complex", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
