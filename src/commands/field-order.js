import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("field-order")
    .description("Set field order of an interlaced video (tff or bff)")
    .argument("<input>", "Input video file")
    .argument("<order>", "Field order: tff (top-field-first) or bff (bottom-field-first)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, order, opts) => {
      if (order !== "tff" && order !== "bff") {
        console.error("Error: order must be 'tff' or 'bff'.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, order);
      const args = ["-i", input, "-vf", `fieldorder=${order}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
