'use strict'
// ----------------------- NOS MODULES -------------------------
const bodyParser = require( 'body-parser' );
const crypto = require( 'crypto' );
const express = require( 'express' );
const fetch = require( 'node-fetch' );
const request = require( 'request' );
const requestify = require( 'requestify' );
const firebase = require('firebase');
const admin = require("firebase-admin");
var glob_text;
//sparql staff
const onto="<http://www.co-ode.org/roberts/travel.owl%23>";
const lien="http://047ba428.ngrok.io/travel/sparql";

let Wit = null;
let log = null;
try {
  Wit = require( '../' ).Wit;
  log = require( '../' ).log;
} catch ( e ) {
  Wit = require( 'node-wit' ).Wit;
  log = require( 'node-wit' ).log;
}

// ----------------------- FIREBASE INIT -------------------------
firebase.initializeApp(
  {
    apiKey: "AIzaSyCrLY1cmOxuAc4FGkQsWr52NAsfbIwFLrc",
    authDomain: "chatbotonto.firebaseapp.com",
    databaseURL: "https://chatbotonto.firebaseio.com",
    projectId: "chatbotonto",
    storageBucket: "chatbotonto.appspot.com",
    messagingSenderId: "952054455181"
  }
);

admin.initializeApp( {
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": "chatbotonto",
  "private_key_id": "3866ac4daedd9b2a07919879a9f5ab181a35d919",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQfH1SwywphycR\nlzqyZ2pry9FdA3L+vKTqPgbV8lgX6g5m5dTqS5fNQ6ZrOPOFGo344MszQeDP8AzA\nZYaeTMOBaA1J9HGVROL9jqMcflaYWanR6s+R5rPMpmC93hQO8cUyfv1rLT9maMz5\n8Uj0c1ahA+dKOGtaoHcFQWAKLPJDafOTY9LIE7LHifvCHhKs/3rp5r8qJDVckGd8\nZJixsddWKeQ9O+6qwOfvqd2gQj62wwzxuwnMfztWBatJjK6Ig7wpnSdV013zLcBR\nhEC+yzmCZ6MltzhbyrFFJzK+1pKAAIvDXvS8H4ff0cBLBaaAfgA1PuP9Qgi0OQ87\nIttqQ3KHAgMBAAECggEAA6bqmxSIJYIUkR5RDOb62kCLvlFdJlEvolrLy9ue52xW\nLD9CZ4hDdHkG5UHuIhrA+ecWKCOzSHEwB/6/SO6XTiEAepcpli/Kuh5RhSJBahHI\nA8FVOX0NETyo3SqSt2BM0AGhdssoHScg0BAF8yJCFjf3STmLx96ftxvaDtOSutOM\nNDaPmkxQMTPhLiTvKdCdxv8aOS++V0rM7Pyi3xg7yoIm+VNSYoF2W0TbpBUfL5Gs\nQuPFBxmvL+PlxT7YDqDsEurfZHGg1Fs+d5grXd/g2TLu+k5iljzd5UlEZahfyX2E\nyeDjbH+H2QzsaYH0+1KECRRtgMhhSG7L9/b/K3chYQKBgQDsQidcvC42tzorEaux\nJZtbyW9JwfBV+lnkEqaj622Nq1jHI4Az5XIzEswVE6aOfsPdBGAQkI2UCCYcoE+9\nDpijJlH1+DuIL9thQ4LhwYKNbw1ohqD/1qiFNpaHQsytvFU/em3mvzV7ZfuhyKnC\n1V0a0uJU0k0n1igjZckBabq55QKBgQDh6EHapjqPWXBJjEu75f2iVcokLAA+JjIB\nOwKrsQ8EX3Tolv3NGEvWmFvL6FAIXw1/MD9XJQoeeq08V+4oc3TAvfQntMe34oZe\na/fKdsMotqJwwZIB+FJPQZhShpILmJAHvIaeLjTl/a2nVTs5A4wT25GAoEdfWSR0\nlVvUGeOD+wKBgFc/Tt32OHLIU1jYW7k9lBPfXZO1ZRW7MDsDkDp0lK5+mnhf6dZA\nY13tESSvbxCsS5RxKzCy0TXblId5xDijDUcivZ3CH+n5EmDm14ybM6UbX648GXSh\nRvZ65DfrOT7nj+uzQKa38f4x+S0Tt21V8d4YBrEgQJH3ijcYPZSiAOzpAoGBANAK\nlmsH3rIZCcGRxEUcPwH6w5egNfEGN9LOR11aR5wdVIrGUqFIGL9dvFwCa4HqF4Hk\nKtDUOYdsLpF94MO73++If4r5f1um71uRTrdTu9KIrvvsJ8xMpXB71g1aBLFNJIcb\nZVXS88BCaGPLqCiPTbcT4+FyuYfjjiEXU2P3G4F1AoGAOKIfbpLMiOfZ2pNq0kUJ\nvYP9DoDsoBquXk/AtS5WFCinw0mkkA1ntxfTVq0AKAjk4kj+kvUkSPHZtY8Pk7RT\nrxkJirZ744SD2+VjhUBIEPe+kiJ84ZtNIIQWgGzeDcXrxZI7FMyrO/P9nkUnJUS2\nInrg3BuO8ef9d2IHMxjPBtY=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-n71og@chatbotonto.iam.gserviceaccount.com",
  "client_id": "111733439612341097957",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n71og%40chatbotonto.iam.gserviceaccount.com"
}),
  databaseURL: "https://chatbotonto.firebaseio.com"
});


