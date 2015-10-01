var navigation = function(library){

    this.dictionary = library.dictionary;

    this.dictionary

        .given(['I navigate to my homepage', 'I return to the main page'],function(done){
            done();
         })

        .given('I navigate to google',function(done){
            this.agent.navigateToGoogle(done);
         })

        .given('I navigate to the help page',function(done){
            done();
         })

        .define('my whildcard step', function(done){
            
            
        })

        ;
};


module.exports = navigation;