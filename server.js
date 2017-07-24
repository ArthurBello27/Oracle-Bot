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
var keywordsA = ['tribe', 'tribes', 'clans', 'clan', 'village', 'villages', 'group', 'groups', 'kingdoms', 'kingdom', 'leaderboards', 'leaderboard', 'kinsman', 'farmer', 'hunter', 'warrior', 'nobleman',
'elder', 'chief', 'prince', 'princess', 'emperor', 'coins', 'badge', 'points', 'moment', 'arena', 'crown', 'challenge', 'playground']
var profanity = ["shit", "fuck", "damn", "bitch", "crap", "dick", "cock", "pussy", "asshole", "fag", "bastard", "slut" ]
// var $ 
var ip;
var request = require('request');
var cheerio = require('cheerio');
require("jsdom-no-contextify").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);

});
// require the path module
var weather_flag = false; //Flag which is set to true if user enters a sentence that containes the word 'weatehr'
var path = require("path");
// var navigator = require("navigator");
// require express and create the express app
var express = require("express");
var Typo = require("typo-js");  //Node module for catching typos
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
var dictionary = new Typo("en_US"); //Dictionary for the typo module

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

//This is the page where the Habari Oracle is contained
app.get('/chatInterface', function(req, res) {
 res.render('chat');
})

app.get('/action/:id', function(req, res) {
 res.render('action', {id: req.params.id});
})
//process.env.PORT will use the browsers port
var server = app.listen(process.env.PORT || 8000, function() {
 console.log("listening on port 8000");
 // navigator.geolocation.getCurrentPosition(function(location) {

 //          console.log(location.coords.latitude);
 //          console.log(location.coords.longitude);
 //          console.log(location.coords.accuracy);
        
 //        });
})

//Constants for WIT ai
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'UC2FRHQWCW2LRF34ECB2XEE5S7L7ZJNJ'});

//New Object function used to determine the size of an object
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

  //The function below is a selector to randomly choose the sentece that is sent to the user after their question has been answered.
  //They all have a 2 second delay
  function chooser(selector){
    if(selector==1){
      setTimeout(function () {socket.emit('server_response', {response: "Feel free to ask any more questions."});}, 2000);
    }
    else if(selector == 2){
      setTimeout(function () {socket.emit('server_response', {response: "More questions? Feel free to ask."});}, 2000);
    }
    else if(selector == 3){
      setTimeout(function () {socket.emit('server_response', {response: "Anythign else? Feel free to ask."});}, 2000);
    }
    else {
      setTimeout(function () {socket.emit('server_response', {response: "You can still ask more questions."});}, 2000);
    }
  }
  //The *insert number here* socket catches below are used to receive the emits from the option buttons used to 
  //'find out something new' on the Habari Oracle 
  socket.on("about_tribes", function (data){
    socket.emit('server_response', {response: "That's a Tribe! A Tribe is somewhat of an upgraded Clan. Once a clan has a certain number of members, it is escalated up to a tribe"});
  })
  socket.on("habari_info", function (data){
    socket.emit('server_response', {response: "So you want to know about me huh? Well i'm Habari, a virtual platform that connects people with shared interests and enables them to discover new interests. You can interact with friends, create Tribes and populate them, share information and grow within the Habari Kingdom. Become a Prince or Princess and have a shot at becoming a Habari ruler and get the title, perks and a chance to sit on a real Habari throne. Trade to earn gold coins, which can be redeemed for cool stuff! Make monetary transactions and payments from here to your real world contacts and merchants."});
  })
  socket.on("about_villages", function (data){
    socket.emit('server_response', {response: "That's known as a Village. A Village is a private group of a large number of people with similar interests or a common idea."});
  })
  socket.on("about_clans", function (data){
    socket.emit('server_response', {response: "A Clan is a small group of people. A Clan name cannot be changed. Once the population of a Clan exceeds a certain limit, the Clan becomes a Village or Tribe."});
  })
