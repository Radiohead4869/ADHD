import fs from 'fs';
import path from 'path';

const directoryPath = path.join(process.cwd(), 'src');

function replaceColorsInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/#e5e5e5/g, 'var(--text-main)');
  content = content.replace(/#ccc/g, 'var(--text-muted)');
  content = content.replace(/#888/g, 'var(--text-dim)');
  content = content.replace(/#666/g, 'var(--text-dark)');
  content = content.replace(/#444/g, 'var(--border)'); 
  content = content.replace(/text-black/g, 'text-[var(--bg-main)]');

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory: string) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceColorsInFile(fullPath);
    }
  });
}

processDirectory(directoryPath);
