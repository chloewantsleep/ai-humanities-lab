import ExperimentPage from "../components/ExperimentPage.jsx";
import "./fine-tune.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fine-tuning" };

export default function Page() {
  return (
    <ExperimentPage name="fine-tune">
      <div className="fine-tune-guide">
        <div className="fine-tune-intro">
          <p className="eyebrow">A voice made of examples</p>
          <h2>Write the dialogue.<br />Train the habit.</h2>
          <p>Give a tiny base model fifty examples of how your assistant talks. Train a LoRA adapter, then ask the base and trained models the same new questions.</p>
          <div className="fine-tune-actions">
            <a className="fine-tune-primary" href="/fine-tune/files/fine-tune.ipynb" download>Download the notebook ↓</a>
            <a href="https://colab.research.google.com/" target="_blank" rel="noreferrer">Open Google Colab ↗</a>
          </div>
        </div>

        <ol className="fine-tune-steps">
          <li><h3>Write a voice</h3><p>Download the <a href="/fine-tune/files/template.json" download>dialogue template</a> and fill in about fifty short user/assistant pairs. Or start with our <a href="/fine-tune/files/sample.json" download>50 pocket workshop dialogues</a>: a helper that says “Pocket note:” and offers one small move. The examples are invented for this exercise.</p></li>
          <li><h3>Choose a GPU runtime</h3><p>In Colab, choose <strong>File → Upload notebook</strong> and select the downloaded notebook. Then choose <strong>Runtime → Change runtime type → GPU</strong>. Run the cells in order; the data cell asks you to upload your dialogue JSON file. No model API key is needed.</p></li>
          <li><h3>Train, then compare</h3><p>The notebook uses SmolLM2-135M <strong>base</strong>, saves its replies, and trains an adapter for 80 steps. Its comparison table puts base and trained continuations beside each other. Five prompts are new; one is a labeled training example. Look for a learned voice, copied phrases, and failed answers.</p></li>
          <li><h3>Change the examples</h3><p>Rewrite ten replies. Predict what will change, then restart the runtime and run from the base model again. Save the adapter and comparison files before Colab ends. A familiar phrase is evidence of a learned habit; it does not establish a reliable assistant.</p></li>
        </ol>

        <aside className="fine-tune-detail">
          <h3>Run locally or take it into the browser</h3>
          <p>The <a href="/fine-tune/files/README.md" download>README</a> includes Mac setup, measured training time, and the ONNX export verdict. Training runs in Python; the browser engine is for inference after export.</p>
          <p><strong>Measured on an M3 Mac:</strong> 80 training steps in 19.8–24.3 seconds. The first notebook run took 145 seconds including the model download. ONNX exports ran in Chrome; float32 preserves the tested reply, while q8 changes the wording.</p>
          <p>Colab timing is an estimate until tested there. Its free GPU allocation varies. Installation, downloads, and export add time beyond the training loop.</p>
          <p><a href="/gpt-2">Compare with the GPT-2 experiment →</a></p>
        </aside>
      </div>
    </ExperimentPage>
  );
}
