//Math Functions
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function existsInArray(array, item) {
    return array.indexOf(item.toLowerCase()) > -1;
}

var profanity = ["shit", "fuck", "damn", "bitch", "crap", "dick", "pussy", "asshole", "fag", "bastard", "slut", "nigg", "xxx", "porno", "sex" ]
var $ 
var ip;
var timeout;
var threetries = 0; //this variable will be used to make sure getting the weather is retried a maximum of 3 times if it fails
var timesup= 0 // Variable for the overall timer
var hold_city; //This variable simply stores the city the user types when theyre checking for weather. Will be 'undefined' if user doesnt put any city
var request = require('request'); //Module for requesting web pages
var cheerio = require('cheerio'); //Module used for crawling
require("jsdom-no-contextify").env("", function(err, window) { //JQuery module used to make Ajax calls in this app
    if (err) {
        return;
    }

    $ = require("jquery")(window);

});

var weather_flag = false; //Flag which is set to true if user enters a sentence that containes the word 'weather'
var path = require("path");
// require express and create the express app
var express = require("express");
var mongoose = require('mongoose');


if (process.env.APP_CONFIG == undefined){
  //Database use for server
   mongoose.connect('mongodb://localhost/gtchatbot');
  var EntrySchema = new mongoose.Schema({
   category: String,
   value: String
  })
  var Entry = mongoose.model('all_entries', EntrySchema); 
}
else {
  //Database use for localhost
  var config=JSON.parse(process.env.APP_CONFIG);
var mongoPassword = 'Arthurmide98';
mongoose.connect("mongodb://" + config.mongo.user + ":" + mongoPassword + "@" +config.mongo.hostString);
var EntrySchema = new mongoose.Schema({
 category: String,
 value: String
})
var Entry = mongoose.model('all_entries', EntrySchema);
}


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

//The url below is used to add categories and values to the chatbot. It als contains all the categories and values for them to be edited or deleted
app.get('/add_to_bot', function(req, res) {
  Entry.find({}, function (err, entries){
        // loads a view called 'user.ejs' and passed the user object to the view!
        res.render('add_to_bot', {entries, entries});
    }).sort({_id:-1})
 
})
//Send data to the url below in order to add a new entry (category and a value)
app.post('/make_entry', function(req, res) {
  var newEntry = new Entry({category: req.body.category, value: req.body.value});
    // try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    newEntry.save(function(err) {
        res.redirect('/');
      
    })
})
//Send data to the url below to update an entry (either category or value). The data is sent with AJAX so it doesn't refresh the page
app.post('/update_entry', function(req, res) {
  Entry.update({category: req.body.old_category}, {category: req.body.new_category, value: req.body.new_value}, function (err, entry){
        res.redirect('/');
    })
})
//Send data to the url below to remove an entry. The data is sent with AJAX so it doesn't refresh the page
app.post('/remove_entry', function(req, res) {
  Entry.remove({category: req.body.category}, function (err, user){
    res.redirect('/');
})
})
//This is the page where the Habari Oracle is contained
app.get('/chatInterface', function(req, res) {
 res.render('chat');
})
//process.env.PORT will use the browsers port
var server = app.listen(process.env.PORT || 8000, function() {
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
      setTimeout(function () {socket.emit('server_response', {response: "Feel free to ask any more questions about the Habari kingdom."});}, 2000);
    }
    else if(selector == 2){
      setTimeout(function () {socket.emit('server_response', {response: "More questions about the Habari kingdom? Feel free to ask."});}, 2000);
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
    socket.emit('server_response', {response: "Habari's a virtual platform that connects people with shared interests and enables them to discover new interests. You can interact with friends, create Tribes and populate them, share information and grow within the Habari Kingdom. Become a Prince or Princess and have a shot at becoming a Habari ruler and get the title, perks and a chance to sit on a real Habari throne. Trade to earn gold coins, which can be redeemed for cool stuff! Make monetary transactions and payments from here to your real world contacts and merchants."});
  })
  socket.on("about_villages", function (data){
    socket.emit('server_response', {response: "That's known as a Village. A Village is a private group of a large number of people with similar interests or a common idea."});
  })
  socket.on("about_clans", function (data){
    socket.emit('server_response', {response: "A Clan is a small group of people. A Clan name cannot be changed. Once the population of a Clan exceeds a certain limit, the Clan becomes a Village or Tribe."});
  })
