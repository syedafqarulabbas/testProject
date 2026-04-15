module.exports = {
  apps: [{
    name: 'kfia-app',
    cwd: 'C:\\dmmairportswebapps\\KFIA',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 8080',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8080,
      NODE_TLS_REJECT_UNAUTHORIZED: '0'
    }
  }]
};