const { portApp } = require("./config.json");

const port = portApp;
const project = 'api_dash_users'
const repository = `git@git.dda.sodimac.cl:dda/darthsidious/api_dash_users.git`;

module.exports = {
  apps: [
    {
      name: `${port} - ${project}`,

      script: `/var/node/${project}/source/dist/index.js`,
      kill_timeout: 3000,
      instances: 2,
      output: `/var/node_logs/${project}-out.log`,
      error: `/var/node_logs/${project}-error.log`,
      merge_logs: true,
      log_date_format: "DD-MM-YYYY HH:mm:ss:SSS",
    },
  ],
  deploy: {
    production: {
      host: "hansolo.dda.sodimac.cl",
      user: "desarrollo",
      ref: "origin/master",
      repo: repository,
      path: `/var/node/${project}`,
      "post-deploy":
        "npm install; npm run build; pm2 startOrRestart ecosystem.config.js",
      env: {
        NODE_ENV: "production",
        SERVER: "darthsidious.sodimac.cl",
        PORT_BD: 27017,
        SCHEMA: "TRAZAHUB",
        SQLHOST:"obiwankenobi.sodimac.cl",
        SQLUSER:"trazabilidadhub",
        SQLDB: "trazabilidad_hub",
        SQLPASS: "e5f3b0d88a9ad2895f6d387a68d86aa7",
        URLSERVER: "https://hansolo.dda.sodimac.cl"

      },
    },
    develop: {
      host: "thanos.dda.sodimac.cl",
      user: "desarrollo",
      ref: "origin/develop",
      repo: repository,
      path: `/var/node/${project}`,
      "post-deploy":
        "npm install; npm run build; pm2 startOrRestart ecosystem.config.js",
        env: {
          NODE_ENV: "develop",
          SERVER: "xizor.sodimac.cl",
          PORT_BD: 27017,
          SCHEMA: "TRAZAHUB",
          SQLHOST:"10.113.112.41",
          SQLUSER:"trazabilidad_hub",
          SQLDB: "trazabilidad_hub",
          SQLPASS: "Sodimac#2023",
          URLSERVER: "https://thanos.dda.sodimac.cl"
        },
    },
  },
};
