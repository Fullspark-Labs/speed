# speed

A CLI tool for creating command shortcuts - like aliases but with arguments.

## Usage

```bash
# Add a shortcut
speed add ghpush 'git add . && git commit "$1" && git push'

# Run it
speed ghpush "my commit message"

# List all shortcuts
speed list

# Delete a shortcut
speed delete ghpush
```

## Installation

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