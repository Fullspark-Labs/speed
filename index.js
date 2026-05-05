#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

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

function runShortcut(name, args = []) {
  const command = getCommand(name);
  if (!command) {
    console.log(`Shortcut '${name}' not found`);
    process.exit(1);
  }

  let cmd = command;
  args.forEach((arg, i) => {
    cmd = cmd.replaceAll(`$${i + 1}`, arg);
  });

  const shell = process.platform === 'win32' ? 'cmd.exe' : process.env.SHELL || '/bin/bash';
  const shellFlag = process.platform === 'win32' ? '/c' : '-c';

  const child = spawn(shell, [shellFlag, cmd], {
    stdio: 'inherit'
  });

  child.on('exit', process.exit);
}

function showHelp() {
  console.log(`
Usage: speed <command> [options]

Commands:
  add <name> <command>  - Add a new shortcut
  delete <name>        - Delete a shortcut
  list                 - List all shortcuts
  run <name> [args]    - Run a shortcut
  -h, --help           - Show this help

Examples:
  speed add ghpush "git add . && git commit \\"$1\\" && git push"
  speed ghpush "my commit message"
`);
}

const [,, cmd, ...rest] = process.argv;

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
    if (!cmd) {
      showHelp();
    } else {
      runShortcut(cmd, rest);
    }
}