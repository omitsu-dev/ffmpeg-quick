import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("encode-prores")
    .description("Encode video with Apple ProRes codec (for editing)")
    .argument("<input>", "Input video file")
    .option("--profile <p>", "ProRes profile: proxy, lt, standard, hq, 4444", "hq")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const profileMap = { proxy: 0, lt: 1, standard: 2, hq: 3, "4444": 4 };
      const p = profileMap[opts.profile] ?? 3;
      const out = opts.output || outputName(input, "prores", ".mov");
      const args = [
        "-i", input,
        "-c:v", "prores_ks",
        "-profile:v", String(p),
        "-c:a", "pcm_s16le",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
