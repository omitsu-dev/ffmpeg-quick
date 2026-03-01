import { spawn } from "node:child_process";
import { unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { run } from "../run.js";
import { outputName } from "../utils.js";

/**
 * Run pass 1 (vidstabdetect) and return a promise.
 */
function detectPass(input, transformsPath, shakiness) {
  return new Promise((resolve, reject) => {
    const args = [
      "-i", input,
      "-vf", `vidstabdetect=shakiness=${shakiness}:result=${transformsPath}`,
      "-f", "null",
      "-",
    ];

    console.log("Pass 1/2: Analyzing motion...");
    const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "inherit"] });

    child.on("error", (err) => {
      if (err.code === "ENOENT") {
        console.error('Error: "ffmpeg" not found. Please install FFmpeg: https://ffmpeg.org/download.html');
      }
      reject(err);
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Pass 1 failed with exit code ${code}`));
    });
  });
}

export function register(program) {
  program
    .command("stabilize")
    .description("Stabilize shaky video (2-pass vidstab)")
    .argument("<input>", "Input video file")
    .option("--strength <n>", "Smoothing strength (1-30, higher=smoother)", "10")
    .option("--shakiness <n>", "Input shakiness estimate (1-10)", "5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action(async (input, opts) => {
      const out = opts.output || outputName(input, "stabilized");
      const transformsPath = join(dirname(input), `.ffmpeg-quick-transforms-${Date.now()}.trf`);

      if (opts.dryRun) {
        console.log("\n  # Pass 1: Analyze motion");
        run(
          ["-i", input, "-vf", `vidstabdetect=shakiness=${opts.shakiness}:result=transforms.trf`, "-f", "null", "-"],
          { dryRun: true }
        );
        console.log("  # Pass 2: Apply stabilization");
        const args = [
          "-i", input,
          "-vf", `vidstabtransform=smoothing=${opts.strength}:input=transforms.trf`,
          "-c:a", "copy",
        ];
        if (opts.y) args.push("-y");
        args.push(out);
        run(args, { dryRun: true });
        return;
      }

      // Pass 1
      try {
        await detectPass(input, transformsPath, opts.shakiness);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }

      // Pass 2
      console.log("Pass 2/2: Applying stabilization...");
      const cleanup = () => {
        try { unlinkSync(transformsPath); } catch {}
      };
      process.on("exit", cleanup);

      const args = [
        "-i", input,
        "-vf", `vidstabtransform=smoothing=${opts.strength}:input=${transformsPath}`,
        "-c:a", "copy",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args);
    });
}
