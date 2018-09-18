$(function () {
  oChannels = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

  clearAllEntries();
  twitchQueryFromList(0, oChannels);


  for (var i = 1; i <= 10; i++) {
    var sNum = (i < 10) ? "0" + i : "" + i;
    $("#entryDiv" + sNum).click(function (evt) {
      var sEntryNum = evt.target.id.substr(-2, 2);

      if ($("#entryDiv" + sEntryNum).attr("href") == "#") {
        evt.preventDefault();
        $("#entryDiv" + sEntryNum).fadeOut(500);
      }
    });
  }

  $('#searchLink').click(function (evt) {
    evt.preventDefault();
    performChannelSearch();
  });

  //When user presses Return/Enter key while entering text in the searchText field, perform a
  //Wikipedia search for the text entered (if not empty). The inputForm is moved to the top
  //of the page if it is currently in the middle.  This makes room for the search results.
  $("#searchText").on('keyup', function (e) {
    if (e.keyCode == 13) {
      performChannelSearch();
    }
  });
});


function performChannelSearch() {
  var sChannel = $("#searchText").val().trim();

  if (sChannel.length > 0) {
    sChannel = encodeURIComponent(sChannel);
    var sURL = "https://wind-bow.glitch.me/twitch-api/streams/" + sChannel + "?callback=?"; //'callback=?' is for JSONP

    $.getJSON(sURL, function (oData) {
      var sText, sLogoURL, sChannelURL, iEntry;

      if (oData.hasOwnProperty('stream') && oData.stream != null && oData.stream.hasOwnProperty('channel')) {
        sText = oData.stream.channel.game + ": " + oData.stream.channel.status;
        sLogoURL = oData.stream.channel.logo;
        sChannelURL = oData.stream.channel.url;
        iEntry = findUnusedEntry();
        setEntry(iEntry, sChannel, sText, sLogoURL, sChannelURL);
      } else {
        sURL = "https://wind-bow.glitch.me/twitch-api/channels/" + sChannel + "?callback=?";

        $.getJSON(sURL, function (oData) {
          var sText, sLogoURL, sChannelURL, iEntry;

          if (oData.hasOwnProperty('error')) {
            sLogoURL = "http://res.cloudinary.com/dhvrio4fh/image/upload/v1501283310/xLogo_kiyxox.png";
            sText = "Error: " + oData.error;
            sChannelURL = "#";
          } else if (oData.hasOwnProperty('logo') && oData.logo != null) {    //storbeck's logo is 'null'...sad
            sLogoURL = oData.logo;
            sText = "Offline";
            sChannelURL = "https://www.twitch.tv/" + sChannel;
          } else {
            sLogoURL = "http://res.cloudinary.com/dhvrio4fh/image/upload/v1501283310/xLogo_kiyxox.png";
            sText = "Offline";
            sChannelURL = "https://www.twitch.tv/" + sChannel;
          }

          iEntry = findUnusedEntry();
          setEntry(iEntry, sChannel, sText, sLogoURL, sChannelURL);
        });
      }
    });
  }
}


function findUnusedEntry() {
  for (i = 1; i <= 10; i++) {
    var sID = (i < 10) ? "#entryDiv0" + i : "#entryDiv" + i;

    if (!$(sID).is(":visible") || $(sID).attr("href") == "#") {
      return i;
    }
  }

  return 10;
}

function twitchQueryFromList(iList, oList) {
  var sURL = "https://wind-bow.glitch.me/twitch-api/streams/" + oList[iList] + "?callback=?"; //'callback=?' is for JSONP

  $.getJSON(sURL, function (oData) {
    var sText, sLogoURL, sChannelURL;

    if (oData.hasOwnProperty('stream') && oData.stream != null && oData.stream.hasOwnProperty('channel')) {
      sText = oData.stream.channel.game + ": " + oData.stream.channel.status;
      sLogoURL = oData.stream.channel.logo;
      sChannelURL = oData.stream.channel.url;
      setEntry(iList + 1, oList[iList], sText, sLogoURL, sChannelURL);
      iList += 1;

      if (iList < oList.length) {
        twitchQueryFromList(iList, oList);
      }
    } else {
      sURL = "https://wind-bow.glitch.me/twitch-api/channels/" + oList[iList] + "?callback=?";

      $.getJSON(sURL, function (oData) {
        var sText, sLogoURL, sChannelURL;

        if (oData.hasOwnProperty('error')) {
          sLogoURL = "http://res.cloudinary.com/dhvrio4fh/image/upload/v1501283310/xLogo_kiyxox.png";
          sText = "Error: " + oData.error;
          sChannelURL = "#";
        } else if (oData.hasOwnProperty('logo') && oData.logo != null) {    //storbeck's logo is 'null'...sad
          sLogoURL = oData.logo;
          sText = "Offline";
          sChannelURL = "https://www.twitch.tv/" + oList[iList];
        } else {
          sLogoURL = "http://res.cloudinary.com/dhvrio4fh/image/upload/v1501283310/xLogo_kiyxox.png";
          sText = "Offline";
          sChannelURL = "https://www.twitch.tv/" + oList[iList];
        }

        setEntry(iList + 1, oList[iList], sText, sLogoURL, sChannelURL);
        iList += 1;

        if (iList < oList.length) {
          twitchQueryFromList(iList, oList);
        }
      });
    }
  });
}


function clearAllEntries() {
  for (var i = 1; i <= 10; i++) {
    var sNum = (i < 10) ? "0" + i : "" + i;
    $("#entryDiv" + sNum).hide();
  }
}


function setEntry(iEntry, sChannel, sText, sLogoURL, sChannelURL) {
  var sNum = (iEntry < 10) ? "0" + iEntry : "" + iEntry;

  $("#logo" + sNum).attr("src", sLogoURL);
  $("#entryTitle" + sNum).html(sChannel);
  $("#entryText" + sNum).html(sText);
  $("#entryDiv" + sNum).attr("href", sChannelURL).fadeIn(500);
}
