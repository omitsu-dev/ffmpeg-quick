import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("metadata")
    .description("Write metadata tags to a video/audio file")
    .argument("<input>", "Input file")
    .option("--title <text>", "Title")
    .option("--artist <text>", "Artist / Author")
    .option("--album <text>", "Album")
    .option("--year <text>", "Year")
    .option("--comment <text>", "Comment")
    .option("--genre <text>", "Genre")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "tagged");
      const args = ["-i", input, "-c", "copy"];

      if (opts.title) args.push("-metadata", `title=${opts.title}`);
      if (opts.artist) args.push("-metadata", `artist=${opts.artist}`);
      if (opts.album) args.push("-metadata", `album=${opts.album}`);
      if (opts.year) args.push("-metadata", `date=${opts.year}`);
      if (opts.comment) args.push("-metadata", `comment=${opts.comment}`);
      if (opts.genre) args.push("-metadata", `genre=${opts.genre}`);

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
