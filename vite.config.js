import { defineConfig } from "vite";
import childProcess from "child_process";

const getGitCommitHash = () =>
  childProcess.execSync("git rev-parse --short HEAD").toString().trim();

export default defineConfig({
  define: {
    __GIT_COMMIT_HASH__: JSON.stringify(getGitCommitHash()),
  },
  build: {
    sourcemap: true,
  },
});
