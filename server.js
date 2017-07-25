//Math Functions
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function existsInArray(array, item) {
    return array.indexOf(item.toLowerCase()) > -1;
}

var profanity = ["shit", "fuck", "damn", "bitch", "crap", "dick", "cock", "pussy", "asshole", "fag", "bastard", "slut" ]
var $ 
var ip;
var request = require('request'); //Module for requesting web pages
var cheerio = require('cheerio'); //Module used for crawling
require("jsdom-no-contextify").env("", function(err, window) { //JQuery module used to make Ajax calls in this app
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);

});

var weather_flag = false; //Flag which is set to true if user enters a sentence that containes the word 'weatehr'
var path = require("path");
// require express and create the express app
var express = require("express");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
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
      setTimeout(function () {socket.emit('server_response', {response: "Anything else? Feel free to ask."});}, 2000);
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

//The function below is used to crawl search engines. It is currently specified to currently crawl DuckDuckGo.com on request
//The previously usde search engine was Google.
//The function takes the users query and passes it into DuckDuckGo. From there, the results page from DuckDuckGo
//is crawled through and then 'Zero click info' on the topic is passed back to the user if it available for the topic.
//If it isn't then the first result is sent back to the user.
function crawl_google(search_query){
    var description_array = []; //This variable holds the text of the information that will be returned to the user
    request('https://www.duckduckgo.com/html/?q='+encodeURIComponent(search_query).split("%20").join("+"), function (error, response, html) { //This function first gets the request
      var che = cheerio.load(html); // The cheerio node module is then responsible for parsing, loading and crawling through the HTML of the requested page. It works just as JQuery
      //Basically, the 'che' variable is the same as the dollar sign ($) in JQuery
      var iteration; //This variable is the index of the iteration of a certain array.

      che('#zero_click_abstract').each(function(i, element){ //This function loops through the "zero_click_abstract" element, which is located in the HTML gotten from the DuckDuckGo search. There will most likely only be one "zero_click_abstract"

        for (iteration in che(this).text().split("  ")){ //For some reason, The text content of the "zero_click_abstract" element and some other HTML elements from the returned search query contain numberous spaces and newlines
        //This for loop there splits the text by double spaces in attempt to access the main text
          if(!che(this).text().split("  ")[iteration].startsWith("\n") && !che(this).text().split("  ")[iteration].startsWith(" ") && che(this).text().split("  ")[iteration]){ //This if statement then checks each item in the newly created array to find the first bit of text that doesnt start with a space or new line
            description_array.push(che(this).text().split("  ")[iteration]);//Once the text is found, it is pushed into the 'description_array' array.
            socket.emit('didyoumean', {response: "<div class='chatbot'><p class='chatbotspan'>"+description_array[0]+"<br><span style='font-size:10px;'>Search Powered by DuckDuckGo <img style='width: 13px' src='DuckDuckGo_Logo.svg.png'></span></p></div>"});
            break;
          }
        }
      })
      //The if statement below checks to see if the 'description_array' is empty
      if (description_array.length == 0){ //In a situation where there is no 'zero click' information returned, the description array will be empty at this point.
        //So therefore, the first link and description gotten from the search are sent to the user.
        socket.emit('didyoumean', {response: "<a href='"+decodeURIComponent(che('.web-result .result__snippet').first().attr('href').split("g=")[1])+"'><div class='chatbot'><p class='chatbotspan'>"+che('.web-result .result__snippet').first().text()+"<span style='color: #824F5D'> click for more</span><br><span style='font-size:10px;'>Search Powered by DuckDuckGo <img style='width: 13px' src='DuckDuckGo_Logo.svg.png'></span></p></div></a>"});
      }
    });
      
}
  //This is used to capture any text that the user sends from the input box.
  socket.on("user_sent", function (dataA){
    var indexA;
    var indexB;
    var profanity_flag = false //This profanity flag is used to check if there are any curse words in the users text.
    for (indexA in dataA.reason.split(" ")){
      for (indexB in profanity){
        if(dataA.reason.split(" ")[indexA].indexOf(profanity[indexB]) != -1 ){  //If there are any curse words, the profanity flag will be set to true.
          profanity_flag = true;
        }
      }
    }
    //This variable is a random number that is used for the 'Chooser' function
    var selector = getRandomInt(0,4);
    //If the profanity flag is set, then the bot simply sends this text to the user
    if (profanity_flag){
      socket.emit('server_response', {response: "Watch your language LOL"});
    }
    //if the flag is not set, then all the text is sent to Wit.ai to determine which category it falls under
    else {
      client.message(dataA.reason, {})
      .then((data) => {
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
              //if the weather flag is already active, then the bot will simply check to see if the user's sentence contains 'today' or 'tomorrow'
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
            //If the user entered in a greeting such as "hello" or "hey", this response is sent back to them
            else if (Object.keys(data.entities) == "greetings"){
              socket.emit('server_response', {response: "Hello, What do you need help with?"});
            }
            //If the entity returned by Wit is "oracle_info", that means the user has asked a question specifically about the habari bot, such as "how old are you?"
            else if('oracle_info' in data.entities){
              //The value of the entity is then checked to know the specific response to give.
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
            //This statement checks to see if the user asked a 'friendly question' towards the habari bot, such as "how is your day going?"
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
            //Now, the statement below is executed if Wit.ai doesn't return any response. This will be the case if the user
            //is not asking the bot anything habari specific or direct personal questions to the bot itself
            else if (Object.size(data.entities) === 0){
                  //An XMLHttpRequest is made to Wolfram Aplha's api. This Api is used to answer general questions such as "How tall is the Eiffel Tower?"
                  //Sometimes, the answer provided by the api doesn't make sense E.g in a case where a user types "LL Cool J", the api also returns "LL Cool J"
                  //as the answer. Answers like this have been filtered out in the function below
                  var xhttp = new XMLHttpRequest();
                  xhttp.onreadystatechange = function() {
                    if ((this.readyState == 4 && this.status != 200)) { //If the response isn't "succesful", we send the query to the Google/DuckDuckGo Crawler
                      crawl_google(dataA.reason);
                    }
                    else if (this.readyState == 4 && this.status == 200) { //If the response is succesful we don't yet send it to the user. we filter first
                      if (dataA.reason.toLowerCase().includes(this.responseText.toLowerCase()) && this.responseText.split(" ").length <= 5){ //Based on the pattern of responses I saw from the api, this if statemnt correctly filters 
                      //out issues with the api returning the question as the answer and simply sends the request to the Crawler
                        crawl_google(dataA.reason); 
                      }
                      else if ((this.responseText.split(" ").length >= 3 || !isNaN(this.responseText.split(" ")[0])) && (this.responseText.indexOf("word definition") == -1)){ //This if statement also filters out based on patterns I noticed. 
                      //If the statement is true, that means a meaningful and most likely correct response was sent bacl. It is then sent to the user.
                        socket.emit('server_response', {response: this.responseText});
                        chooser(selector)//call the chooser function to ask the user if he/she has any more questions or such.
                      }
                      else {//If the call doesn't get filtered into the "correct response" section, it is sent to the Crawler 
                        crawl_google(dataA.reason);
                      }
                    }
                  }
                  xhttp.open("GET", "http://api.wolframalpha.com/v1/result?appid=8TL836-JTYAY4L5JE&i="+encodeURIComponent(dataA.reason).split("%20").join("+"), true);
                  xhttp.send();
              
            }
            //This section houses all the available answers to questions on anything habari related. The entity is labelled as intent. We can basically take "intent" to mean "Habari App info" in a theoretical sense.
            //All the values and entities used are must be the same as those specified in Wit.ai
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
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='kinsman.png'></span><br>This is an entry level title for a user who has successfully created an account and rewarded with 100 pts. 0 - 4,000 Points"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "farmer_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='farmer.png'></span><br>A Farmer is a Kinsman who has earned additional 5,000 points. 4,000 - 9,000 Points"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "hunter_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='hunter.png'></span><br>A Hunter is a Farmer who has earned additional 6,000 points. 9,000 - 15,000 Points"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "warrior_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='warrior.png'></span><br>A Warrior is a Hunter who has earned additional 8,000 points. 15,000 - 23,000 Points"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "elder_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='warrior.png'></span><br>An Elder is a Nobleman who has earned additional 15,000 points. 33,000 - 48,000 Points "});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "chief_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='chief.png'></span><br>A Chief is an Elder who has earned additional 22,000 points. 48,000 - 70,000 Points"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "prince_princess_definition"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='prince.png'></span><br>A Prince/Princess is a Chief who has earned additional 30,000 points. >=70,000 Points"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "habari_point_system"){
                socket.emit('server_response', {response: "The point system in Habari allows users in move between the different hierarchies. Points are background activity based rewards that allows users to move in hierarchy. Every user has a point meter system to track their hierarchy progression in the Habari kingdom"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "emperor_defintion"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='emperor.png'></span><br>This is the highest title in the Habari Kingdom, it is a competitive title as there can be only one emperor at any given time who can be dethroned by any of the existing prince or princesses with a minimum of 100,000 HGC and an additional 5,000 points more than the reigning emperor. Some of the perks of being Emperor are:<br>Weekly airtime<br>Instant gifts (promotional items, physical gold coins, lapel pins)<br>Exclusive parties<br>Points<br>Habari Gold Coins<br>Merchant sponsored prizes"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "habari_coins_defintion"){
                socket.emit('server_response', {response: "<span class='img_span'><img style='width: 120px; margin-bottom: 8px' src='habari coin front.png'><img style='width: 120px; margin-bottom: 8px' src='habari coin back.png'></span><br>HGC(Habari Gold Coins) are activity and transaction based virtual currencies and rewards with a limited amount available for in-app purchases at discounted prices."});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "how_to_earn_coins"){
                socket.emit('server_response', {response: "Coins can be earned in various ways:<br>1. By going up in the Habari hierarchy<br>2. Performing card transactions |   &#8358;0 to &#8358;500 airtime = 2,000 HGC, > &#8358;500 = 5,000 HGC and transfers = 10,000 HGC.<br>3. Transfer of HGC among users within Habari<br>4. Playing and winning different Habari games<br>5. Earning the Don badge. Don badge = 3000 HGC<br>6. Bonus HGC can also be given randomly to users on a certain hierarchy. For example, there can be a promo where all warriors are rewarded with X HGC"});
                chooser(selector)
              }
              else if (data.entities.intent[0].value == "how_to_earn_points"){
                socket.emit('server_response', {response: "Points can be earned through the following ways:<br>Onboarding - 100 points<br>Adding a profile picture for the first time - 5 points<br>Updating status for the first time - 5 points<br>Adding a card for the first time - 50 points<br>Adding a friend - 0.5 points<br>Create a group with more than 3 people existing for over 72 hours - 10 points<br>Join a tribe - 1 point"});
                chooser(selector)
              }
            }
      
    })
    .catch(console.error);
  }
    
})
})