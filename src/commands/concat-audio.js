import { run } from "../run.js";
import { writeFileSync, unlinkSync } from "node:fs";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("concat-audio")
    .description("Concatenate multiple audio files")
    .argument("<inputs...>", "Input audio files (2 or more)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((inputs, opts) => {
      if (inputs.length < 2) {
        console.error("Error: concat-audio requires at least 2 input files.");
        process.exit(1);
      }

      const first = inputs[0];
      const out = opts.output || join(
        dirname(first),
        `${basename(first, extname(first))}-joined${extname(first)}`
      );

      const listContent = inputs.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n");

      if (opts.dryRun) {
        console.log("\n  # File list (auto-generated):");
        for (const line of listContent.split("\n")) {
          console.log(`  # ${line}`);
        }
        const args = ["-f", "concat", "-safe", "0", "-i", "filelist.txt", "-c", "copy"];
        if (opts.y) args.push("-y");
        args.push(out);
        run(args, { dryRun: true });
        return;
      }

      const listPath = join(dirname(first), `.ffmpeg-quick-concat-audio-${Date.now()}.txt`);
      writeFileSync(listPath, listContent);

      const args = ["-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy"];
      if (opts.y) args.push("-y");
      args.push(out);

      const cleanup = () => {
        try { unlinkSync(listPath); } catch {}
      };
      process.on("exit", cleanup);
      run(args);
    });
}
