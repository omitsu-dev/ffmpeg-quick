import { run } from "../run.js";
import { outputName, parsePreset } from "../utils.js";

const STRENGTH_PRESETS = { light: "3:3:1", medium: "5:5:1.5", strong: "7:7:2" };

export function register(program) {
  program
    .command("sharpen")
    .description("Sharpen video (unsharp mask)")
    .argument("<input>", "Input video file")
    .option("--strength <level>", "Strength: light, medium, strong", "medium")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const params = STRENGTH_PRESETS[opts.strength];
      if (!params) {
        console.error(`Error: --strength must be light, medium, or strong.`);
        process.exit(1);
      }

      const out = opts.output || outputName(input, "sharpened");
      const args = ["-i", input, "-vf", `unsharp=${params}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
