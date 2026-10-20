"""Export the saved merged model and package it for Transformers.js."""
import argparse
import json
from pathlib import Path
import shutil
from time import perf_counter

from optimum.exporters.onnx import main_export

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--reuse-export", type=Path, help="Package an existing optimum-cli export instead of exporting again")
parser.add_argument("--quantize", action="store_true", help="Also produce model_quantized.onnx for dtype=q8")
args = parser.parse_args()
root = Path(__file__).resolve().parent
destination = root / "outputs" / "browser-model"
started = perf_counter()
if args.reuse_export:
    shutil.copytree(args.reuse_export, destination, dirs_exist_ok=True)
else:
    main_export(
        str(root / "outputs" / "merged"), output=destination,
        task="text-generation-with-past", opset=18, dtype="fp32", device="cpu",
        do_validation=True,
    )
(destination / "onnx").mkdir(exist_ok=True)
for source in destination.glob("*.onnx*"):
    shutil.move(str(source), str(destination / "onnx" / source.name))

# Python saves a separate Jinja file; Transformers.js 4.3.1 reads the JSON field.
tokenizer_config_path = destination / "tokenizer_config.json"
tokenizer_config = json.loads(tokenizer_config_path.read_text())
tokenizer_config["chat_template"] = (destination / "chat_template.jinja").read_text()
tokenizer_config_path.write_text(json.dumps(tokenizer_config, indent=2) + "\n")

if args.quantize:
    from onnxruntime.quantization import QuantType, quantize_dynamic

    quantize_dynamic(
        str(destination / "onnx" / "model.onnx"),
        str(destination / "onnx" / "model_quantized.onnx"),
        weight_type=QuantType.QUInt8, op_types_to_quantize=["MatMul"],
    )
report = {
    "elapsed_seconds": perf_counter() - started,
    "reused_export": bool(args.reuse_export),
    "files": {str(p.relative_to(destination)): p.stat().st_size for p in destination.rglob("*") if p.is_file()},
}
(root / "outputs" / "export-metrics.json").write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
