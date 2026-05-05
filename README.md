# speed

A CLI tool for creating command shortcuts - like aliases but with arguments.

Works on **Windows**, **macOS**, and **Linux**.

## Usage

```bash
# Add a shortcut
speed add ghpush "git add . && git commit \"$1\" && git push"

# Run it
speed ghpush "my commit message"

# List all shortcuts
speed list

# Delete a shortcut
speed delete ghpush
```

## Installation

### npm (cross-platform - recommended)
```bash
npm install -g speed-cli
```

### Manual
```bash
git clone git@github.com:Fullspark-Labs/speed.git
cd speed
npm link
```

### Linux/macOS (bash)
```bash
git clone git@github.com:Fullspark-Labs/speed.git
cd speed
ln -sf $(pwd)/speed ~/bin/speed
```

Add to your `.zshrc`:
```bash
export PATH="$HOME/bin:$PATH"
```

## Available Placeholders

- `$1`, `$2`, ... - Positional arguments passed to the shortcut

## Examples

### Git shortcuts
```bash
speed add gc 'git commit -m "$1"'
speed add gp 'git push'
speed add gpull 'git pull origin $1'
speed add co 'git checkout $1'
speed add st 'git status -s'
speed add lg 'git log --oneline -10'

# Usage
speed gc "fix bug"
speed gp
speed co main
```

### Docker shortcuts
```bash
speed add dstop 'docker stop $(docker ps -q)'
speed add drm 'docker rm $(docker ps -aq)'
speed add dex 'docker exec -it $1 /bin/bash'
speed add dlog 'docker logs -f $1'

# Usage
speed dstop
speed dex mycontainer
```

### File operations
```bash
speed add findr 'find . -name "*$1*"'
speed add ports 'lsof -i :$1'

# Usage
speed findr "*.js"
speed ports 3000
```

### Network
```bash
speed add ping 'ping -c 5 $1'
speed add curlj 'curl -s $1 | jq'

# Usage
speed ping google.com
curlj https://api.example.com/data
```

### npm/yarn shortcuts
```bash
speed add ns 'npm start'
speed add nd 'npm run dev'
speed add nt 'npm test'
speed add nli 'npm ls --depth=0'
speed add ys 'yarn start'
speed add yd 'yarn dev'

# Usage
speed nd
speed yd
```