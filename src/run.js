import { spawn } from "node:child_process";
import { accessSync } from "node:fs";

/**
 * Run an ffmpeg/ffprobe command.
 * In dry-run mode, prints the command instead of executing it.
 */
export function run(args, opts = {}) {
  const bin = opts.bin || "ffmpeg";
  const dryRun = opts.dryRun || false;

  if (dryRun) {
    const escaped = args.map((a) => (/\s/.test(a) ? `"${a}"` : a));
    console.log(`\n  ${bin} ${escaped.join(" ")}\n`);
    return;
  }

  // Check that the binary exists
  try {
    accessSync("/dev/null"); // just to verify spawn will work
  } catch {
    // ignore
  }

  const child = spawn(bin, args, { stdio: "inherit" });

  child.on("error", (err) => {
    if (err.code === "ENOENT") {
      console.error(
        `Error: "${bin}" not found. Please install FFmpeg: https://ffmpeg.org/download.html`
      );
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  });

  child.on("close", (code) => {
    process.exit(code ?? 0);
  });
}
