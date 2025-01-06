module.exports = {
  apps: [
    {
      name: 'pet-style-backend',
      script: 'dist/src/main.js',
      instances: 1,
      interpreter: '/root/.nvm/versions/node/v20.18.1/bin/node',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
