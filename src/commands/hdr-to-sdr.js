import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("hdr-to-sdr")
    .description("Convert HDR video to SDR with tone mapping")
    .argument("<input>", "Input HDR video file")
    .option("--tonemap <algo>", "Tone mapping algorithm: hable, reinhard, mobius", "hable")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "sdr");
      const vf = `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=${opts.tonemap}:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`;
      const args = ["-i", input, "-vf", vf, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
