# Git Issues and Solutions

This document provides solutions to common Git issues encountered during development.

## Issue 1: Creating a New Branch from Origin When You Have Uncommitted Changes

### Problem

You have uncommitted changes on your current branch but need to create a new branch from `origin/development` (or any other remote branch).

### Error Scenario

```bash
# You're on branch 03-user-crud with uncommitted changes
git status
# Shows modified files that aren't committed yet

# Trying to checkout a new branch fails or brings unwanted changes
```

### Solution: Use Git Stash

#### Step 1: Stash Your Current Changes

```bash
git stash push -m "WIP: Description of your work"
```

This saves your uncommitted changes temporarily.

#### Step 2: Fetch Latest Changes from Remote

```bash
git fetch origin
```

This ensures you have the latest remote branch information.

#### Step 3: Create New Branch from Remote Branch

```bash
git checkout -b 04-testing origin/development
```

This creates and switches to a new branch based on the remote branch.

#### Step 4: Push New Branch to Origin

```bash
git push -u origin 04-testing
```

This pushes the new branch and sets up tracking.

#### Step 5: Managing Your Stashed Changes (Optional)

```bash
# View stashed changes
git stash list

# View what's in a specific stash
git stash show -p stash@{0}

# Apply stash to current branch (keeps stash)
git stash apply stash@{0}

# Apply stash and remove it from stash list
git stash pop stash@{0}

# Go back to original branch and restore changes
git checkout 03-user-crud
git stash pop  # Applies the most recent stash
```

### Example Output

```bash
$ git stash push -m "WIP: Testing setup and CRUD implementation"
Saved working directory and index state On 03-user-crud: WIP: Testing setup and CRUD implementation

$ git checkout -b 04-testing origin/development
branch '04-testing' set up to track 'origin/development'.
Switched to a new branch '04-testing'

$ git push -u origin 04-testing
* [new branch]      04-testing -> 04-testing
branch '04-testing' set up to track 'origin/04-testing'.
```

---

## Issue 2: Windows Environment Variable Issues with npm Scripts

### Problem

npm scripts using Unix-style environment variables don't work on Windows PowerShell.

### Error

```bash
> NODE_OPTIONS=--experimental-vm-modules jest
'NODE_OPTIONS' is not recognized as an internal or external command
```

### Solution: Use cross-env

```bash
# Install cross-env
npm install --save-dev cross-env

# Update package.json script
"test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest"
```

---

## Issue 3: Branch Management Best Practices

### Common Branch Operations

#### List All Branches (Local and Remote)

```bash
git branch -a
```

#### Check Branch Tracking Information

```bash
git branch -vv
```

#### Delete a Branch

```bash
# Delete local branch (safe - only if merged)
git branch -d branch-name

# Force delete local branch
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name
```

#### Sync with Remote

```bash
# Fetch all remote changes
git fetch origin

# Pull changes from tracked branch
git pull

# Rebase current branch on remote
git pull --rebase origin branch-name
```

---

## Issue 4: Merge Conflicts Resolution

### When Conflicts Occur

```bash
# After a merge conflict
git status  # Shows conflicted files

# Edit conflicted files manually, then:
git add .
git commit -m "Resolve merge conflicts"
```

### Abort a Merge

```bash
git merge --abort
```

---

## Issue 5: Undoing Changes

### Unstage Files

```bash
git reset HEAD file-name
```

### Discard Unstaged Changes

```bash
# Single file
git checkout -- file-name

# All unstaged changes
git checkout .
```

### Reset to Previous Commit

```bash
# Soft reset (keeps changes staged)
git reset --soft HEAD~1

# Mixed reset (keeps changes unstaged)
git reset HEAD~1

# Hard reset (discards all changes)
git reset --hard HEAD~1
```

---

## Issue 6: Working with Remotes

### Add Remote

```bash
git remote add origin https://github.com/username/repo.git
```

### Change Remote URL

```bash
git remote set-url origin https://github.com/username/new-repo.git
```

### View Remotes

```bash
git remote -v
```

---

## Issue 7: Git Stash Management

### Useful Stash Commands

```bash
# Stash with message
git stash push -m "Work in progress"

# Stash specific files
git stash push -m "Message" file1.js file2.js

# List all stashes
git stash list

# Show stash contents
git stash show -p stash@{0}

# Apply specific stash
git stash apply stash@{1}

# Drop a stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

---

## Issue 8: Line Ending Issues on Windows

### Problem

Git warnings about CRLF/LF line endings on Windows.

### Solution

Configure Git to handle line endings automatically:

```bash
# For the current repository
git config core.autocrlf true

# Globally
git config --global core.autocrlf true
```

---

## Quick Reference Commands

### Status and History

```bash
git status                 # Current status
git log --oneline         # Commit history
git log --graph --oneline # Visual commit history
```

### Branch Operations

```bash
git branch                     # List local branches
git branch -r                  # List remote branches
git branch -a                  # List all branches
git checkout branch-name       # Switch branch
git checkout -b new-branch     # Create and switch
```

### Remote Operations

```bash
git fetch origin          # Fetch remote changes
git pull                  # Fetch and merge
git push                  # Push to remote
git push -u origin branch # Push and set upstream
```

---

## Troubleshooting Tips

1. **Always check `git status` first** to understand your current state
2. **Use `git log --oneline` to see recent commits** before making changes
3. **Fetch before creating new branches** to ensure you have latest remote info
4. **Use descriptive stash messages** to remember what you stashed
5. **Test commands with `--dry-run` when available** to see what would happen

---

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
