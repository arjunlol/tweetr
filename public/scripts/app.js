/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
 $(document).ready( function() {
  // Fake data taken from tweets.json
  var data = [
    {
      "user": {
        "name": "Newton",
        "avatars": {
          "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
          "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
          "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
        },
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": {
          "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
          "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
          "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
        },
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    },
    {
      "user": {
        "name": "Johann von Goethe",
        "avatars": {
          "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
          "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
          "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
        },
        "handle": "@johann49"
      },
      "content": {
        "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
      },
      "created_at": 1461113796368
    }
  ];
  renderTweets(data);

  $('form').on('submit', function(event) {
    event.preventDefault();
    let serialized = $(this).serialize();
    $.ajax({
      url:'/tweets/',
      method: 'POST',
      data: serialized,
      success: function () {
        loadTweets();
      }
      // error: function () {
      //   console.log('theres an error');
      // }
    })
  });
  //responsible fetching tweets
  function loadTweets() {
    $.ajax({
    url:'/tweets/',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      datalength = (Object.keys(data).length);
      renderTweets(data[datalength-1]);
    }
    // error: function () {
    //   console.log('theres an error');
    // }
    })
  };


});
  function renderTweets(tweets) {
    // loops through tweets
      // calls createTweetElement for each tweet
      // takes return value and appends it to the tweets container

    if (!tweets[1]){
      $('#tweets').prepend(createTweetElement(tweets));
      return;
    }
    for (let i = 0; i<tweets.length; i++) {
      $('#tweets').prepend(createTweetElement(tweets[i]));
    }
  }

  function createTweetElement(tweetobj) {
    let html = `<header>
      <img src=${tweetobj.user.avatars.small}>
      <h2 class="tweet-name">${tweetobj.user.name}</h2>
      <p class="tweet-tag">${tweetobj.user.handle}</p>
    </header>
    <p class="tweet-text">${tweetobj.content.text}</p>
    <footer>
      <p class="date">${tweetobj.created_at}</p>
      <span>
      <img src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-flag-128.png'/>
      <img src='https://cdn0.iconfinder.com/data/icons/entypo/100/retweet-128.png'/>
      <img src='https://cdn2.iconfinder.com/data/icons/pittogrammi/142/80-128.png'/>
      </span>
    </footer>`

    let $tweet = $('<article>').append(html);
    return $tweet;
  }

  function formatDate (date) {
  }
