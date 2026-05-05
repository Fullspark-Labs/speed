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
</p>

A CLI tool for creating reusable command shortcuts with arguments. Define once, use anywhere.

## Why speed?

- Define complex commands once
- Use simple shortcuts instead of remembering long commands
- Pass arguments to your shortcuts just like functions
- Works cross-platform: Windows, macOS, and Linux

## Installation

```bash
npm install -g @fullsparklabs/speed-cli
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

### SSH Shortcuts

```bash
speed add ssh -- ssh -i ~/.ssh/$1 user@host
speed add sftp -- sftp -i ~/.ssh/$1 user@host

# Usage
speed ssh production
speed sftp staging
```

### SCP / Rsync Shortcuts

```bash
speed add scp-up -- scp -i ~/.ssh/$1 file.txt user@host:/path
speed add scp-down -- scp -i ~/.ssh/$1 user@host:/path/file.txt .
speed add rsync-up -- rsync -avz -e "ssh -i ~/.ssh/$1" ./ user@host:/path
speed add tunnel -- ssh -L $1:localhost:$2 -N -f user@host

# Usage
speed scp-up production
speed rsync-up staging
speed tunnel 8080:3000 production
```

### AWS CLI Shortcuts

```bash
speed add ec2-ls -- aws ec2 describe-instances --query "Reservations[].Instances[].{Name:Tags[?Key=='Name']|[0].Value,IP:PrivateIpAddress,State:State.Name}" --output table
speed add ec2-ssh -- ssh -i ~/.ssh/key.pem ubuntu@$1
speed add s3-ls -- aws s3 ls s3://$1
speed add s3-up -- aws s3 cp $1 s3://$2 --recursive

# Usage
speed ec2-ls
speed ec2-ssh i-1234567890abcdef0
speed s3-up ./local-folder my-bucket
```

### kubectl Shortcuts

```bash
speed add kpod -- kubectl get pods -o wide
speed add klogs -- kubectl logs -f $1
speed add kexec -- kubectl exec -it $1 -- /bin/bash
speed add kport -- kubectl port-forward svc/$1 $2:$3
speed add krestart -- kubectl rollout restart deployment/$1

# Usage
speed kpod
speed klogs myapp
speed kexec myapp-pod-abc123
speed kport myapp 8080:80
```

### tmux / screen Shortcuts

```bash
speed add tm -- tmux new -A -s $1
speed add ta -- tmux attach -t $1
speed add tl -- tmux list-sessions

# Usage
speed tm myproject
speed ta myproject
```

### GitHub CLI Shortcuts

```bash
speed add pr -- gh pr $1
speed add pr-create -- gh pr create --title "$1" --body "$2"
speed add pr-list -- gh pr list
speed add issue -- gh issue $1

# Usage
speed pr-create "Fix bug" "Description here"
speed pr-list
```

### Docker Compose Shortcuts

```bash
speed add dcup -- docker-compose up -d
speed add dcdown -- docker-compose down
speed add dclogs -- docker-compose logs -f
speed add dcrestart -- docker-compose restart $1
speed add dcps -- docker-compose ps

# Usage
speed dcup
speed dclogs
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