//The function below is used to get weather for either 'today' or 'tomorrow'
function getweather (day) {
  socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});

  //This first request is used to get the ip address, location and lat & long of the user.
  //It will most likely be changed.
  $.getJSON('http://ipinfo.io', function(dataA){
    // console.log(dataA);
    //Once the lat & long have been received, another request is made to a weather API so we can get the weather
    //for the specific location for the specific day
    $.ajax({
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      url: "http://api.worldweatheronline.com/premium/v1/weather.ashx?key=6006e6a4d1d04af096370049171907&q="+dataA.loc+"&includelocation=yes&date="+day+"&tp=3&num_of_days=2&format=json",
      success: function(data) {
        console.log(data)
        if (day == "today"){
          var weather_response = "Here is the weather for "+data.data.nearest_area[0].region[0].value+", "+data.data.nearest_area[0].country[0].value+" "+day+":<br>"
          +"Temperature: "+data.data.current_condition[0].temp_C+"&#176;C but feels like "+data.data.current_condition[0].FeelsLikeC+"&#176;C<br>"
          +"Weather Description: "+data.data.current_condition[0].weatherDesc[0].value;
          socket.emit('server_response', {response: weather_response});
        }
        else {
          var weather_response = "Here is the weather for "+data.data.nearest_area[0].region[0].value+", "+data.data.nearest_area[0].country[0].value+" "+day+":<br>"
          +"There's going to be a high of "+data.data.weather[1].maxtempC+"&#176;C  and a low of "+data.data.weather[1].mintempC+"&#176;C <br> Weather conditions from 9AM: "+data.data.weather[1].hourly[3].weatherDesc[0].value;
          socket.emit('server_response', {response: weather_response});
        }
      },
      error: function(err){
        console.log(err);
      }

    });
  });
}

