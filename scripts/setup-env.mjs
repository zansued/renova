#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const envTargets = [
  {
    label: 'API',
    exampleRel: 'apps/api/.env.example',
    destRel: 'apps/api/.env',
    transform(content) {
      const password = crypto.randomBytes(24).toString('base64url');
      const hasPasswordLine = /^REDIS_PASSWORD=.*$/m.test(content);
      const normalized = hasPasswordLine
        ? content.replace(/^REDIS_PASSWORD=.*$/m, `REDIS_PASSWORD=${password}`)
        : `${content.trimEnd()}\nREDIS_PASSWORD=${password}\n`;
      return {
        content: normalized,
        notes: [`REDIS_PASSWORD gerado automaticamente: ${password}`]
      };
    }
  },
  {
    label: 'Web',
    exampleRel: 'apps/web/.env.example',
    destRel: 'apps/web/.env'
  }
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function ensureEnv({ label, exampleRel, destRel, transform }) {
  const examplePath = path.join(projectRoot, exampleRel);
  const destPath = path.join(projectRoot, destRel);

  const templateExists = await fileExists(examplePath);
  if (!templateExists) {
    throw new Error(`Arquivo de exemplo não encontrado: ${exampleRel}`);
  }

  if (await fileExists(destPath)) {
    console.log(`⚠️  ${label}: ${destRel} já existe — mantendo o arquivo atual.`);
    return;
  }

  const template = await fs.readFile(examplePath, 'utf8');
  const { content, notes = [] } = transform ? transform(template) : { content: template };

  await fs.writeFile(destPath, content, 'utf8');
  console.log(`✅  ${label}: ${destRel} criado a partir de ${exampleRel}.`);
  for (const note of notes) {
    console.log(`   • ${note}`);
  }
}

async function main() {
  for (const target of envTargets) {
    await ensureEnv(target);
  }

  console.log('\nSetup concluído! Ajuste os arquivos conforme necessário.');
}

main().catch((error) => {
  console.error('Erro ao configurar os arquivos .env:', error.message);
  process.exit(1);
});
