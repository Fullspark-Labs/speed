#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { Table, InteractiveTable } = require('cmd-table');
const prompts = require('prompts');

const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'speed');
const CONFIG_FILE = path.join(CONFIG_DIR, 'shortcuts.txt');

if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

function getCommand(name) {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  const content = fs.readFileSync(CONFIG_FILE, 'utf8');
  const lines = content.split('\n').filter(l => l.startsWith(name + '|'));
  if (lines.length === 0) return null;
  return lines[0].split('|').slice(1).join('|');
}

function parseArgs(args) {
  const idx = args.indexOf('--');
  if (idx === -1) return { name: args[0], command: '' };
  const command = args.slice(idx + 1).join(' ');
  return { name: args[0], command };
}

function addShortcut(name, command) {
  if (!name || !command) {
    console.log('Usage: speed add <name> -- <command>');
    console.log('  Example: speed add ghpush -- git add . && git commit "$1" && git push');
    process.exit(1);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    console.log('Invalid name. Use only letters, numbers, underscores, and hyphens.');
    process.exit(1);
  }

  if (getCommand(name)) {
    console.log(`Shortcut '${name}' already exists. Delete it first with: speed delete ${name}`);
    process.exit(1);
  }

  fs.appendFileSync(CONFIG_FILE, `${name}|${command}\n`);
  console.log(`Added shortcut: ${name}`);
}

function deleteShortcut(name) {
  if (!name) {
    console.log('Usage: speed delete <name>');
    process.exit(1);
  }

  if (!getCommand(name)) {
    console.log(`Shortcut '${name}' not found`);
    process.exit(1);
  }

  const content = fs.readFileSync(CONFIG_FILE, 'utf8');
  const lines = content.split('\n').filter(l => !l.startsWith(name + '|'));
  fs.writeFileSync(CONFIG_FILE, lines.join('\n') + '\n');
  console.log(`Deleted shortcut: ${name}`);
}

function listShortcuts() {
  if (!fs.existsSync(CONFIG_FILE) || fs.statSync(CONFIG_FILE).size === 0) {
    console.log('No shortcuts defined. Add one with: speed add <name> <command>');
    return;
  }

  console.log('Shortcuts:');
  const content = fs.readFileSync(CONFIG_FILE, 'utf8');
  content.split('\n').filter(l => l.includes('|')).forEach(line => {
    const [name, ...cmdParts] = line.split('|');
    console.log(`  ${name}: ${cmdParts.join('|')}`);
  });
}

function runShortcut(name, runArgs = []) {
  const command = getCommand(name);
  if (!command) {
    console.log(`Shortcut '${name}' not found`);
    process.exit(1);
  }

  let cmd = command;
  runArgs.forEach((arg, i) => {
    cmd = cmd.replaceAll(`$${i + 1}`, arg);
  });

  if (cmd.includes('git commit ') && !cmd.includes('-m ') && runArgs.length > 0) {
    cmd = cmd.replace(/git commit "([^"]*)"/, 'git commit -m "$1"');
  }

  const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
  const shellArgs = process.platform === 'win32' ? ['/c', cmd] : ['-c', cmd];

  const child = spawn(shell, shellArgs, {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  child.on('exit', process.exit);
}

function showHelp() {
  console.log(`
Usage: speed <command> [options]

Commands:
  add <name> -- <command>  - Add a new shortcut
  delete <name>          - Delete a shortcut
  list                   - List all shortcuts
  run <name> [args]     - Run a shortcut
  -h, --help            - Show this help

Examples:
  speed add ghpush -- git add . && git commit "$1" && git push
  speed ghpush "my commit message"
`);
}

const [,, cmd, ...rest] = process.argv;

async function showInteractiveMenu() {
  const shortcuts = listShortcutsArray();
  
  console.log('\n📋 speed - Your Shortcuts\n');
  
  const table = new Table();
  table.addColumn({ name: '#', width: 4 });
  table.addColumn({ name: 'Command', width: 20 });
  table.addColumn({ name: 'Action', width: 45 });
  
  shortcuts.forEach((s, i) => {
    table.addRow({ '#': String(i + 1), Command: s.name, Action: s.command });
  });
  
  if (shortcuts.length === 0) {
    console.log('  No shortcuts yet. Run: speed add <name> -- <command>\n');
  } else {
    console.log(table.render());
  }
  
  const { choice } = await prompts({
    type: 'text',
    name: 'choice',
    message: '\n⚡ Select shortcut (number/name) or [a]dd, [l]ist, [q]uit:',
    initial: ''
  });

  const num = parseInt(choice);
  
  if (!choice || choice.toLowerCase() === 'q' || choice.toLowerCase() === 'quit') {
    console.log('👋 Bye!');
    process.exit(0);
  } else if (choice.toLowerCase() === 'a' || choice.toLowerCase() === 'add') {
    const { name, command } = await prompts([
      { type: 'text', name: 'name', message: 'Shortcut name:' },
      { type: 'text', name: 'command', message: 'Command:', initial: 'echo ' }
    ]);
    if (name && command) addShortcut(name, command);
    showInteractiveMenu();
  } else if (choice.toLowerCase() === 'l' || choice.toLowerCase() === 'list') {
    console.log('\n📋 Your Shortcuts:\n');
    shortcuts.forEach(s => console.log(`  ${s.name}: ${s.command}`));
    console.log('');
    await prompts({ type: 'confirm', message: 'Press enter to continue', name: 'done' });
    showInteractiveMenu();
  } else if (!isNaN(num) && num >= 1 && num <= shortcuts.length) {
    const s = shortcuts[num - 1];
    const { args } = await prompts({
      type: 'text',
      name: 'args',
      message: `Args for ${s.name}:`,
      initial: ''
    });
    runShortcut(s.name, args ? args.split(' ').filter(a => a) : []);
  } else {
    const matched = shortcuts.find(s => s.name === choice);
    if (matched) {
      const { args } = await prompts({
        type: 'text',
        name: 'args',
        message: `Args for ${matched.name}:`,
        initial: ''
      });
      runShortcut(matched.name, args ? args.split(' ').filter(a => a) : []);
} else {
      showInteractiveMenu();
    }
  }
}

function listShortcutsArray() {
  if (!fs.existsSync(CONFIG_FILE) || fs.statSync(CONFIG_FILE).size === 0) return [];
  const content = fs.readFileSync(CONFIG_FILE, 'utf8');
  return content.split('\n').filter(l => l.includes('|')).map(line => {
    const [name, ...cmdParts] = line.split('|');
    return { name, command: cmdParts.join('|') };
  });
}

switch (cmd) {
  case 'add': {
    const { name, command } = parseArgs(rest);
    addShortcut(name, command);
    break;
  }
  case 'delete':
    deleteShortcut(rest[0]);
    break;
  case 'list':
    listShortcuts();
    break;
  case 'run':
    runShortcut(rest[0], rest.slice(1));
    break;
  case '-h':
  case '--help':
  case 'help':
    showHelp();
    break;
  default:
    if (!cmd || cmd === 'i') {
      showInteractiveMenu();
    } else {
      runShortcut(cmd, rest);
    }
}