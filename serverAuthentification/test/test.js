import assert from 'assert';
import db from "../db.js"
import axios from "axios";

//await db.user.create({nom:'test',prenom:'test',pseudo:'userTest',password:'$2b$10$EoU4bT5KRoJE.90xLNzmmO.TqFzuQPUM3U/JJusjSGVzsphex07QW',isNotif:false,idRole:1})

describe('Test authentification', function () {
    //describe('#findCreatedUser()', function () {
        it('finds the user presta, already created', function (done) {
            db.user.findOne({where: {pseudo: "userTest"}}).then(user => {
                if(user){
                    done();
                }else{
                    done("Not found");
                }
            });
        });
    //});

	it('test de l authentification avec passport de type local',(done)=>{
		axios.post("http://localhost:3010/auth/local",{pseudo:'userTest',password:'mdpuser'})
			.then(()=>{done()})
			.catch((err)=>{done(err)})
    	})

    it('test de l authentification avec passport avec user not found',(done)=>{
        axios.post("http://localhost:3010/auth/local",{pseudo:'testbfehiurhf',password:'mdpuser'})
            .then(()=>{done("erreur dans serveur auth")})
            .catch((err)=>{done()})
        })

});
