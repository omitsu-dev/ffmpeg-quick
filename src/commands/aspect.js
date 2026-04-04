import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("aspect")
    .description("Change display aspect ratio (e.g. 16:9, 4:3, 1:1)")
    .argument("<input>", "Input video file")
    .argument("<ratio>", "Aspect ratio (e.g. 16:9, 4:3, 1:1, 21:9)")
    .option("--mode <mode>", "Mode: stretch, crop, or pad", "pad")
    .option("--color <hex>", "Padding color (for pad mode)", "black")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, ratio, opts) => {
      const match = ratio.match(/^(\d+):(\d+)$/);
      if (!match) {
        console.error("Error: ratio must be W:H (e.g. 16:9, 4:3, 1:1).");
        process.exit(1);
      }

      const [, rw, rh] = match;
      let filter;

      if (opts.mode === "stretch") {
        filter = `scale=iw:iw*${rh}/${rw},setsar=1`;
      } else if (opts.mode === "crop") {
        filter = `crop='min(iw,ih*${rw}/${rh})':'min(ih,iw*${rh}/${rw})'`;
      } else {
        // pad mode
        filter = `scale=iw:iw*${rh}/${rw}:force_original_aspect_ratio=decrease,pad=iw:iw*${rh}/${rw}:(ow-iw)/2:(oh-ih)/2:color=${opts.color},setsar=1`;
      }

      const out = opts.output || outputName(input, `${rw}x${rh}`);
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
