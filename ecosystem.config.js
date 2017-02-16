module.exports = {
    deploy: {
        production: {
            user: "your name",
            host: "your host",
            ref: "your repo branch",
            repo: "your repo",
            path: "your path",
            "post-deploy": "npm install && pm2 start processes.json --only app"
        }
    }
}
