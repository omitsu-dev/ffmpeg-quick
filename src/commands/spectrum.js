import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("spectrum")
    .description("Generate audio spectrogram image")
    .argument("<input>", "Input video/audio file")
    .option("--size <WxH>", "Output image size", "1920x512")
    .option("--color <mode>", "Color scheme: intensity, rainbow, moreland, nebulae, fire, fiery, fruit, cool, magma, green, viridis, plasma, cividis, terrain", "intensity")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const match = opts.size.match(/^(\d+)x(\d+)$/);
      if (!match) {
        console.error("Error: --size must be WxH (e.g. 1920x512).");
        process.exit(1);
      }
      const [, w, h] = match;
      const filter = `showspectrumpic=s=${w}x${h}:color=${opts.color}`;
      const out = opts.output || outputName(input, "spectrum", ".png");
      const args = ["-i", input, "-filter_complex", filter, "-frames:v", "1"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
