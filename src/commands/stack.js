import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("stack")
    .description("Stack two videos side by side or top/bottom")
    .argument("<input1>", "First video file")
    .argument("<input2>", "Second video file")
    .option("--direction <dir>", "Stack direction: horizontal or vertical", "horizontal")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input1, input2, opts) => {
      let filter;
      if (opts.direction === "horizontal") {
        filter = "[0:v][1:v]hstack=inputs=2";
      } else if (opts.direction === "vertical") {
        filter = "[0:v][1:v]vstack=inputs=2";
      } else {
        console.error("Error: --direction must be horizontal or vertical.");
        process.exit(1);
      }

      const out = opts.output || outputName(input1, "stacked");
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
