import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("fade-between")
    .description("Add fade-to-black transition between two videos")
    .argument("<input1>", "First video")
    .argument("<input2>", "Second video")
    .option("--duration <n>", "Fade duration in seconds", "1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input1, input2, opts) => {
      const out = opts.output || outputName(input1, "faded");
      const d = opts.duration;
      const args = [
        "-i", input1,
        "-i", input2,
        "-filter_complex",
        `[0]fade=t=out:st=0:d=${d}[v0];[1]fade=t=in:st=0:d=${d}[v1];[v0][v1]concat=n=2:v=1:a=0[v];[0:a][1:a]concat=n=2:v=0:a=1[a]`,
        "-map", "[v]",
        "-map", "[a]",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
