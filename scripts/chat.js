//---------------------------------------------------------------------
//Everything related to chat and sending text messages is in this file.
//---------------------------------------------------------------------

//All chat text stored here.
var chatLog = [];

function activateChat () {

  //Outline for text box while user is typing
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.strokeRect(5 + FRAME_OF_REFERENCE[0], canvas.height - 26 + FRAME_OF_REFERENCE[1], canvas.width - 210, 20);

  //Text displayed while user is typing
  ctx.fillStyle = "#FFF";
  ctx.shadowBlur = 10;
  ctx.fillText(str.slice(str.length - 50, str.length), 10 + FRAME_OF_REFERENCE[0], canvas.height - 10 + FRAME_OF_REFERENCE[1]);
  ctx.shadowBlur = 0;
}
function submitChat (personSpeaking) {

  if (str.length > 0) {

    //Push text to beginning of history
    strHistory.unshift(str);

    //Default -1, it's changed on keypress so index -1 is never searched for
    indexHistory = -1;

    //Keeps a maximum of 10 logs
    if (strHistory.length > 10) {

      strHistory = strHistory.slice(0, 10);
    }

    //In-game Dev-Tools
    checkDevCommands();

    //If not dev command
    if (str.length > 0) {

      //Text, Ypos, age of text, user who submitted
      chatLog.push([" " + str, 16, 0, personSpeaking]);

      //Increase Ypos of text on left of screen.
      for (var i = 0; i < chatLog.length; i++) { chatLog[i][1] += 20; }
    }
  }

  str = "";
}
function displayChat () {

  ctx.strokeStyle = "#000";

  //Text above player
  if (chatLog.length > 0) {

    //Max text bubble width;
    var maxBubbleWidth = 200;

    var currentMessage = chatLog[chatLog.length - 1];

    //Text box dimensions.
    var textBoxWidth = ctx.measureText(currentMessage[0]).width + 5;
    if (textBoxWidth > maxBubbleWidth)
      textBoxWidth = maxBubbleWidth;

    //this return an array of each lines to print, is used here because the number of lines is needed
    //before displaying the text
    var listTextToShow = getWrapedText(currentMessage[0], maxBubbleWidth);
    var numberOfLines = listTextToShow.length;

    var lineHeight = 20;
    var textBoxHeight = lineHeight * numberOfLines;

    //Textbox/Text location
    var textBoxX = playerList[0].X + (playerList[0].width / 2) - (textBoxWidth / 2);
    var textBoxY = playerList[0].Y - 10 - textBoxHeight;

    //White background for text
    ctx.fillStyle = "#DDDDDD";
    ctx.fillRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);

    //Outline for text background
    ctx.lineWidth = 0.7;
    ctx.strokeRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);

    //Text displayed
    ctx.fillStyle = "black";
    for (var i = 0; i < listTextToShow.length; i++) {

      var currentText = listTextToShow[i];
      ctx.fillText(currentText, textBoxX, playerList[0].Y + 6 - textBoxHeight + lineHeight * i);
    }
  }

  //Text on left of screen
  ctx.fillStyle = "#FFF";
  ctx.shadowBlur = 10;
  for (var i = 0; i < chatLog.length; i++) {

    //Display text on left of screen
    ctx.fillText(chatLog[i][3] + ": " + chatLog[i][0], 10 + FRAME_OF_REFERENCE[0], canvas.height - chatLog[i][1] + FRAME_OF_REFERENCE[1]);

    //Increase age of text
    chatLog[i][2]++;

    //Delete text if more than 800 age
    if (chatLog[i][2] > 800) { chatLog.splice(i, 1); }
  }

  ctx.shadowBlur = 0;
}
function checkDevCommands () {

  if (str.search("/") == 0) {

    if (str.search("/spawnRate") == 0) {

      str = str.slice(11, str.length);

      generateEnemies = setInterval(function() { if (screenType == "GAME_SCREEN" && (enemies_remaining_in_realm - enemyList.length) > 0) { spawnEnemy(); } } , parseInt(str));

      console.log("Spawning enemies every: " + (parseInt(str) / 1000) + " seconds.");
    }
    else if (str.search("/godMode") == 0) { playerList[0].MAX_HP = 9999999; playerList[0].HP = 9999999; }
    else if (str.search("/levelUp") == 0) { playerList[0].levelUP(); playerList[0].EXP = 0; }
    else if (str.search("/level") == 0) {

      str = str.slice(7, str.length);

      for (var i = playerList[0].level; i < parseInt(str); i++) { playerList[0].levelUP(); }
    }
    else if (str.search("/kill all") == 0) { enemyList = []; }
    else if (str.search("/reset xy") == 0) {

      playerList[0].X = 4000;
      playerList[0].Y = 4000;
    }
    else if (str.search("/clearAll") == 0) {

      //Makes sure is empty
      enemies_remaining_in_realm = 100;
      lootBagList = [];
      portalList = [];
      enemyList = [];
      bulletList = [];
      enemyBulletList = [];
    }
    else if (str.search("/renderRange") == 0) {

      str = str.slice(13, str.length);
      console.log("Current renderRange: " + (renderRange / tileSize)) + " tiles";

      if (parseInt(str)) { renderRange = parseInt(str) * tileSize; }
    }
    else {

      str = "Command not found!";
      return;
    }

    //Clear chat
    str = "";
  }
}
function getWrapedText(text, maxWidth) {

  var arr = [];
  var currentLine = '';

  //Loop through text passed
  for (var i = 0; i < text.length; i++) {

    var lineTest = currentLine + text.charAt(i) + '';
    var lineWidth = ctx.measureText(lineTest).width;

    //Once text in line is >= max line width
    if (lineWidth > maxWidth - 5) {

      //Add - if a word is being broken
      if (text.charAt(i) !== " ") { currentLine += "-" ; }

      //Push line to array
      arr.push(currentLine);

      //Start new line
      currentLine = " " + text.charAt(i);
    }
    else {

      currentLine = lineTest;
    }
  }

  //Push line to array
  arr.push(currentLine);

  return arr;
}

//-----------------------------
//End file
//-----------------------------
