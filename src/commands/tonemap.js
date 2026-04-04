import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("tonemap")
    .description("Convert HDR video to SDR")
    .argument("<input>", "Input HDR video file")
    .option("--algorithm <name>", "Tonemap algorithm: hable, reinhard, mobius, linear", "hable")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const filter = `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=${opts.algorithm},zscale=t=bt709:m=bt709:r=tv,format=yuv420p`;
      const out = opts.output || outputName(input, "sdr");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
