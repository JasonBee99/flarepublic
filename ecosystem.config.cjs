// ecosystem.config.cjs
// PM2 process manager config for FlaRepublic production deployment.
//
// Usage on the VPS:
//   pm2 start ecosystem.config.cjs
//   pm2 save          # persist across reboots
//   pm2 startup       # register PM2 with systemd
//
// Common commands:
//   pm2 status        — check if the app is running
//   pm2 logs flarepublic   — tail live logs
//   pm2 restart flarepublic --update-env   — restart after .env change
//   pm2 reload flarepublic  — zero-downtime reload

module.exports = {
  apps: [
    {
      name: 'flarepublic',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/flarepublic',   // ← adjust to your actual deploy path on the VPS
      instances: 1,               // single instance — scale up if traffic grows
      exec_mode: 'fork',
      autorestart: true,
      watch: false,               // never watch in production
      max_memory_restart: '512M', // restart if memory exceeds 512 MB
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Log config
      out_file: '/home/flarepublic/logs/out.log',
      error_file: '/home/flarepublic/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
}
