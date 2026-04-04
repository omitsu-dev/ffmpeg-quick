import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("echo-effect")
    .description("Add echo / delay effect to audio")
    .argument("<input>", "Input video/audio file")
    .option("--delay <ms>", "Echo delay in ms", "500")
    .option("--decay <n>", "Echo decay factor (0.0-1.0)", "0.3")
    .option("--repeats <n>", "Number of echoes", "3")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const repeats = parseInt(opts.repeats, 10);
      const delays = [];
      const decays = [];
      for (let i = 1; i <= repeats; i++) {
        delays.push(String(parseInt(opts.delay, 10) * i));
        decays.push(String(Math.pow(parseFloat(opts.decay), i).toFixed(3)));
      }

      const filter = `aecho=0.8:0.88:${delays.join("|")}:${decays.join("|")}`;
      const out = opts.output || outputName(input, "echo");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
