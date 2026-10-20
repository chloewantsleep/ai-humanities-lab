"""Execute the delivered notebook in this venv; write only ignored outputs."""
import os
from pathlib import Path
from time import perf_counter

import nbformat
from nbclient import NotebookClient

root = Path(__file__).resolve().parent
os.chdir(root)
os.environ["NOTEBOOK_SKIP_INSTALL"] = "1"  # requirements.txt is installed in this venv
os.environ.setdefault("HF_HOME", str(root / ".cache" / "huggingface"))
(root / "outputs").mkdir(exist_ok=True)
notebook = nbformat.read(root / "fine-tune.ipynb", as_version=4)
started = perf_counter()


def show_progress(cell, cell_index, **_kwargs):
    if cell.cell_type == "code":
        print(f"Completed cell {cell_index + 1}", flush=True)


try:
    NotebookClient(
        notebook, timeout=1800, kernel_name="python3",
        resources={"metadata": {"path": str(root)}},
        on_cell_executed=show_progress,
    ).execute()
finally:
    nbformat.write(notebook, root / "outputs" / "executed.ipynb")
    for cell in notebook.cells:
        for output in cell.get("outputs", []):
            if output.output_type == "stream":
                print(output.text[-3000:], end="")
            elif output.output_type == "error":
                print(output.ename, output.evalue)
    print(f"\nNotebook wall time: {perf_counter() - started:.1f}s")
