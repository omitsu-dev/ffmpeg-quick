import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("compare")
    .description("Side-by-side comparison of two videos (before/after)")
    .argument("<input1>", "First video (left)")
    .argument("<input2>", "Second video (right)")
    .option("--direction <dir>", "Layout: horizontal or vertical", "horizontal")
    .option("--label", "Add labels (Left/Right or Top/Bottom)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input1, input2, opts) => {
      let filter;
      if (opts.direction === "horizontal") {
        filter = "[0:v]scale=iw/2:ih[left];[1:v]scale=iw/2:ih[right];[left][right]hstack";
      } else if (opts.direction === "vertical") {
        filter = "[0:v]scale=iw:ih/2[top];[1:v]scale=iw:ih/2[bottom];[top][bottom]vstack";
      } else {
        console.error("Error: --direction must be horizontal or vertical.");
        process.exit(1);
      }

      const out = opts.output || outputName(input1, "compare");
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
