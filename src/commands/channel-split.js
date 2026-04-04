import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("channel-split")
    .description("Split and display individual color channels")
    .argument("<input>", "Input video file")
    .option("--mode <mode>", "Display mode: rgb (side-by-side R/G/B), red, green, blue", "rgb")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const modeMap = {
        rgb: "split=3[r][g][b];[r]lutrgb=g=0:b=0[ro];[g]lutrgb=r=0:b=0[go];[b]lutrgb=r=0:g=0[bo];[ro][go][bo]hstack=inputs=3",
        red: "lutrgb=g=0:b=0",
        green: "lutrgb=r=0:b=0",
        blue: "lutrgb=r=0:g=0",
      };

      const filter = modeMap[opts.mode];
      if (!filter) {
        console.error("Error: --mode must be rgb, red, green, or blue.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, `ch-${opts.mode}`);
      const isComplex = opts.mode === "rgb";
      const args = isComplex
        ? ["-i", input, "-filter_complex", filter, "-c:a", "copy"]
        : ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
