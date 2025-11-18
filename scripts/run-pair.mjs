import { spawn } from 'node:child_process';
import readline from 'node:readline';

const MODES = {
  dev: [
    { name: 'api', command: ['npm', ['run', 'dev', '--workspace', 'apps/api']] },
    { name: 'web', command: ['npm', ['run', 'dev', '--workspace', 'apps/web']] }
  ],
  start: [
    { name: 'api', command: ['npm', ['run', 'start', '--workspace', 'apps/api']] },
    { name: 'web', command: ['npm', ['run', 'preview', '--workspace', 'apps/web']] }
  ]
};

const mode = process.argv[2] ?? 'dev';

if (!MODES[mode]) {
  console.error(`Modo \"${mode}\" inválido. Use um dos seguintes: ${Object.keys(MODES).join(', ')}`);
  process.exit(1);
}

const COLOR_RESET = '\u001B[0m';
const COLORS = {
  api: '\u001B[36m',
  web: '\u001B[35m'
};

const children = [];
let hasErrored = false;

function attachOutput(stream, name, color) {
  const rl = readline.createInterface({ input: stream });
  rl.on('line', (line) => {
    const prefix = `${color}[${name}]${COLOR_RESET}`;
    console.log(`${prefix} ${line}`);
  });
}

function spawnService({ name, command }) {
  const [cmd, args] = command;
  const child = spawn(cmd, args, { stdio: ['inherit', 'pipe', 'pipe'], env: process.env });
  children.push(child);
  attachOutput(child.stdout, name, COLORS[name] ?? '');
  attachOutput(child.stderr, name, COLORS[name] ?? '');
  child.on('exit', (code, signal) => {
    if (signal === 'SIGINT') {
      return;
    }
    if (code !== 0) {
      hasErrored = true;
      console.error(`Processo ${name} finalizado com código ${code}`);
      shutdown();
    }
  });
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }
}

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

MODES[mode].forEach(spawnService);

process.on('exit', () => {
  if (hasErrored) {
    process.exitCode = 1;
  }
});
