# GitHub Activity Fetcher

This script fetches activity data for a specified GitHub repository and outputs it in a simplified JSON format.

## Features

- Fetches various types of activity data including commits, pull requests, issues, releases, milestones, and contributors.
- Outputs the fetched data in a simplified and flattened JSON format for easy consumption.

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```

2. Navigate to the project directory:

    ```bash
    cd your-repo-name
    ```

3. Install the required packages:

    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the root directory and add your GitHub Personal Access Token (optional to increase rate limits):

```env
GITHUB_TOKEN=your_personal_access_token_here
```

**Note:** Change the `REPO_NAME`, `OWNER_NAME`, and `DAYS` parameters in the script as you like.

## Usage

Run the script:

```bash
node changeup.js
```

The script will generate a JSON file containing the fetched and simplified activity data into a `outputs/` folder.

## .gitignore

- `node_modules/`: Standard Node.js practice to ignore the `node_modules` directory.
- `outputs/`: To ignore generated JSON files.

## License

MIT
