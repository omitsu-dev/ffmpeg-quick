import { run } from "../run.js";
import { writeFileSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function register(program) {
  program
    .command("slideshow")
    .description("Create slideshow video from multiple images")
    .argument("<images...>", "Input image files (2 or more)")
    .option("--duration <sec>", "Duration per image in seconds", "3")
    .option("--fps <n>", "Output frame rate", "30")
    .option("--transition <sec>", "Crossfade transition duration between images (0 = no transition)", "0")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((images, opts) => {
      if (images.length < 2) {
        console.error("Error: slideshow requires at least 2 images.");
        process.exit(1);
      }

      const dir = dirname(images[0]);
      const out = opts.output || join(dir, "slideshow.mp4");
      const listContent = images.map((f) => `file '${resolve(f).replace(/'/g, "'\\''")}'
duration ${opts.duration}`).join("\n");

      if (opts.dryRun) {
        console.log("\n  # Image list (auto-generated):");
        for (const line of listContent.split("\n")) {
          console.log(`  # ${line}`);
        }
        const args = [
          "-f", "concat", "-safe", "0", "-i", "imagelist.txt",
          "-vf", `fps=${opts.fps},format=yuv420p`,
          "-c:v", "libx264",
        ];
        if (opts.y) args.push("-y");
        args.push(out);
        run(args, { dryRun: true });
        return;
      }

      const listPath = join(dir, `.ffmpeg-quick-slideshow-${Date.now()}.txt`);
      writeFileSync(listPath, listContent);

      const args = [
        "-f", "concat", "-safe", "0", "-i", listPath,
        "-vf", `fps=${opts.fps},format=yuv420p`,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
      ];

      if (opts.y) args.push("-y");
      args.push(out);

      const cleanup = () => {
        try { unlinkSync(listPath); } catch {}
      };
      process.on("exit", cleanup);
      run(args);
    });
}
