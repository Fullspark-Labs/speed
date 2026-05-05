# Reddit Post - r/commandline / r/bash / r/linux

---

**I built a CLI tool for creating command shortcuts - like aliases but with arguments**

It's called **speed** and it works on Windows, macOS, and Linux.

## The Problem

Aliases don't accept arguments:
```bash
alias ghpush='git add . && git commit "$1" && git push'  # Doesn't work!
```

## The Solution

```bash
# Add a shortcut
speed add ghpush -- git add . && git commit "$1" && git push

# Run it
speed ghpush "my commit message"
```

## Features

- ✅ Works on Windows, macOS, Linux
- ✅ Pass arguments with `$1`, `$2`, etc.
- ✅ Auto-fixes common `git commit "msg"` typo to `git commit -m "msg"`
- ✅ Simple `--` syntax, no escaping quotes

## More Examples

```bash
# Git
speed add gc -- git commit -m "$1"
speed add co -- git checkout $1

# Docker
speed add dex -- docker exec -it $1 /bin/bash

# Network
speed add ping -- ping -c 5 $1
speed add ports -- lsof -i :$1
```

## Install

```bash
npm install -g @FullsparkLabs/speed-cli
```

Or clone and `npm link`.

**Repo**: https://github.com/Fullspark-Labs/speed

---

*Any feedback? Would love to hear what shortcuts you all use!*