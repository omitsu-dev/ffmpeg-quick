import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("mix-audio")
    .description("Mix a secondary audio track (BGM, narration) into video")
    .argument("<input>", "Input video file")
    .argument("<audio>", "Audio file to mix in (mp3, wav, etc.)")
    .option("--volume <level>", "Volume of mixed audio (0.0-1.0)", "0.3")
    .option("--shortest", "End when the shorter stream ends")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, audio, opts) => {
      const filter = `[1:a]volume=${opts.volume}[bgm];[0:a][bgm]amix=inputs=2:duration=first`;
      const out = opts.output || outputName(input, "mixed");
      const args = [
        "-i", input,
        "-i", audio,
        "-filter_complex", filter,
        "-map", "0:v",
        "-c:v", "copy",
      ];

      if (opts.shortest) args.push("-shortest");
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
