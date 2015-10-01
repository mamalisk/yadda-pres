var fs = require('fs'),
    nconf = require('nconf');

module.exports = function AgentaConfig(base) {
    var FILE_SUFFIX = "agenta.json";
    var filename = '';
    var agentaenv = process.env.AGENTA_ENV && process.env.AGENTA_ENV.trim();

    if (agentaenv) {
        filename = base + agentaenv + '.' + FILE_SUFFIX;
    } else {
        filename = base + FILE_SUFFIX;
    }

    this.get = function () {
        return nconf.file(filename);
    }
};