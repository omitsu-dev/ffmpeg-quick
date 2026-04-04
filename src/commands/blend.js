import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("blend")
    .description("Blend two videos together with opacity")
    .argument("<input1>", "First video (base)")
    .argument("<input2>", "Second video (overlay)")
    .option("--opacity <n>", "Opacity of second video (0.0-1.0)", "0.5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input1, input2, opts) => {
      const out = opts.output || outputName(input1, "blend");
      const args = [
        "-i", input1,
        "-i", input2,
        "-filter_complex",
        `[1]format=yuva420p,colorchannelmixer=aa=${opts.opacity}[over];[0][over]overlay`,
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
