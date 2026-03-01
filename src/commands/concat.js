import { run } from "../run.js";
import { basename, extname, dirname, join } from "node:path";
import { writeFileSync, unlinkSync } from "node:fs";

export function register(program) {
  program
    .command("concat")
    .description("Concatenate multiple video files")
    .argument("<inputs...>", "Input video files (2 or more)")
    .option("-o, --output <path>", "Output file path")
    .option("--re-encode", "Re-encode streams (use when codecs differ)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((inputs, opts) => {
      if (inputs.length < 2) {
        console.error("Error: concat requires at least 2 input files.");
        process.exit(1);
      }

      const first = inputs[0];
      const out =
        opts.output ||
        join(
          dirname(first),
          `${basename(first, extname(first))}-joined${extname(first)}`
        );

      if (opts.reEncode) {
        // Filter-based concat (re-encodes, works with different codecs)
        const filterInputs = inputs.map((_, i) => `[${i}:v][${i}:a]`).join("");
        const filter = `${filterInputs}concat=n=${inputs.length}:v=1:a=1[outv][outa]`;
        const args = [];
        for (const f of inputs) {
          args.push("-i", f);
        }
        args.push("-filter_complex", filter, "-map", "[outv]", "-map", "[outa]");
        if (opts.y) args.push("-y");
        args.push(out);
        run(args, { dryRun: opts.dryRun });
      } else {
        // Demuxer-based concat (stream copy, fast)
        const listContent = inputs.map((f) => `file '${f}'`).join("\n");

        if (opts.dryRun) {
          console.log("\n  # File list (auto-generated):");
          for (const line of listContent.split("\n")) {
            console.log(`  # ${line}`);
          }
          const args = [
            "-f", "concat", "-safe", "0", "-i", "filelist.txt",
            "-c", "copy",
          ];
          if (opts.y) args.push("-y");
          args.push(out);
          run(args, { dryRun: true });
          return;
        }

        // Write temp file list
        const listPath = join(dirname(first), `.ffmpeg-quick-concat-${Date.now()}.txt`);
        writeFileSync(listPath, listContent);

        const args = [
          "-f", "concat", "-safe", "0", "-i", listPath,
          "-c", "copy",
        ];
        if (opts.y) args.push("-y");
        args.push(out);

        // Clean up temp file on exit
        const cleanup = () => {
          try { unlinkSync(listPath); } catch {}
        };
        process.on("exit", cleanup);

        run(args);
      }
    });
}
