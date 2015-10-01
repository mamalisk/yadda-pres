var fs = require('fs'),
    nconf = require('nconf');

module.exports = function AgentaConfig(base) {
    var FILE_SUFFIX = "yadda-exec.json";
    var filename = '';
    var agentaenv = process.env.AGENTA_ENV && process.env.AGENTA_ENV.trim();

    base = base || '';
    
    if (agentaenv) {
        filename = base + agentaenv + '.' + FILE_SUFFIX;
    } else {
        filename = base + FILE_SUFFIX;
    }

    this.get = function () {

        console.log(filename);
        return nconf.file(filename);
    }
};