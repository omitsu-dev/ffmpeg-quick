import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("waveform")
    .description("Generate audio waveform image from video/audio")
    .argument("<input>", "Input video/audio file")
    .option("--size <WxH>", "Output image size", "1920x200")
    .option("--color <hex>", "Waveform color", "0x00FF00")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const match = opts.size.match(/^(\d+)x(\d+)$/);
      if (!match) {
        console.error("Error: --size must be WxH (e.g. 1920x200).");
        process.exit(1);
      }
      const [, w, h] = match;
      const filter = `aformat=channel_layouts=mono,showwavespic=s=${w}x${h}:colors=${opts.color}`;
      const out = opts.output || outputName(input, "waveform", ".png");
      const args = ["-i", input, "-filter_complex", filter, "-frames:v", "1"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