function crawl_google(search_query){
    var title = []
    var link_array = [];
    var description_array = [];
    request('https://www.google.com/search?q='+encodeURIComponent(search_query).split("%20").join("+"), function (error, response, html) {
      console.log("in crawler")
      console.log(response);
      console.log(error);
      if (!error && response.statusCode == 200) {
        console.log("im supposed to execute")
        // console.log(html)
        var che = cheerio.load(html);
        var count = 0
        var iteration = 0;
        che('a').each(function(i, element){

          if (che(this).attr('href').substring(0, 4) == "/url" && che(this).parent().attr('class') == "r"){
            // console.log(che(this).attr('href').split('&')[0].substring(7))
            if(count < 2 && iteration %2 == 0){
              // console.log(che(this).attr('href').split('&')[0].substring(7))
              link_array.push(che(this).attr('href').split('&')[0].substring(7))
              count+=1;
            }
            iteration +=1
          }
        });
        var count = 0
        var iteration = 0
        che('._sPg,.st').each(function(i, element){
          // console.log("link: ", che(this).text(), "count", count)
          
          if(count < 2 && che(this).text() && iteration%2 == 0){
            // console.log("added link: ", che(this).text())
            description_array.push(che(this).text())
            count+=1;
            
          }
          if(che(this).text()){
            iteration+=1;
          }
          
          
        });
        // console.log(link_array);
        var links_in_anchortags="<br>";
        for (i in link_array){
          links_in_anchortags+= "<a style='text-decoration: none' href='"+link_array[i]+"'><div style='width: 40%; margin: 10px auto; background: white; padding: 10px; '><p style='text-align: center; font-size: 20px; color: black; font-family: Lato;'>"+link_array[i].match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1]+"</p><p style='color: black'>"+description_array[i]+"</p></div></a><br>";
        }
        socket.emit('didyoumean', {response: "<div class='chatbot'><p class='chatbotspan'>Here's what I was able to find for \""+search_query+"\"</p>"+links_in_anchortags+"</div>"});
      }
    });
}
  //This is used to capture any text that the user sends from the input box.
  socket.on("user_sent", function (dataA){
    var indexA;
    var indexB;
    var profanity_flag = false
    for (indexA in dataA.reason.split(" ")){
      for (indexB in profanity){
        if(dataA.reason.split(" ")[indexA].indexOf(profanity[indexB]) != -1 ){
          profanity_flag = true;
        }
      }
    }
    //This variable is a random number that is used for the 'Chooser' function
    var selector = getRandomInt(0,4);
    //All text that is sent from the user to the bot is sent to Wit.ai
    if (profanity_flag){
      socket.emit('server_response', {response: "Watch your language LOL"});
    }
    else {
      client.message(dataA.reason, {})
      .then((data) => {
            if (Object.size(data.entities) >= 2){ 
            }
            // The if statement below is used to determine whether or not the user needs weather info
            if(dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("weather") || weather_flag == true){ //Check if the users text contains the word 'weather'
            //The above if statement will be true if the sentence conatins 'weather' or if the weather flag is still set to true. 
              if (weather_flag == false){//If the weather flag is false, which means the user is just asking about weather, we check if the have specified a day
                if(dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("today")) { //If the user has specififed to get weather for today, the getweather function will be ran
                  getweather("today");
                }
                else if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("tomorrow")) {//If the user has specififed to get weather for tomorrow, the getweather function will be ran
                  getweather("tomorrow");
                }
                else {//If the user hasn't specified the day, the chatbot will ask them which day they want the weather for
                  weather_flag = true;
                  socket.emit('server_response', {response: "Weather for today or tomorrow?&#129300;"});
                }
              }
              //if the
              else if (weather_flag == true){
                
                if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("today")){
                  getweather("today");
                  weather_flag = false
                }
                else if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("tomorrow")){
                  getweather("tomorrow");
                  weather_flag = false
                }
                else{
                  weather_flag = false
                }
              }
              
            }
            else if (Object.keys(data.entities) == "greetings"){
              socket.emit('server_response', {response: "Hello, What do you need help with?"});
            }
            else if('oracle_info' in data.entities){
              if (data.entities.oracle_info[0].value == "name") {
                socket.emit('server_response', {response: "My name is Habari"});
              }
              else if (data.entities.oracle_info[0].value == "age") {
                socket.emit('server_response', {response: "My age is actually unknown&#129300;"});
              }
              else if (data.entities.oracle_info[0].value == "place_of_birth") {
                socket.emit('server_response', {response: "I'm from South Africa, but my parents are Nigerians&#128524"});
              }
            }
            else if ('friendly_question' in data.entities ){
                if (data.entities.friendly_question[0].value == "true_regarding_your_day") {
                  socket.emit('server_response', {response: "My day is wonderful as ever&#127775"});
                }
                else{
                  var selector2 = getRandomInt(0,5);
                  if (selector2 == 1){
                    socket.emit('server_response', {response: "I'm pretty good, thanks&#128513"});
                  }
                  else if (selector2 == 2){
                    socket.emit('server_response', {response: "I feel great today, thanks for asking&#128524"});
                  }
                  else if (selector2 == 3){
                    socket.emit('server_response', {response: "I feel quite awesome today, thanks you&#128513"});
                  }
                  else if (selector2 == 4){
                    socket.emit('server_response', {response: "I'm &#128175, thanks for asking&#128524"});
                  }
                  else {
                    socket.emit('server_response', {response: "I'm all smiles as usual, thanks for asking&#128513"});
                  }
                }
            }
            else if (Object.size(data.entities) === 0){
              console.log("empty wit")
                    var i;
                    var j;
                    var k;
                    var inccorectWordsArray = [];
                    var suggestedCorrections = [];
                    var completeSuggestions = [];
                    var splitarray = dataA.reason.split(" ")
                  var xhttp = new XMLHttpRequest();
                  xhttp.onreadystatechange = function() {
                    if ((this.readyState == 4 && this.status != 200)) {
                      console.log("crawling google")
                      crawl_google(dataA.reason);
                    }
                    else if (this.readyState == 4 && this.status == 200) {
                      if ((this.responseText.split(" ").length >= 3 || !isNaN(this.responseText.split(" ")[0])) && (this.responseText.indexOf("word definition") == -1)){
                        socket.emit('server_response', {response: this.responseText});
                        chooser(selector)
                      }
                      else {  
                        console.log("crawling google")
                        crawl_google(dataA.reason);
                      }
                    }
                  }
                  xhttp.open("GET", "http://api.wolframalpha.com/v1/result?appid=8TL836-JTYAY4L5JE&i="+encodeURIComponent(dataA.reason).split("%20").join("+"), true);
                  xhttp.send();
              
            }
            else if(Object.keys(data.entities) == "intent"){
              if (data.entities.intent[0].value == "merchant_bot_info"){


                socket.emit('server_response', {response: "All merchants will have BOTs "});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "village_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='habari_village.png'></span><br>A village is quite similar to a tribe. It is a large community of people with shared interests. The difference is that villages are private and new members can only be added by invitation."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "village_types"){
                socket.emit('server_response', {response: "There are no specific types of villages."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "clan_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='habari_clan.png'></span><br>Clans are private groups created by users. When creating a clan (group), the admin of the clan must specify a unique name and clan category which cannot be changed"});
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
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='habari_tribe.png'></span><br>Tribes are large public community of people that share similar interests, users are introduced to tribes during onboarding and can join more tribes afterwards."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "tribe_types"){
                socket.emit('server_response', {response: "There are 3 types of tribes: verified tribes, 'clan-tribe' tribes and featured tribes."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "habari_info"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='habari_logo_colored.png'></span><br>Habari is a virtual platform that connects people with shared interests and enables them to discover new interests. Interact with friends, create Tribes and populate them, share information and grow within the Habari Kingdom. Become a Prince or Princess and have a shot at becoming a Habari ruler and get the title, perks and a chance to sit on a real Habari throne. Trade to earn gold coins, which can be redeemed within our virtual world. Make monetary transactions and payments from Habari to your real world contacts and merchants."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "habari_benefits"){
                socket.emit('server_response', {response: "Habari offers a wide range of benefits such as: <br><span style='font-size:30px'>Discounts on all merchant deals</span><br><span style='font-size:30px'>Rewards with Habari Gold Coins and no charges for transactions on Habari</span><br><span style='font-size:30px'>Individual and business marketing</span><br><span style='font-size:30px'>Fun and engaging one stop platform for socializing, ecommerce, gaming, business and news. </span>"});
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
              else if (data.entities.intent[0].value == "types_of_leaderboards"){
                socket.emit('server_response', {response: "The two leaderboards in Habari are Kingdom Leaderboards and Tribe Leaderboards."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "kingdom_leaderboard_definition"){
                socket.emit('server_response', {response: "A Kingdom Leaderboard is place where all of Habari's activities are summarized e.g. total number of prince/princesses in the kingdom, total number of tribes."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "tribe_leaderboard_definition"){
                socket.emit('server_response', {response: "This contains the number of people in a tribe and name of the Tribe leaders i.e. the member of the tribe with the most influence (likes, shares, or comments for user’s posts). Members of tribes will be notified when they have a new tribe’s leader."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "habari_hierarchy_info"){
                socket.emit('server_response', {response: "<img src='kinsman.png' style='width:40px'>Kinsman: 0 - 4,000 Points<br><img src='farmer.png' style='width:40px'>Farmer: >4,000 - 9,000 Points<br><img src='hunter.png' style='width:40px'>Hunter: >9,000 - 15,000 Points<br><img src='warrior.png' style='width:40px'>Warrior: >15,000 - 23,000 Points<br><img src='nobleman.png' style='width:40px'>Nobleman: >23,000 - 33,000 Points<br><img src='elder.png' style='width:40px'>Elder: >33,000 - 48,000 Points<br><img src='chief.png' style='width:40px'>Chief: >48,000 - 70,000 Points<br><img src='prince.png' style='width:40px'>Prince/Princess: >=70,000 Points<br><img src='emperor.png' style='width:40px'>Emperor: Competitive Title"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "kinsman_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='kinsman.png'></span><br>This is an entry level title for a user who has successfully created an account and rewarded with 100 pts."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "farmer_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='farmer.png'></span><br>A Farmer is a Kinsman who has earned additional 5,000 points."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "hunter_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='hunter.png'></span><br>A Hunter is a Farmer who has earned additional 6,000 points."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "warrior_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='warrior.png'></span><br>A Warrior is a Hunter who has earned additional 8,000 points."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "elder_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='warrior.png'></span><br>An Elder is a Noble man who has earned additional 15,000 points."});
                chooser(selector)
              }

            }
      
    })
    .catch(console.error);
  }
    
})
})