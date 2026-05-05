# speed

<p align="center">
  <a href="https://www.npmjs.com/package/speed-cli">
    <img src="https://img.shields.io/npm/v/speed-cli.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/speed-cli">
    <img src="https://img.shields.io/npm/dm/speed-cli.svg" alt="npm downloads">
  </a>
  <a href="https://github.com/Fullspark-Labs/speed/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/speed-cli.svg" alt="license">
  </a>
  <a href="https://github.com/Fullspark-Labs/speed/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/Fullspark-Labs/speed/main.svg" alt="build">
  </a>
</p>

A CLI tool for creating reusable command shortcuts with arguments. Define once, use anywhere.

## Why speed?

- Define complex commands once
- Use simple shortcuts instead of remembering long commands
- Pass arguments to your shortcuts just like functions
- Works cross-platform: Windows, macOS, and Linux

## Installation

```bash
npm install -g speed-cli
```

Or clone and link:

```bash
git clone https://github.com/Fullspark-Labs/speed.git
cd speed
npm link
```

## Usage

```bash
# Add a shortcut (use -- to separate name from command)
speed add ghpush -- git add . && git commit "$1" && git push

# Run it
speed ghpush "my commit message"

# List all shortcuts
speed list

# Delete a shortcut
speed delete ghpush
```

### Available Placeholders

- `$1`, `$2`, `$3`, ... - Positional arguments passed to the shortcut

## Examples

### Git Shortcuts

```bash
speed add gc -- git commit -m "$1"
speed add gp -- git push
speed add co -- git checkout $1
speed add st -- git status -s
speed add lg -- git log --oneline -10

# Usage
speed gc "fix: resolve auth bug"
speed co main
speed st
```

### Docker Shortcuts

```bash
speed add dstop -- docker stop $(docker ps -q)
speed add drm -- docker rm $(docker ps -aq)
speed add dex -- docker exec -it $1 /bin/bash
speed add dlog -- docker logs -f $1

# Usage
speed dstop
speed dex mycontainer
```

### Network Tools

```bash
speed add ping -- ping -c 5 $1
speed add ports -- lsof -i :$1
speed add curlj -- curl -s $1 | jq

# Usage
speed ping google.com
speed ports 3000
speed curlj https://api.example.com/data
```

### npm/yarn Shortcuts

```bash
speed add ns -- npm start
speed add nd -- npm run dev
speed add nt -- npm test
speed add ys -- yarn start
speed add yd -- yarn dev

# Usage
speed nd
speed yd
```

## Commands

| Command | Description |
|---------|-------------|
| `speed add <name> -- <command>` | Add a new shortcut |
| `speed delete <name>` | Delete a shortcut |
| `speed list` | List all shortcuts |
| `speed run <name> [args]` | Run a shortcut |
| `speed -h, --help` | Show help |

## License

MIT