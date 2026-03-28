# Discord Workspace

This project is a monorepo workspace for Discord-related tools and agents.

## Deployment

### GitHub
1.  Create a new repository on GitHub (e.g., `discord-workspace`).
2.  Add the remote:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/discord-workspace.git
    ```
3.  Push your code:
    ```bash
    git branch -M master
    git push -u origin master
    ```

### Cloudflare Pages
1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Select the `discord-workspace` repository from GitHub.
4.  Configure the build settings:
    - **Framework preset**: `None`
    - **Build command**: `pnpm run build`
    - **Build output directory**: `dist`
5.  Click **Save and Deploy**.

Cloudflare Pages will automatically deploy your project whenever you push to the `master` branch.
