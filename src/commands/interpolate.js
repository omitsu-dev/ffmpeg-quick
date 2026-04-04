import { run } from "../run.js";
import { outputName, parsePositiveNumber } from "../utils.js";

export function register(program) {
  program
    .command("interpolate")
    .description("Frame interpolation for smooth slow motion")
    .argument("<input>", "Input video file")
    .argument("<target-fps>", "Target frame rate (e.g. 60, 120)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, targetFps, opts) => {
      const fps = parsePositiveNumber(targetFps, "target FPS");
      const filter = `minterpolate=fps=${fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`;
      const out = opts.output || outputName(input, `${fps}fps-interp`);
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
