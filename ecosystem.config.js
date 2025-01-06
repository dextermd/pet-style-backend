module.exports = {
  apps: [
    {
      name: 'pet-style-backend',
      script: 'dist/src/main.js',
      instances: 1,
      interpreter: 'node@20.18.1',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