// ----------------------- PARAMETRES DU SERVEUR -------------------------
const PORT = process.env.PORT || 5000;
// Wit.ai parameters
const WIT_TOKEN = "K56VEGJSODMHTIHNV3H4FKTO77AL4P4J";
// Messenger API parameters
const FB_PAGE_TOKEN = "EAAfwLILFP6MBANgTa2DsrlrpEFJWbzJYqZA2vp8shaM5lBrI3eVleZAegIV4zZCoUps656k2nLgXMhhebZAGbrRdzjEtJ5NCnQupuRx18irlGh6BsfDCcgX3bb90A5vkUZB9li4BvBtQ4SZALMESfPH6QRvpI48F6PM2iuKIgBuQZDZD";   // saisir ici vos informations (infos sur session XX)
if ( !FB_PAGE_TOKEN ) {
  throw new Error( 'missing FB_PAGE_TOKEN' )
}
const FB_APP_SECRET = "e0e8ad40f674da5f89183f37909919f0";
if ( !FB_APP_SECRET ) {
  throw new Error( 'missing FB_APP_SECRET' )
}
let FB_VERIFY_TOKEN = "1.hello@world#";
crypto.randomBytes( 8, ( err, buff ) => {
  if ( err ) throw err;
  FB_VERIFY_TOKEN = buff.toString( 'hex' );
  console.log( `/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"` );
} );
// ----------------------- FONCTION POUR VERIFIER UTILISATEUR OU CREER ----------------------------
var checkAndCreate = (fbid, prenom, nom) => {
	var userz = firebase.database()
		.ref()
		.child("accounts")
		.orderByChild("fbid")
		.equalTo(fbid)
		.once("value", function(snapshot) {
				admin.auth()
					.createCustomToken(fbid)
					.then(function(customToken) {
						firebase.auth()
							.signInWithCustomToken(customToken)
							.then(function() {
								//inserer notre compte
								var user2 = firebase.auth().currentUser;
								var keyid = firebase.database()
									.ref()
									.child('accounts')
									.push();
								firebase.database()
									.ref()
									.child('accounts')
									.child(keyid.key)
									.set({
										fbid: fbid,
                    prenom : prenom,
                    nom : nom,
                    //genre : genre,
										date: new Date()
											.toISOString()
									})
									.catch(function(error2) {
										console.log(error2);
									});
							})
							.catch(function(error) {
								// Handle Errors here.
								var errorCode = error.code;
								var errorMessage = error.message;
							});
					})
					.catch(function(error3) {
						console.log("Erreur : "+ error3);
					});
		});
};
// ------------------------ FONCTION DEMANDE INFORMATIONS USER -------------------------
var requestUserName = (id) => {
	var qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
	return fetch('https://graph.facebook.com/v3.2/' + encodeURIComponent(id) + '?' + qs)
		.then(rsp => rsp.json())
		.then(json => {
			if (json.error && json.error.message) {
				throw new Error(json.error.message);
			}
			return json;
		});
};
// ------------------------- ENVOI MESSAGES SIMPLES ( Texte, images, boutons génériques, ...) -----------
var fbMessage = ( id, data ) => {
  var body = JSON.stringify( {
    recipient: {
      id
    },
    message: data,
  } );
  console.log( "BODY" + body );
  var qs = 'access_token=' + encodeURIComponent( FB_PAGE_TOKEN );
  return fetch( 'https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
  } ).then( rsp => rsp.json() ).then( json => {
    if ( json.error && json.error.message ) {
      console.log( json.error.message + ' ' + json.error.type + ' ' +
        json.error.code + ' ' + json.error.error_subcode + ' ' + json.error
        .fbtrace_id );
    }
    return json;
  } );
};
// ----------------------------------------------------------------------------
const sessions = {};
// ------------------------ FONCTION DE CREATION DE SESSION ---------------------------
var findOrCreateSession = (fbid) => {
	let sessionId;
	Object.keys(sessions)
		.forEach(k => {
			if (sessions[k].fbid === fbid) {
				sessionId = k;
			}
		});
	if (!sessionId) {
		sessionId = new Date()
			.toISOString();
		sessions[sessionId] = {
			fbid: fbid,
			context: {}
		};
    requestUserName(fbid)
      .then((json) => {
        sessions[sessionId].name = json.first_name;
		//sessions[sessionId].gender = json.gender;
				checkAndCreate(fbid, json.first_name,  json.last_name);
      })
      .catch((err) => {
        console.error('Oops! Il y a une erreur : ', err.stack || err);
      });
	}
	return sessionId;
};
// ------------------------ FONCTION DE RECHERCHE D'ENTITES ---------------------------
var firstEntityValue = function( entities, entity ) {
    var val = entities && entities[ entity ] && Array.isArray( entities[ entity ] ) &&
      entities[ entity ].length > 0 && entities[ entity ][ 0 ].value
    if ( !val ) {
      return null
    }
  return typeof val === 'object' ? val.value : val
}
// ------------------------ LISTE DE TOUTES VOS ACTIONS A EFFECTUER ---------------------------

