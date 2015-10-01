var verification = function(library){

    this.dictionary = library.dictionary;

    this.dictionary

        .then('I verify this result',function(done){
            done();
         })

        .define('my whildcard verification step', function(done){
            
            done();
        })

        ;
};


module.exports = verification;