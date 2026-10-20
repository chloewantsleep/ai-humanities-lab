import fs from 'node:fs/promises';
import path from 'node:path';
import ExperimentPage from '../components/ExperimentPage.jsx';
import TicsLab from './TicsLab.jsx';
import './tics.css';
export const metadata = { title: 'Tics' };
export default async function Page() {
  const samples = await Promise.all([
    ['laughter', 'Bergson · Laughter · Chapter I', 'https://www.gutenberg.org/ebooks/4352', p => p.text.includes('In a public speaker, for instance')],
    ['frankenstein', 'Shelley · Frankenstein · Preface', 'https://www.gutenberg.org/ebooks/41445', p => p.text.startsWith('I have thus endeavoured')],
  ].map(async ([id, label, source, choose]) => {
    const data = JSON.parse(await fs.readFile(path.join(process.cwd(), 'public/retrieval', `${id}.json`), 'utf8'));
    return { id, label, source, text: data.passages.find(choose).text };
  }));
  return <ExperimentPage name="tics"><TicsLab samples={samples}/></ExperimentPage>;
}
