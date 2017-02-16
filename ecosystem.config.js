module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: "APP",
            script: "app.js",
            watch: true,
            env: {
                COMMON_VARIABLE: "true"
            },
            env_production: {
                NODE_ENV: "production"
            }
        },

        // Second application
        {
          name      : "all",
          script    : "get-bookinfo.js"
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: "jayden",
            host: "118.89.26.227",
            ref: "origin/master",
            repo: "https://github.com/JxJayden/node-guichuideng-reader.git",
            path: "/home/jayden/var/reader",
            "post-deploy": "yarn install"
        },
        dev: {
            user: "node",
            host: "212.83.163.1",
            ref: "origin/master",
            repo: "git@github.com:repo.git",
            path: "/var/www/development",
            "post-deploy": "npm install && pm2 startOrRestart ecosystem.json --env dev",
            env: {
                NODE_ENV: "dev"
            }
        }
    }
}