//The function below is used to get weather for either 'today' or 'tomorrow'

function getweather (day, location) {
  //This first request is used to get the ip address, location and lat & long of the user.
  //It will most likely be changed as this will not get the users location on a phone.
  $.getJSON('http://ipinfo.io', function(dataA){
    //Once the lat & long have been received, another request is made to a weather API so we can get the weather
    //for the specific location for the specific day
    var make_url
    if (location == undefined){ //If no location is specified, then the users current location will be sent
      make_url = "http://api.worldweatheronline.com/premium/v1/weather.ashx?key=6006e6a4d1d04af096370049171907&q="+dataA.loc+"&includelocation=yes&date="+day+"&tp=3&num_of_days=2&format=json"
    }
    else { //if there is a location specified, it will be used
      make_url = "http://api.worldweatheronline.com/premium/v1/weather.ashx?key=6006e6a4d1d04af096370049171907&q="+location+"&includelocation=yes&date="+day+"&tp=3&num_of_days=2&format=json"
    }

    //Here, the ajax call is sent to the API
    $.ajax({
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      //dataA.loc is where the location of the user goes
      url: make_url,
      success: function(data) {
        if (data.data.nearest_area != undefined){
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
        }
        else {
          socket.emit('server_response', {response: "I'm not sure I recognize that location&#9785; &#65039; Could you try somewhere else?"}); //Send this message if the weather wasn't retrievable
        }
      },
      error: function(err){
        //If we can an error with getting the weather, we will try again three times
        if (threetries < 4){
          getweather (day, location);
        }
        //If there is still no weather after the three tries, then we send this message.
        else if(threetries >= 4){
          socket.emit('server_response', {response: "Oh no, something went wrong&#9785; &#65039; I was unable to get the weather."});
        }
        threetries += 1;
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
    request({url: 'https://www.duckduckgo.com/html/?q='+encodeURIComponent(search_query).split("%20").join("+"), timeout: 6000}, function (error, response, html) { //This function first gets the request
      if (response == undefined){
        socket.emit('server_response', {response: ""});
        return;
      }
      var che = cheerio.load(html); // The cheerio node module is then responsible for parsing, loading and crawling through the HTML of the requested page. It works just as JQuery
      //Basically, the 'che' variable is the same as the dollar sign ($) in JQuery

      var iteration; //This variable is the index of the iteration of a certain array.

      che('#zero_click_abstract').each(function(i, element){ //This function loops through the "zero_click_abstract" element, which is located in the HTML gotten from the DuckDuckGo search. There will most likely only be one "zero_click_abstract" NOTE!!! is there is ever an error with this section, the simple solution would be to print out the html received from duckduckgo by doing console.log(html) and checking if the ID/Class name has been changed

        for (iteration in che(this).text().split("  ")){ //For some reason, The text content of the "zero_click_abstract" element and some other HTML elements from the returned search query contain numberous spaces and newlines
        //This for loop there splits the text by double spaces in attempt to access the main text 
          if(!che(this).text().split("  ")[iteration].startsWith("\n") && !che(this).text().split("  ")[iteration].startsWith(" ") && che(this).text().split("  ")[iteration]){ //This if statement then checks each item in the newly created array to find the first bit of text that doesnt start with a space or new line
            description_array.push(che(this).text().split("  ")[iteration]);//Once the text is found, it is pushed into the 'description_array' array.
            socket.emit('didyoumean', {response: "<div class='chatbot'><p class='chatbotspan'>"+description_array[0]+"<br></p></div>"});
            break;
          }
        }
      })
      //The if statement below checks to see if the 'description_array' is empty
      if (description_array.length == 0){ //In a situation where there is no 'zero click' information returned, the description array will be empty at this point.
        //So therefore, the first link and description gotten from the search are sent to the user.
      //NOTE!!! is there is ever an error with this section, the simple solution would be to print out the html received from duckduckgo by doing console.log(html) and checking if the ID/Class name has been changed
        if (che('.web-result .result__snippet').first().attr('href') == undefined){
          socket.emit('server_response', {response: "Couldnt find what you're looking for lol"});
        }
        else{
          socket.emit('didyoumean', {response: "<a href='"+decodeURIComponent(che('.web-result .result__snippet').first().attr('href').split("g=")[1])+"'><div class='chatbot'><p class='chatbotspan'>"+che('.web-result .result__snippet').first().text()+"<span style='color: #824F5D'> click for more</span><br></p></div></a>"});
        }
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
        if(dataA.reason.split(" ")[indexA].toLowerCase().indexOf(profanity[indexB]) != -1 ){  //If there are any curse words, the profanity flag will be set to true.
          profanity_flag = true;
        }
      }
    }
    //This variable is a random number that is used for the 'Chooser' function
    var selector = getRandomInt(0,4);

    //If the profanity flag is set, then the bot simply sends this text to the user
    if (profanity_flag){
      socket.emit('server_response', {response: "Watch your language please&#x1f64a;"});
    }
    //if the flag is not set, then all the text is sent to Wit.ai to determine which category it falls under
    // The if statement below is used to determine whether or not the user needs weather info
    else if(dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("weather") || weather_flag == true){ //Check if the users text contains the word 'weather'
    //The above if statement will be true if the sentence conatins 'weather' or if the weather flag is still set to true. 
      
      client.message(dataA.reason, {})
      .then((data) => {

        
        if (weather_flag == false){//If the weather flag is false, which means the user is just asking about weather, we check if the have specified a day
          if(dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("today")) { //If the user has specififed to get weather for today, the getweather function will be ran
            if(data.entities.location != undefined){
              if (data.entities.location[0].value.split(" ").length <= 2 && data.entities.location[0].value.split(" ").length >= 1){
                socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
                getweather("today", data.entities.location[0].value.replace(" ", ","));
                threetries = 0;
              }
            // else {
            //   getweather("today", data.entities.location[0].value.replace(" ", ","));
            // }
            }
            else{
              socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
              getweather("today")
              threetries = 0;
            }
            
            
          }
          else if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("tomorrow")) {//If the user has specififed to get weather for tomorrow, the getweather function will be ran
            if(data.entities.location != undefined){
              if (data.entities.location[0].value.split(" ").length <= 2 && data.entities.location[0].value.split(" ").length >= 1){
                socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
                getweather("tomorrow", data.entities.location[0].value.replace(" ", ","));
                threetries = 0;
              }
            // else {
            //   getweather("today", data.entities.location[0].value.replace(" ", ","));
            // }
            }
            else{
              socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
              getweather("tomorrow");
              threetries = 0;
            }
          }
          else {//If the user hasn't specified the day, the chatbot will ask them which day they want the weather for
            weather_flag = true;          
            if(data.entities.location != undefined){
              socket.emit('server_response', {response: "Weather in "+data.entities.location[0].value+" for today or tomorrow?&#129300;"});
              hold_city = data.entities.location[0].value
            }
            else {
              socket.emit('server_response', {response: "Weather for today or tomorrow?&#129300;"});
            }
          }
        }
        //if the weather flag is already active, then the bot will simply check to see if the user's sentence contains 'today' or 'tomorrow'
        else if (weather_flag == true){
          if (hold_city != undefined){
            if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("today")){
              socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
              getweather("today", hold_city.replace(" ", ","));
              threetries = 0; //this variable will be used to make sure getting the weather is retried a maximum of 3 times if it fails
              weather_flag = false
              hold_city = undefined
            }
            else if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("tomorrow")){
              socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
              getweather("tomorrow", hold_city.replace(" ", ","));
              threetries = 0; //this variable will be used to make sure getting the weather is retried a maximum of 3 times if it fails
              weather_flag = false
              hold_city = undefined
            }
            else{
              weather_flag = false
            }
          }
          else {
            if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("today")){
              socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
              getweather("today");
              threetries = 0; //this variable will be used to make sure getting the weather is retried a maximum of 3 times if it fails
              weather_flag = false
            }
            else if (dataA.reason.toLowerCase().replace(/['?!]/g, "").includes("tomorrow")){
              socket.emit('server_response', {response: "Give me one quick second while i get that for you&#128591"});
              getweather("tomorrow");
              threetries = 0; //this variable will be used to make sure getting the weather is retried a maximum of 3 times if it fails
              weather_flag = false
            }
            else{
              weather_flag = false
            }
          }
        }
      })
      
    }
    else {
      client.message(dataA.reason, {})
      .then((data) => {
            //Request has 10 seconds to complete
            //This statement checks to see if the user asked a 'friendly question' towards the habari bot, such as "how is your day going?"
            if ('friendly_question' in data.entities ){
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
            
            //If the entity returned by Wit is "oracle_info", that means the user has asked a question specifically about the habari bot, such as "how old are you?"
            else if('oracle_info' in data.entities){
              //The value of the entity is then checked to know the specific response to give.
              if (data.entities.oracle_info[0].value == "name") {
                socket.emit('server_response', {response: "My name is Hekima"});
              }
              else if (data.entities.oracle_info[0].value == "age") {
                socket.emit('server_response', {response: "My age is actually unknown&#129300;"});
              }
              else if (data.entities.oracle_info[0].value == "place_of_birth") {
                socket.emit('server_response', {response: "I'm from South Africa, but my parents are Nigerians&#128524"});
              }
            }
            //If the user entered in a greeting such as "hello" or "hey", this response is sent back to them
            else if ("greetings" in data.entities){
              socket.emit('server_response', {response: "Hello, What do you need help with?"});
            }
            //Now, the statement below is executed if Wit.ai doesn't return any response. This will be the case if the user
            //is not asking the bot anything habari specific or direct personal questions to the bot itself
            else if ($.inArray("intent", Object.keys(data.entities)) == -1){
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
                        // clearTimeout(timesup);

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
            else if($.inArray("intent", Object.keys(data.entities)) != -1 || Object.keys(data.entities) == "intent"){
              var ind
              //Detailed explanation: The database used in the project is MongoDB, which is ideal for NodeJS apps;
              //The collection used below is the 'entry' collection. It has two columns: category & value.
              //The category column is the column which must match the category that you have specified in Wit.ai
              //or whatever translation api you have used. It is also recommended to use underscores in place of spaces.
              //The value column will be whatever you want the bot to send back to the user. You may notice that
              //in this projects database, some value columns start with '<span>' or '<img>'. This is because
              //the value contains an image that will be sent to the user as well as text. You may also notice words like '&#x61736'
              //These words are unicode for Emojis and you can google more info on them.
              Entry.find({},function (err, entry){ //This function will get every single entry from our database
                  for (ind in entry){ //This for loop will loop through each funciton
                    if (entry[ind].category == data.entities.intent[0].value){  //This if statement will then check to see if the category is the same as the one which Wit.ai has returned back after analyzing the users text
                      clearTimeout(timesup);
                      socket.emit('server_response', {response: entry[ind].value}); //It will then send the value you have specified for that category back to the user through the Bot.
                      chooser(selector)
                      
                    }
                  }
                  // res.render('user', {user: user});
              })
              
            }
    })
    .catch(function(){
      socket.emit('server_response', {response: "I'm a bit tired now, come back in a few moments."});
    })
  }
    
})
})


