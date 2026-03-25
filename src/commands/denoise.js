import { run } from "../run.js";
import { outputName } from "../utils.js";

const VIDEO_STRENGTH = {
  light: "3:2:3:2",
  medium: "5:4:5:4",
  strong: "7:6:7:6",
};

const AUDIO_NOISE_FLOOR = {
  light: "-20",
  medium: "-30",
  strong: "-40",
};

export function register(program) {
  program
    .command("denoise")
    .description("Reduce noise from video or audio")
    .argument("<input>", "Input video file")
    .option("--target <type>", "Target: video or audio", "video")
    .option("--strength <level>", "Strength: light, medium, strong", "medium")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "denoised");
      const args = ["-i", input];

      if (opts.target === "audio") {
        const nf = AUDIO_NOISE_FLOOR[opts.strength] || AUDIO_NOISE_FLOOR.medium;
        args.push("-af", `afftdn=nf=${nf}`, "-c:v", "copy");
      } else {
        const params = VIDEO_STRENGTH[opts.strength] || VIDEO_STRENGTH.medium;
        args.push("-vf", `hqdn3d=${params}`, "-c:a", "copy");
      }

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
