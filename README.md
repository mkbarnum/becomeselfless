# Become Selfless Website

On a terminal (perhaps in VSCode), change to the directory you want to store this github repo in and then run the below command.

`gh repo clone mkbarnum/becomeselfless`

If you don't have github setup on your computer, visit https://docs.github.com/en/enterprise-cloud@latest/github-cli/github-cli/quickstart.

You should then be able to open the becomeselfless folder in VS Code and make changes to the code.

To test your changes, just open a browser and open the index.html file (i.e. file:///Users/matbarnu/Personal/becomeselfless/index.html).

Once changes are ready, push them to GitHub and then upload to the AWS S3 buckets that host the website.

## Deploying to S3

The website is hosted on three S3 buckets in AWS account `947645751634` (us-east-1):
- `becomeselfless.com`
- `becomeselfless.net`
- `becomeselfless.org`

### Prerequisites

1. Install the AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
2. Configure credentials for account `947645751634`:
   ```bash
   aws configure --profile selfless
   ```
   Enter your Access Key ID, Secret Access Key, and set the region to `us-east-1`.

### Upload to S3

From the project root directory, run:

```bash
# Sync to all three buckets
aws s3 sync . s3://becomeselfless.com --exclude ".git/*" --exclude ".vscode/*" --profile selfless
aws s3 sync . s3://becomeselfless.net --exclude ".git/*" --exclude ".vscode/*" --profile selfless
aws s3 sync . s3://becomeselfless.org --exclude ".git/*" --exclude ".vscode/*" --profile selfless
```

Or to preview what would be uploaded without actually uploading:

```bash
aws s3 sync . s3://becomeselfless.com --exclude ".git/*" --exclude ".vscode/*" --profile selfless --dryrun
```

### Quick Deploy Script

You can also create a deploy script. Save this as `deploy.sh`:

```bash
#!/bin/bash
PROFILE="selfless"
BUCKETS=("becomeselfless.com" "becomeselfless.net" "becomeselfless.org")

for bucket in "${BUCKETS[@]}"; do
    echo "Syncing to $bucket..."
    aws s3 sync . "s3://$bucket" --exclude ".git/*" --exclude ".vscode/*" --profile "$PROFILE"
done

echo "Deployment complete!"
```

Then run: `chmod +x deploy.sh && ./deploy.sh`

## Automatic Deployment (CI/CD)

This repo has GitHub Actions configured to automatically deploy to S3 on every push to `main` or `master`.

### Setup (one-time)

1. Go to https://github.com/mkbarnum/becomeselfless/settings/secrets/actions
2. Add two repository secrets:
   - `AWS_ACCESS_KEY_ID` - Your AWS access key
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret key

Once configured, just push your changes and they'll automatically deploy to all three S3 buckets.