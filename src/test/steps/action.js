var action = function(library){

    this.dictionary = library.dictionary;

    this.dictionary

        .when('user performs registration',function(done){
            this.agent.performRegistration(done);
         })

        .define('my whildcard action step', function(done){
            this.agent.sing('lalala', done);
        })

        ;
};


module.exports = action;