import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-stereo-widen")
    .description("Widen stereo image of audio")
    .argument("<input>", "Input video/audio file")
    .option("--delay <n>", "Delay in ms for stereo widening", "20")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "wide");
      const args = ["-i", input, "-af", `stereowiden=delay=${opts.delay}`, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
