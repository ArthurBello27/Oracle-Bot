//Math Functions
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function existsInArray(array, item) {
    return array.indexOf(item.toLowerCase()) > -1;
}
//The following keywords are keywords in regards to information on Habari's main criteria
var keywordsA = ['tribe', 'clan', 'village', 'group', 'kingdom', 'leaderboard', 'kinsman', 'farmer', 'hunter', 'warrior', 'nobleman',
'elder', 'chief', 'prince', 'princess', 'emperor', 'coins', 'badge', 'points', 'moment', 'arena', 'crown', 'challenge', 'playground']

// var keywordsB = ['sign', 'create', ]

// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");
var Typo = require("typo-js");
var dictionary = new Typo("en_US");

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/gtchatbot');
// var UserSchema = new mongoose.Schema({
//  name: String,
//  phone: String,
//  seventhreesevenstatus: Number,
//  userid: Number
// })
// var User = mongoose.model('User', UserSchema);

var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// static content
app.use(express.static(path.join(__dirname, "./static")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );
// root route
app.get('/', function(req, res) {
 res.render('indexpage');
})
app.get('/home', function(req, res) {
 res.render('home');
})

app.get('/chatInterface', function(req, res) {
 res.render('chat');
})

app.get('/action/:id', function(req, res) {
 res.render('action', {id: req.params.id});
})
// app.post('/get_user', function (req, res){
//     console.log('IN get user');
//     console.log("SENT NUMBER: ", req.body);
//     User.findOne({phone: req.body.number}, function (err, user){
//         // loads a view called 'user.ejs' and passed the user object to the view!
//         console.log(user)
//         res.writeHead(200, {'content-type': 'text/json' });
//       	res.write( JSON.stringify(user) );
//       	res.end('\n');

//         // res.render('user', {user: user});
//     })
    
// })
// app.post('/make_user', function(req, res) {
// 	console.log("POST DATA", req.body);
// 	var user = new User({name: req.body.name, phone: req.body.phone, seventhreesevenstatus: req.body.seventhreesevenstatus, userid: req.body.userid});
// 	  // try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
// 	  user.save(function(err) {
// 	    // if there is an error console.log that something went wrong!
// 	    if(err) {
// 	      console.log('something went wrong');
// 	    } else { // else console.log that we did well and then redirect to the root route
// 	      console.log('successfully added a user!');
// 	      res.redirect('/');
// 	    }
// 	  })
// })
// listen on 8000
//process.env.PORT will use the browsers port
var server = app.listen(process.env.PORT || 8000, function() {
 console.log("listening on port 8000");
})

const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'UC2FRHQWCW2LRF34ECB2XEE5S7L7ZJNJ'});

Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
var user;
var io = require('socket.io').listen(server) 
io.sockets.on('connection', function (socket) {
  function chooser(selector){
    if(selector==1){
      setTimeout(function () {socket.emit('server_response', {response: "Feel free to ask any more questions."});}, 2000);
    }
    else if(selector == 2){
      setTimeout(function () {socket.emit('server_response', {response: "More questions? Feel free to ask."});}, 2000);
    }
    else {
      setTimeout(function () {socket.emit('server_response', {response: "You can still ask more questions."});}, 2000);
    }
  }
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  socket.on("about_tribes", function (data){
    socket.emit('server_response', {response: "A tribe is somewhat of an upgraded clan. Once a clan has a certain number of members, it is escalated up to a tribe"});
  })
  socket.on("habari_info", function (data){
    socket.emit('server_response', {response: "Habari is a virtual platform that connects people with shared interests and enables them to discover new interests. Interact with friends, create Tribes and populate them, share information and grow within the Habari Kingdom. Become a Prince or Princess and have a shot at becoming a Habari ruler and get the title, perks and a chance to sit on a real Habari throne. Trade to earn gold coins, which can be redeemed within our virtual world. Make monetary transactions and payments from Habari to your real world contacts and merchants."});
  })
  // socket.on("about_tribes", function (data){
  //   socket.emit('server_response', {response: "A tribe is somewhat of an upgraded clan. Once a clan has a certain number of members, it is escalated up to a tribe"});
  // })
  // socket.on("about_tribes", function (data){
  //   socket.emit('server_response', {response: "A tribe is somewhat of an upgraded clan. Once a clan has a certain number of members, it is escalated up to a tribe"});
  // })
  socket.on("user_sent", function (dataA){
    var selector = getRandomInt(0,3);

    client.message(dataA.reason, {})
    .then((data) => {
      console.log('Yay, got Wit.ai response: ' + Object.keys(data.entities));
      if (Object.size(data.entities) >= 2){
        console.log('Multiple items received ' + Object.keys(data.entities));
        socket.emit('didyoumean', {response: "<div class='chatbot'><p class='chatbotspan'>I didn't quite get that. Did you mean:</p></div>"});
      }
      else {
          if (Object.keys(data.entities) == "greetings"){
            socket.emit('server_response', {response: "Hello, What do you need help with?"});
          }
          else if (Object.size(data.entities) === 0){
            console.log("Zero returned, here's what the user sent", dataA.reason.split(" "));
            var i;
            var j;
            var k;
            var inccorectWordsArray = [];
            var suggestedCorrections = [];
            var completeSuggestions = [];
            var splitarray = dataA.reason.split(" ")
            for (i in splitarray){
              // var array_of_suggestions = dictionary.suggest(i);
              // console.log(dictionary.check(splitarray[i]));
              if (dictionary.check(splitarray[i]) == false){
                inccorectWordsArray.push(splitarray[i])
              }
              // var is_spelled_correctly = dictionary.check("vullage");
              // console.log(is_spelled_correctly);
              // console.log(array_of_suggestions);
              // var x;
              // for (x in array_of_suggestions) {
              //   console.log(existsInArray(keywords, array_of_suggestions[x]));
              // }
            }
            for (i in inccorectWordsArray){
              var array_of_suggestions = dictionary.suggest(inccorectWordsArray[i]);
              for (j in array_of_suggestions){
                for (k in keywordsA){
                  if (array_of_suggestions[j] == keywordsA[k]){
                    suggestedCorrections.push(keywordsA[k])
                  }
                }
              }
              
            }
              if (dataA.reason.toLowerCase().includes("what")){
                for (i in suggestedCorrections){
                  if (suggestedCorrections[i].slice(-1) == "s"){
                    completeSuggestions.push("What are "+ suggestedCorrections[i]);
                  }
                  else if (suggestedCorrections[i][0] == 'a' || suggestedCorrections[i][0] == 'e' || suggestedCorrections[i][0] == 'i' || suggestedCorrections[i][0] == 'o' || suggestedCorrections[i][0] == 'u'){
                    completeSuggestions.push("What is an "+ suggestedCorrections[i]);
                  }
                  else {
                    completeSuggestions.push("What is a "+ suggestedCorrections[i]);
                  }
                }
              }
              else if (dataA.reason.toLowerCase().includes("how")){
                for (i in suggestedCorrections){
                  if (suggestedCorrections[i].slice(-1) == "s"){
                    completeSuggestions.push("How are "+ suggestedCorrections[i]);
                  }
                  else if (suggestedCorrections[i][0] == 'a' || suggestedCorrections[i][0] == 'e' || suggestedCorrections[i][0] == 'i' || suggestedCorrections[i][0] == 'o' || suggestedCorrections[i][0] == 'u'){
                    completeSuggestions.push("How is an "+ suggestedCorrections[i] + " made");
                  }
                  else {
                    completeSuggestions.push("How is a "+ suggestedCorrections[i]+" made");
                  }
                }
              }
              else if (dataA.reason.toLowerCase().includes("when")){
                for (i in suggestedCorrections){
                  if (suggestedCorrections[i].slice(-1) == "s"){
                    completeSuggestions.push("When do "+ suggestedCorrections[i]);
                  }
                  else if (suggestedCorrections[i][0] == 'a' || suggestedCorrections[i][0] == 'e' || suggestedCorrections[i][0] == 'i' || suggestedCorrections[i][0] == 'o' || suggestedCorrections[i][0] == 'u'){
                    completeSuggestions.push("When does an "+ suggestedCorrections[i]);
                  }
                  else {
                    completeSuggestions.push("When does a "+ suggestedCorrections[i]);
                  }
                }
              }
              else if (dataA.reason.toLowerCase().includes("where")){
                for (i in suggestedCorrections){
                  if (suggestedCorrections[i].slice(-1) == "s"){
                    completeSuggestions.push("Where are "+ suggestedCorrections[i]);
                  }
                  else if (suggestedCorrections[i][0] == 'a' || suggestedCorrections[i][0] == 'e' || suggestedCorrections[i][0] == 'i' || suggestedCorrections[i][0] == 'o' || suggestedCorrections[i][0] == 'u'){
                    completeSuggestions.push("Where is an "+ suggestedCorrections[i]);
                  }
                  else {
                    completeSuggestions.push("Where is a "+ suggestedCorrections[i]);
                  }
                }
              }
              else if (dataA.reason.toLowerCase().includes("who")){
                console.log("Suggestion is who");
              }
            console.log(completeSuggestions);
            socket.emit('didyoumean', {response: "<div class='chatbot'><p class='chatbotspan'>I didn't quite get that. Did you mean:</p></div>"});
          }
          else if(Object.keys(data.entities) == "intent"){
            if (data.entities.intent[0].value == "merchant_bot_info"){


              socket.emit('server_response', {response: "All merchants will have BOTs "});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "village_definition"){
              socket.emit('server_response', {response: "<span class='img_span'><img style='width: 80px; margin-bottom: 8px' src='habari_village.png'></span><br>A village is quite similar to a tribe. It is a large community of people with shared interests. The difference is that villages are private and new members can only be added by invitation."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "village_types"){
              socket.emit('server_response', {response: "There are no specific types of villages."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "clan_definition"){
              socket.emit('server_response', {response: "<span class='img_span'><img style='width: 80px; margin-bottom: 8px' src='habari_clan.png'></span><br>Clans are private groups created by users. When creating a clan (group), the admin of the clan must specify a unique name and clan category which cannot be changed"});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "tribe_categories"){
              socket.emit('server_response', {response: "There are currently 13 categories in Habari: Fashion, Health & Fitness, Books, Science, Travel, Sports, News, Politics, DIY(Do It Yourself), Music, Technology, Food & Movies/TV"});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "name_change_info"){
              socket.emit('server_response', {response: "A user cannot change clan name, username, tribe name or village name and certain names are reserved for featured tribes /merchants so users cannot use them during registration e.g. Shoprite, Slot, Guardian News etc."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "verified_tribe"){
              socket.emit('server_response', {response: "A verified tribe is a tribe that is internally managed by Habari."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "featured_tribe"){
              socket.emit('server_response', {response: "Featured tribes are tribes for selected merchants to advertise their products and services. Merchants will pay to be featured as tribes. These merchants can post offers on discounted products also called deals and general information about goods and services offered. Non-profit organization and charities can also be Featured tribes and all Habari users will be allowed to make donations on their pages."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "who_can_use_habari"){
              socket.emit('server_response', {response: "Anyone 13 and above can use Habari"});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "clan-tribe_tribe"){
              socket.emit('server_response', {response: "A clan becomes a tribe after it attains X+ number of members and goes public. Whenever a clan attains the tribe status, members of the parent tribe they fall under will be notified of the change and asked if they’ll like to be part of the new tribe"});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "tribe_definition"){
              socket.emit('server_response', {response: "<span class='img_span'><img style='width: 80px; margin-bottom: 8px' src='habari_tribe.png'></span><br>Tribes are large public community of people that share similar interests, users are introduced to tribes during onboarding and can join more tribes afterwards."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "tribe_types"){
              socket.emit('server_response', {response: "There are 3 types of tribes: verified tribes, 'clan-tribe' tribes and featured tribes."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "habari_info"){
              socket.emit('server_response', {response: "<span class='img_span'><img style='width: 80px; margin-bottom: 8px' src='habari_logo_colored.png'></span><br>Habari is a virtual platform that connects people with shared interests and enables them to discover new interests. Interact with friends, create Tribes and populate them, share information and grow within the Habari Kingdom. Become a Prince or Princess and have a shot at becoming a Habari ruler and get the title, perks and a chance to sit on a real Habari throne. Trade to earn gold coins, which can be redeemed within our virtual world. Make monetary transactions and payments from Habari to your real world contacts and merchants."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "habari_benefits"){
              socket.emit('server_response', {response: "<ul><li>Habari offers a wide range of benefits such as: <br>Discounts on all merchant deals</li><li>Rewards with Habari Gold Coins and no charges for transactions on Habari</li><li>Individual and business marketing</li><li>Fun and engaging one stop platform for socializing, ecommerce, gaming, business and news. </li> </ul>", reason: "hb"});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "merchant_tribe_post_info"){
              socket.emit('server_response', {response: "Merchant and Verified tribes’ posts are controlled, only an admin can post in these tribes. Followers can only like, share, comment and or buy posts. While ‘clan - tribe’ tribes have the option to enable or disable post by tribe members."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "who_can_create_tribes"){
              socket.emit('server_response', {response: "A tribe can be created by Habari Admin and, existing clans with X number of active members can rise to become a tribe."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "habari_functions"){
              socket.emit('server_response', {response: "Habari's core functions are individual/corporate bloging, video/audio chatting, music listening, requesting/sending money & purchasing discounted items "});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "multiple_device_info"){
              socket.emit('server_response', {response: "Multiple device login will be allowed with phone number authentication."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "clan_lifespan_info"){
              socket.emit('server_response', {response: "Clans will have expiry dates, after which if there’s no activity and several notifications sent to the admin of the clan, it will be deleted."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "clan_deletion_info"){
              socket.emit('server_response', {response: "Clans can be deleted by their admin but tribes cannot be deleted."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "clan_creation_info"){
              socket.emit('server_response', {response: "Users cannot create a clan with an existing clan or tribe name."});
              chooser(selector)
            }
            else if (data.entities.intent[0].value == "village_tribe_difference_info"){
              socket.emit('server_response', {response: "A village is a private tribe where members join by invitation unlike a tribe which is public and anyone can join. Going public makes it faster for a transitioned clan to get discovered and grow to have more followers as users can easily search and add themselves to the tribe instead of requesting to be added."});
              chooser(selector)
            }
          }
        }
      
    })
    .catch(console.error);
    
})
})