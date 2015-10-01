var action = function(library){

    this.dictionary = library.dictionary;

    this.dictionary

        .when('I act in a specific way',function(done){
            done();
         })

        .define('my whildcard action step', function(done){
            
            done();
        })

        ;
};


module.exports = action;