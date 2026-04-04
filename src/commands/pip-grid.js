import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("pip-grid")
    .description("Arrange multiple videos in a grid layout (2x2, 2x1, 1x2, 3x3)")
    .argument("<inputs...>", "Input video files (2-9 files)")
    .option("--layout <grid>", "Grid layout: 2x1, 1x2, 2x2, 3x3 (auto-detected if omitted)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((inputs, opts) => {
      const count = inputs.length;
      if (count < 2 || count > 9) {
        console.error("Error: provide 2-9 input files.");
        process.exit(1);
      }

      // Auto-detect layout
      let layout = opts.layout;
      if (!layout) {
        if (count <= 2) layout = "2x1";
        else if (count <= 4) layout = "2x2";
        else layout = "3x3";
      }

      const m = layout.match(/^(\d+)x(\d+)$/);
      if (!m) {
        console.error("Error: --layout must be COLSxROWS (e.g. 2x2).");
        process.exit(1);
      }
      const [, cols, rows] = m.map(Number);

      // Build filter: scale all inputs, then hstack/vstack
      const parts = [];
      for (let i = 0; i < count; i++) {
        parts.push(`[${i}:v]scale=iw/${cols}:ih/${rows}[v${i}]`);
      }

      // Pad with last video if grid has more slots than inputs
      const totalSlots = cols * rows;
      for (let i = count; i < totalSlots; i++) {
        parts.push(`[${count - 1}:v]scale=iw/${cols}:ih/${rows}[v${i}]`);
      }

      // Build rows
      const rowLabels = [];
      for (let r = 0; r < rows; r++) {
        const rowInputs = [];
        for (let c = 0; c < cols; c++) {
          rowInputs.push(`[v${r * cols + c}]`);
        }
        if (cols > 1) {
          parts.push(`${rowInputs.join("")}hstack=inputs=${cols}[row${r}]`);
          rowLabels.push(`[row${r}]`);
        } else {
          rowLabels.push(rowInputs[0]);
        }
      }

      // Stack rows vertically
      if (rows > 1) {
        parts.push(`${rowLabels.join("")}vstack=inputs=${rows}`);
      }

      const filter = parts.join(";");
      const out = opts.output || outputName(inputs[0], `grid${layout}`);
      const args = [];
      for (const inp of inputs) {
        args.push("-i", inp);
      }
      args.push("-filter_complex", filter, "-c:a", "copy");

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
