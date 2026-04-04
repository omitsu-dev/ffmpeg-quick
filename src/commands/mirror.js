import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("mirror")
    .description("Create mirror effect (original + flipped side by side)")
    .argument("<input>", "Input video file")
    .option("--direction <dir>", "Mirror direction: horizontal, vertical", "horizontal")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      let filter;
      if (opts.direction === "horizontal") {
        filter = "[0:v]split[left][right];[right]hflip[flipped];[left][flipped]hstack";
      } else if (opts.direction === "vertical") {
        filter = "[0:v]split[top][bottom];[bottom]vflip[flipped];[top][flipped]vstack";
      } else {
        console.error("Error: --direction must be horizontal or vertical.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, "mirror");
      const args = ["-i", input, "-filter_complex", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
