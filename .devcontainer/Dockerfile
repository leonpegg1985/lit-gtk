# Use the official Microsoft Dev Container image for TypeScript/Node.js
FROM mcr.microsoft.com/devcontainers/typescript-node:22-bookworm

# [Optional] Install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# Install global node packages
RUN su node -c "npm install -g typescript tsx vite"