var actions = {
  // fonctions genérales à définir ici
  send_generic_button_message( sessionId, context, entities, elements ) {
    return new Promise((resolve,reject)=>{
      const recipientId = sessions[ sessionId ].fbid;
      return fbMessage( recipientId, elements )
      .then( () => {return resolve(1);} )
      .catch( ( err ) => {
        console.log( "Erreur send_generic_button_message" + recipientId );
        return reject(0);
      } );
    })
  },
  send( {sessionId}, response ) {
    const recipientId = sessions[ sessionId ].fbid;
    if ( recipientId ) {
      if ( response.quickreplies ) {
        response.quick_replies = [];
        for ( var i = 0, len = response.quickreplies.length; i < len; i++ ) {
          response.quick_replies.push( {
            title: response.quickreplies[ i ],
            content_type: 'text',
            payload: response.quickreplies[ i ]
          } );
        }
        delete response.quickreplies;
      }
      return fbMessage( recipientId, response )
        .then( () => null )
        .catch( ( err ) => {
          console.log( "Je send" + recipientId );
          console.error(
            'Oops! erreur ',
            recipientId, ':', err.stack || err );
        } );
    } else {
      console.error( 'Oops! utilisateur non trouvé : ', sessionId );
      return Promise.resolve()
    }
  },
  getUserName( sessionId, context, entities ) {
      const recipientId = sessions[ sessionId ].fbid;
      const name = sessions[ sessionId ].name || null;
      const gender = sessions[ sessionId ].gender || null;
      return new Promise( function( resolve, reject ) {
        if ( recipientId ) {
          if ( name ) {
            context.userName = name;
            if(gender){
              if(gender == 'male')
              context.gender = "Mr.";
              else if(gender == 'female')
              context.gender = "Ms.";
              else
              context.gender = "";
            }
            resolve( context );
          } else {
            requestUserName( recipientId )
            .then( ( json ) => {
              sessions[ sessionId ].name = json.first_name;
              context.userName = json.first_name;
              sessions[ sessionId ].gender = json.gender;
              context.gender =json.gender;
              resolve( context );
            } )
            .catch( ( err ) => {
              console.log( "ERROR = " + err );
              console.error(
                'Oops! Erreur : ',
                err.stack || err );
                reject( err );
              } );
            }

          } else {
            console.error( 'Oops! pas trouvé user :',
            sessionId );
            reject();
          }
        } );
      },
  envoyer_message_text( sessionId, context, entities, text ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response = {
      "text": text
    };
    return fbMessage( recipientId, response )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
    send_image_message( sessionId, context, entities, image_url ) {
        const recipientId = sessions[ sessionId ].fbid;
        var response = {
          "attachment":{
            "type":"image",
            "payload":{
              "url": image_url
            }
          }
        };
        return fbMessage( recipientId, response )
        .then( () => {} )
        .catch( ( err ) => {
          console.log( "Erreur send_text_message" + recipientId );
        } );
      },
	send_buttonurl_message( sessionId, context, entities, elements ) {
        const recipientId = sessions[ sessionId ].fbid;
        return fbMessage( recipientId, elements )
        .then( () => {} )
        .catch( ( err ) => {
          console.log( "Erreur send_buttonurl_message" + recipientId );
        } );
      },
			envoyer_message_quickreplies( sessionId, context, entities, text, quick ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response2 = {
      "text": text,
      "quick_replies": quick
    };
    return fbMessage( recipientId, response2 )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
  reset_context( entities, context, sessionId ) {
    console.log( "Je vais reset le context" + JSON.stringify( context ) );
    return new Promise( function( resolve, reject ) {
      context = {};
      return resolve( context );
    } );
  }
};

//-------------------------------SPARQL------------------------------------
function query_sparql(quer){
	return new Promise((resolve,reject)=>{
		request(
			{ method: 'GET'
			, uri: quer
			, headers: {
				'accept': 'application/json'
			}
		}
		, function (error, response, body) {
			console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
			console.log('the decoded data is: ' + body)
			return resolve (JSON.parse(body));
		}
	);
})
}

function list_result(monArray){
	return new Promise((resolve,reject)=>{
		var monArraySeria = '';
		for (var i in monArray){
			var r=monArray[i].x.value.split("#");
			r=r[1];r=r.replace(/_/g,' ');
			var k=parseInt(i)+1;
			if(monArray.length==1){
				monArraySeria +=  r + "\r\n";
			}else{
				monArraySeria += k+" ) " + r + "\r\n";
			}
		}
		return resolve(monArraySeria);
	});
}
//------------------quelques variables------------------
var menu = {
	"attachment":{
		"type":"template",
		"payload":{
			"template_type":"generic",
			"elements":[
					{
				            "title": "Guide",
				            "image_url": "https://www.ffst.info/wp-content/uploads/2017/05/Guide.jpg",
				            "subtitle": "Guide of usage",
				            "buttons": [
				              {
				                "type": "postback",
				                "payload": "guide",
				                "title": "Discover"
				              }]
				            },
					{
						"title": "MAP",
						"image_url": "http://soykirimvahseti.com/wp-content/uploads/2018/09/Simple-World-Map-With-Country-Names-Web-Art-Gallery-With-Simple-World-Map-With-Country-Names-768x527.jpg",
						"subtitle": "Google Map",
						"buttons": [
							{
								"type":"web_url",
								"url":"https://www.google.com/maps",
								"title":"Discover"
							}]
						},

					{
						"title": "Endpoint",
						"image_url": "https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/50879329_2252436788329934_2995331671361847296_n.png?_nc_cat=108&_nc_ht=scontent-cdt1-1.xx&oh=f0fb14830908ecf5c8538dba78be7fad&oe=5CF0C47E",
						"subtitle": "Discover our sparql endponit",
						"buttons": [
							{
								"type":"web_url",
								"url":"https://protected-sea-56253.herokuapp.com/",
								"title":"Discover"
							}]
						}
					]
				}
			}
		};
		var guid = {
			"attachment":{
				"type":"template",
				"payload":{
					"template_type":"button",
					"text":"^_^",
					"buttons":[
						{
							"type":"web_url",
							"url":"https://protected-earth-52357.herokuapp.com/",
							"title":"guid",
						}
					]
				}
			}
		};
		// --------------------- CHOISIR LA PROCHAINE ACTION (LOGIQUE) EN FCT DES ENTITES OU INTENTIONS------------
		function choisir_prochaine_action( sessionId, context, entities ) {
			var q;
			// ACTION PAR DEFAUT CAR AUCUNE ENTITE DETECTEE
			if(Object.keys(entities).length === 0 && entities.constructor === Object) {

			}
			// PAS DINTENTION DETECTEE
			if(!entities.intent) {
				actions.envoyer_message_text(sessionId, context, entities,'I didn\'t understand what do you mean ! please check my giud for best use.').then(()=>{
					actions.send_buttonurl_message(sessionId, context, entities, guid);
				})
			}
			// IL Y A UNE INTENTION DETECTION : DECOUVRONS LAQUELLE AVEC UN SWITCH
			else {
				switch ( entities.intent && entities.intent[ 0 ].value ) {

					case "saying_hello":
					actions.reset_context( entities, context, sessionId ).then(function() {
						//actions.send_image_message(sessionId, context, entities,"https://media.giphy.com/media/3oKIPDf1E4qKYRJ6oM/giphy.gif").then(()=>{
							actions.getUserName( sessionId, context, entities ).then( function() {
								actions.envoyer_message_text( sessionId, context, entities, 'Hello '+context.userName+' 😊').then(()=>{
									actions.envoyer_message_text(sessionId, context, entities, 'I’m GeoBot and you can ask me about countries, seas, continents and more... ').then(()=>{
										actions.envoyer_message_text(sessionId, context, entities, 'In case you face any trouble using me, please tap guid. you\'re welcome 😊');
									})
								})
							})
							//})
						})
						break;
						case "asking_for_islands":
						if(entities.country && entities.country[0].value && entities.sea && entities.sea[0].value){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							var sea=entities.sea[0].value;
							var sea2=sea.replace(/ /g,"_");
							q=lien+'?query=prefix cd:'+onto +' select  distinct ?x  where {{{?x cd:surroundedBy cd:'+sea2+'}{?x cd:hasLocation cd:'+country2+'}}} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Islands surrounded by '+sea+' and located in '+country+' are : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});

						}else if(entities.country && entities.country[0].value && entities.sea && entities.sea[0].value &&entities.not && entities.not[0].value){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							var sea=entities.sea[0].value;
							var sea2=sea.replace(/ /g,"_");
							q=lien+'?query=prefix cd:'+onto +' select  distinct ?x   where {{?country a cd:Country. ?x a cd:Island. ?x cd:hasLocation ?country filter (?country != cd:'+country2+')}{?x  cd:surroundedBy  cd:'+sea2+' }} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Islands surrounded by '+sea+' and not located in '+country+' are : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}else if(entities.not && entities.not[0].value && entities.continent && entities.continent[0].value && entities.country && entities.country[0].value){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							var continent=entities.continent[0].value;
							var continent2=continent.replace(/ /g,"_");
							q=lien+'?query=prefix cd:'+onto +' select  distinct ?x where { ?country a cd:Country. ?x a cd:Island. ?x  cd:isDirectPartOf  cd:'+continent+'. ?x  cd:hasLocation  ?counrty  FILTER (?country != cd:'+country+')} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Islands of '+continent+' and not '+country+' are : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}else if(entities.country && entities.country[0].value!="islands"){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							q=lien+'?query=prefix cd:'+onto +' SELECT DISTINCT ?x  where {?x a cd:Island. ?x cd:hasLocation  cd:'+country2+'} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Islands of '+country+' are : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}else if(entities.continent && entities.continent[0].value){
							var continent=entities.continent[0].value;
							var continent2=continent.replace(/ /g,"_");
							q=lien+'?query=prefix cd:'+onto +'select DISTINCT ?x  where {?x a cd:Island. ?x  cd:isDirectPartOf  cd:'+continent2+'} limit 25';


							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Islands of '+continent+' are : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}else if(entities.sea && entities.sea[0].value){
							var sea=entities.sea[0].value;
							var sea2=sea.replace(/ /g,"_");
							q=lien+'?query=prefix cd:'+onto +'select DISTINCT ?x  where {?x a cd:Island. ?x  cd:surroundedBy  cd:'+sea2+'} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Islands of '+sea+' are : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}else{
							q=lien+'?query=prefix cd:'+onto +' SELECT DISTINCT ?x WHERE { ?x a cd:Island} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Islands : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any island !');
								}
							});
						}

						break;
						case "asking_for_countries":
						q=lien+'?query= prefix cd:'+onto+' SELECT DISTINCT ?x where {?x a cd:Country} LIMIT+10';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities, ' Countries : ').then(()=>{
										actions.envoyer_message_text( sessionId, context, entities, res);
									});
								});

							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any country !');
							}
						});
						break;
						case "asking_for_seas":
						q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x  where { ?x a  cd:Sea} limit 10';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities, ' Seas : ').then(()=>{
										actions.envoyer_message_text( sessionId, context, entities, res);
									});
								});

							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any sea ');
							}
						});
						break;
						case "asking_for_oceans":
						q=lien+'?query= prefix cd:'+onto+' SELECT DISTINCT ?x  where { ?x a  cd:Ocean} limit 10';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities, ' Oceans : ').then(()=>{
										actions.envoyer_message_text( sessionId, context, entities, res);
									});
								});

							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any ocean ');
							}
						});
						break;
						case "asking_for_location":
						if(entities.Island && entities.Island[0].value){
							var place=entities.Island[0].value;

						}else if(entities.mountain && entities.mountain[0].value){
							var place=entities.mountain[0].value;
						}else if(entities.Hill && entities.Hill[0].value){
							var place=entities.Hill[0].value;
						}
						var place2=place.replace(/ /g,"_");
						q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {cd:'+place2+' cd:hasLocation ?x } limit 10';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities, place+' is in '+res);
								});

							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find this place !');
							}
						});

						break;
						case "asking_for_group_islands":
						if(entities.Island && entities.Island[0].value){
							var island=entities.Island[0].value;
							var island2=island.replace(/ /g,"_");
							q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {cd:'+island2+' cd:isMemberIslandOf ?x } limit 10';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities, island+' is of the group : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find this island ');
								}
							});
						}

						break;
						case "asking_for_continent":
						if(entities.Island && entities.Island[0].value){
							var island=entities.Island[0].value;
							var island2=island.replace(/ /g,"_");
							q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {cd:'+island2+' cd:isDirectPartOf ?x } limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities, island+' is of the continent : '+res);
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find this island ');
								}
							});
						}else{
							q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {?x a cd:Continent } limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities, ' List of continents : \n'+res);
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find this island ');
								}
							});
						}

						break;
						case "asking_countries_head_state":
						q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {?x cd:hasHeadOfState ?y } limit 25';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities,'Countries having a head of state are : '+res);
								});

							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find this island ');
							}
						});
						break;
						case "asking_if_country_has_coastline":
						if(entities.country && entities.country[0].value){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {cd:'+country2+' cd:hasCoastline ?x } limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,'Yes :D '+country+' have : \n'+res);
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'This country doesn\'t have a coastline !');
								}
							});
						}else{
							actions.envoyer_message_text( sessionId, context, entities, 'You didn\'t specify a known country !');
						}

						break;
						case "asking_countries_coastline":
						q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {?x cd:hasCoastline ?y } limit 25';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities,'Countries having a coastline : \n'+res);
								});
							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any country !');
							}
						});
						break;
						case "asking_land_boundaries_of_country":
						if(entities.country && entities.country[0].value){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {?x cd:isLandBoundaryOf cd:'+country2+'} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,'Land boundaries of '+country+' : \n'+res);
									});
								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any country !');
								}
							});
						}else{
							actions.envoyer_message_text( sessionId, context, entities, 'You didn\'t specify a known country !');
						}

						break;
						case "asking_ocean_sea":
						if(entities.sea && entities.sea[0].value){
							var sea=entities.sea[0].value;
							var sea2=sea.replace(/ /g,"_");
							q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where {cd:'+sea2+' cd:isDirectPartOf  ?x} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,'The ocean containing '+sea+' is : '+res);
									});
								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any result, please try again !');
								}
							});
						}else{
							actions.envoyer_message_text( sessionId, context, entities, 'You didn\'t specify a known sea !');

						}
						break;
						case "asking_for_mountain":
						if(entities.country && entities.country[0].value!="mountains" && entities.country[0].value!="mountain"){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							q=lien+'?query=prefix cd:'+onto +' SELECT DISTINCT ?x  where {?x a cd:Mountain. ?x cd:hasLocation cd:'+country2+'} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' Mountains of '+country+' : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}else{
							q=lien+'?query=prefix cd:'+onto +' SELECT DISTINCT ?x  where {?x a cd:Mountain} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' List of mountains : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}
						break;
						case "asking_for_mountain_range":
						q=lien+'?query= prefix cd:'+onto+' select distinct ?x where {?x a cd:MountainRange} limit 25';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities,'Mountain range :\n '+res);
								});
							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any result, please try again !');
							}
						});

						break;
						case "asking_for_countries_with_mountains":
						q=lien+'?query= prefix cd:'+onto+' select DISTINCT ?x where { ?p a cd:Mountain. ?p cd:hasLocation ?x} limit 25';
						query_sparql(q).then((res)=>{
							if(res.results.bindings.length!=0 ){
								list_result(res.results.bindings).then((res)=>{
									actions.envoyer_message_text( sessionId, context, entities,'Countries having mountains :\n '+res);
								});
							}else{
								actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any result, please try again !');
							}
						});
						break;
						case "developper_mode":
						var msg={
							"attachment":{
								"type":"template",
								"payload":{
									"template_type":"button",
									"text":"^_^",
									"buttons":[
										{
											"type":"web_url",
											"url":"https://protected-sea-56253.herokuapp.com/",
											"title":"Developper mode",
										}
									]
								}
							}
						}
						actions.send_buttonurl_message(sessionId, context, entities,msg);

						break;
						case "asking_for_capital":
						if(entities.country && entities.country[0].value){
							var country=entities.country[0].value;
							var country2=country.replace(/ /g,"_");
							country2=country2.toLowerCase();
							q=lien+'?query=prefix cd:'+onto +' select ?x where {?x cd:isDirectPartOf cd:'+country2+'} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,'The Capital of '+country+' is : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}
						break;
						case "home":
						actions.reset_context( entities, context, sessionId ).then(function() {
							actions.envoyer_message_text( sessionId, context, entities, 'Principal menu :').then(function() {
								actions.send_generic_button_message(sessionId, context, entities, menu);
							})
						});
						break;
						case "saying_goodbye":
						actions.envoyer_message_text( sessionId, context, entities, 'Goodbye ^_^ ').then(()=>{
							actions.send_image_message(sessionId, context, entities,"https://media.giphy.com/media/3ov9jYkVbdGMo6UcG4/giphy.gif");
						});
						break;
						case "asking_for_countries_with_islands":
						if(entities.continent && entities.continent[0].value){
							var continent=entities.continent[0].value;
							var continent2=continent.replace(/ /g,"_");
							q=lien+'?query= prefix cd:'+onto+' select  distinct ?x where { ?x a cd:Country. ?island a cd:Island. ?island  cd:isDirectPartOf  cd:'+continent2+'. ?island  cd:hasLocation  ?x } limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,'List of countries of '+continent+' containing islands : \n'+res);
									});
								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any result please try again !');
								}
							});
						}else{
							q=lien+'?query= prefix cd:'+onto+' select  distinct ?x where { ?x a cd:Country. ?island a cd:Island.  ?island  cd:hasLocation  ?x  } limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,'List of countries containing islands : \n'+res);
									});
								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any result please try again !');
								}
							});
						}
						break;
						case "nb_of_countries_with_islands":
						if(entities.continent && entities.continent[0].value){
							var continent=entities.continent[0].value;
							var continent2=continent.replace(/ /g,"_");
							q=lien+'?query=prefix cd:'+onto +' select  (count( distinct ?country) as ?c) where { ?country a cd:Country. ?island a cd:Island. ?island  cd:isDirectPartOf  cd:'+continent2+'. ?island  cd:hasLocation  ?counrty }';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									const c=res.results.bindings[0].c.value;
									actions.envoyer_message_text( sessionId, context, entities,'We have '+c+' countries having islands in '+continent+'.');

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}else{
							q=lien+'?query=prefix cd:'+onto +' select  (count( distinct ?country) as ?c) where { ?country a cd:Country. ?island a cd:Island. ?island  cd:hasLocation  ?counrty }';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									const c=res.results.bindings[0].c.value;
									actions.envoyer_message_text( sessionId, context, entities,'We have '+c+' countries having islands.');

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});
						}
						break;
						case "nb_islands_continent_not_country":
						if(entities.continent && entities.continent[0].value && entities.country && entities.country[0].value){
							var continent=entities.continent[0].value;
							var country=entities.country[0].value;
							q=lien+'?query= prefix cd:'+onto+' select (count( distinct ?island) as ?c) where {?country a cd:Country. ?island a cd:Island. ?island  cd:isDirectPartOf  cd:europe. ?island  cd:hasLocation  ?counrty FILTER (?country != cd:scotland)}';

							query_sparql(q).then((res)=>{


								if(res.results.bindings.length!=0 ){
									const c=res.results.bindings[0].c.value;
									actions.envoyer_message_text( sessionId, context, entities,'Number of islands in '+continent+' and not in '+country+' is '+c);
								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any result, please try again !');
								}
							});
						}else{
							actions.envoyer_message_text( sessionId, context, entities, 'I can\'t find any result, please try again !');
						}
						break;
						case "asking_for_hills":
						q=lien+'?query=prefix cd:'+onto +' SELECT DISTINCT ?x  where {?x a cd:Hill} limit 25';
							query_sparql(q).then((res)=>{
								if(res.results.bindings.length!=0 ){
									list_result(res.results.bindings).then((res)=>{
										actions.envoyer_message_text( sessionId, context, entities,' List of hills : ').then(()=>{
											actions.envoyer_message_text( sessionId, context, entities, res);
										});
									});

								}else{
									actions.envoyer_message_text( sessionId, context, entities, 'Sorry I can\'t find any result, please try again !');
								}
							});

						break;
						
						case "how_are_you":
							actions.envoyer_message_text( sessionId, context, entities, 'I\'m fine. Thank you ^_^ ');
						break;
						case "guide":
						actions.reset_context( entities, context, sessionId ).then(function() {
							actions.envoyer_message_text( sessionId, context, entities, 'Here\'s my guide').then(function() {
								actions.envoyer_message_quickreplies(sessionId, context, entities, guid);
							})
						});
						break;
					};
				}
			};
