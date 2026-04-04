import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("blur")
    .description("Apply blur or mosaic effect to video")
    .argument("<input>", "Input video file")
    .option("--strength <level>", "Blur strength: light, medium, strong, or a number (e.g. 10)", "medium")
    .option("--region <x:y:w:h>", "Apply blur only to a region (e.g. 100:50:200:200)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const presets = { light: 5, medium: 15, strong: 30 };
      const strength = presets[opts.strength] || parseInt(opts.strength, 10);

      if (isNaN(strength) || strength <= 0) {
        console.error("Error: --strength must be light, medium, strong, or a positive number.");
        process.exit(1);
      }

      let filter;
      if (opts.region) {
        const m = opts.region.match(/^(\d+):(\d+):(\d+):(\d+)$/);
        if (!m) {
          console.error("Error: --region must be x:y:w:h (e.g. 100:50:200:200).");
          process.exit(1);
        }
        const [, x, y, w, h] = m;
        filter = `[0:v]split[base][blur];[blur]crop=${w}:${h}:${x}:${y},boxblur=${strength}[blurred];[base][blurred]overlay=${x}:${y}`;
      } else {
        filter = `boxblur=${strength}`;
      }

      const out = opts.output || outputName(input, "blurred");
      const args = opts.region
        ? ["-i", input, "-filter_complex", filter, "-c:a", "copy"]
        : ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
