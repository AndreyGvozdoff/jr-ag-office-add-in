const fs = require("fs");
const path = require("path");
const homedir = require('os').homedir();

const key = `${homedir}/.office-addin-dev-certs/localhost.key`;
const cert = `${homedir}/.office-addin-dev-certs/localhost.crt`;
const ca = `${homedir}/.office-addin-dev-certs/ca.crt`;

module.exports = {
    devServer: {
        port: process.env.npm_package_config_dev_server_port || 3000,
        https: true,
        key:  fs.existsSync(key) ? fs.readFileSync(path.resolve(key)) : '',
        cert: fs.existsSync(cert) ? fs.readFileSync(path.resolve(cert)) : '',
        ca: fs.existsSync(ca) ? fs.readFileSync(path.resolve(ca)) : ''
    }
};
