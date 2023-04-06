var assert = require('assert');
var db = import("../db.js")

var goodPseudo = ""
describe('Array', function () {
    describe('#findCreatedUser()', function () {
        it('finds the user presta, already created', function (done) {
            db.user.findOne({where: {pseudo: "presta"}}).then(user => {
                if(user){
                    done();
                }else{
                    done("Not found");
                }
            });
        });
    });

    describe('#findNotCreatedUser()', function () {
        it('finds the user helloGuys, not present in the database', function (done) {
            db.user.findOne({where: {pseudo: "helloGuys"}}).then(user => {
                if(user){
                    done("User exists");
                }else{
                    done();
                }
            });
        });
    });
});