// --------------------- LE SERVEUR WEB ------------
const wit = new Wit( {
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger( log.INFO )
} );
const app = express();
app.use(( {
    method,
    url
  }, rsp, next ) => {
    rsp.on( 'finish', () => {
      console.log( `${rsp.statusCode} ${method} ${url}` );
    } );
    next();
});
app.use( bodyParser.json( {
  verify: verifyRequestSignature
} ) );
// ------------------------- LE WEBHOOK / hub.verify_token à CONFIGURER AVEC LE MEME MOT DE PASSE QUE FB_VERIFY_TOKEN ------------------------
app.get( '/webhook', ( req, res ) => {
  if ( req.query[ 'hub.mode' ] === 'subscribe' && req.query[
      'hub.verify_token' ] === "1.hello@world#" ) {
    res.send( req.query[ 'hub.challenge' ] );
  } else {
    res.sendStatus( 400 );
  }
} );
// ------------------------- LE WEBHOOK / GESTION DES EVENEMENTS ------------------------
app.post( '/webhook', ( req, res ) => {
  const data = req.body;
  if ( data.object === 'page' ) {
    data.entry.forEach( entry => {
      entry.messaging.forEach( event => {
        if ( event.message && !event.message.is_echo ) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession( sender );
          var {
            text,
            attachments,
            quick_reply
          } = event.message;

          function hasValue( obj, key ) {
            return obj.hasOwnProperty( key );
          }
          console.log(JSON.stringify(event.message));
          // -------------------------- MESSAGE IMAGE OU GEOLOCALISATION ----------------------------------
          if (event.message.attachments != null  && typeof event.message.attachments[0] != 'undefined') {
              // envoyer à Wit.ai ici

					}
          // --------------------------- MESSAGE QUICK_REPLIES --------------------
					else if ( hasValue( event.message, "text" ) && hasValue(event.message, "quick_reply" ) ) {
            // envoyer à Wit.ai ici

          }
          // ----------------------------- MESSAGE TEXT ---------------------------
          else if ( hasValue( event.message, "text" ) ) {
			  glob_text=text;
              // envoyer à Wit.ai ici
              wit.message( text, sessions[ sessionId ].context )
                .then( ( {
                  entities
                } ) => {
                  choisir_prochaine_action( sessionId, sessions[
                    sessionId ].context, entities );
                  console.log( 'Yay, on a une response de Wit.ai : ' + JSON.stringify(
                    entities ) );
                } )
                .catch( console.error );
          }
          // ----------------------------------------------------------------------------
          else {
              // envoyer à Wit.ai ici
          }
        }
        // ----------------------------------------------------------------------------
        else if ( event.postback && event.postback.payload ) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession( sender );
            // envoyer à Wit.ai ici


          }
        // ----------------------------------------------------------------------------
        else {
          console.log( 'received event : ', JSON.stringify( event ) );
        }
      } );
    } );
  }
  res.sendStatus( 200 );
} );
// ----------------- VERIFICATION SIGNATURE -----------------------
function verifyRequestSignature( req, res, buf ) {
  var signature = req.headers[ "x-hub-signature" ];
  if ( !signature ) {
    console.error( "Couldn't validate the signature." );
  } else {
    var elements = signature.split( '=' );
    var method = elements[ 0 ];
    var signatureHash = elements[ 1 ];
    var expectedHash = crypto.createHmac( 'sha1', FB_APP_SECRET ).update( buf )
      .digest( 'hex' );
    if ( signatureHash != expectedHash ) {
      throw new Error( "Couldn't validate the request signature." );
    }
  }
}
app.listen( PORT );
console.log( 'Listening on :' + PORT + '...' );
