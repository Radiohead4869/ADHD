import fs from 'fs';
import path from 'path';

const directoryPath = path.join(process.cwd(), 'src');

function replaceColorsInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/#00FF00/g, 'var(--primary)');
  content = content.replace(/#00cc00/g, 'var(--primary-hover)');
  content = content.replace(/#0a0a0a/g, 'var(--bg-main)');
  content = content.replace(/#050505/g, 'var(--bg-dark)');
  content = content.replace(/#111111/g, 'var(--panel)');
  content = content.replace(/#111/g, 'var(--panel)');
  content = content.replace(/#1a1a1a/g, 'var(--panel-hover)');
  content = content.replace(/#222/g, 'var(--border-light)');
  content = content.replace(/#333/g, 'var(--border)');

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory: string) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      replaceColorsInFile(fullPath);
    }
  });
}

processDirectory(directoryPath);
console.log('Colors replaced successfully!');
