import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("zoom")
    .description("Apply Ken Burns style zoom and pan effect")
    .argument("<input>", "Input video file")
    .option("--direction <dir>", "Zoom direction: in or out", "in")
    .option("--speed <n>", "Zoom speed (0.001-0.01, lower=slower)", "0.002")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      let filter;
      if (opts.direction === "in") {
        filter = `scale=8000:-1,zoompan=z='min(zoom+${opts.speed},1.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
      } else if (opts.direction === "out") {
        filter = `scale=8000:-1,zoompan=z='if(eq(on,1),1.5,max(zoom-${opts.speed},1))':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30`;
      } else {
        console.error("Error: --direction must be in or out.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, `zoom-${opts.direction}`);
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
