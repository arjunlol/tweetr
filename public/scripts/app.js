/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
 $(document).ready( function() {

  loadTweets("all")
  let likesCount = {} //object used to keep track of likes on front end
  $('body').on('click', '.likes',  function(event) {
    let id = $(this).data('id')
    let likesArray = $(this).data('likesarray');
    let likesnum = $(this).data("numberoflikes")
    let counter = $(this).next() //counter of physical likes
    likesCount[id] = likesCount[id] || likesnum; //data attribute not storing properly.. so had to use global object
    $.ajax({
      url: '/tweets/like',
      method: 'POST',
      data: {id: id, 'likesArray': likesArray},
      success: function(name) {
        let i = likesArray.indexOf(name); //-1 if name not in array
        if (i !== -1) {
          likesArray.splice(i,1);
          $(event.target).removeClass('liked');
          likesCount[id]--;
        } else {
          likesArray.push(name);
          likesCount[id]++;
          // likesnum++;
          // // $(this).data().likesnum++;
          $(event.target).addClass('liked');
        }
        $(this).data('numberoflikes', likesnum);//data attribute not dynamically updating had to use global var likescount
        $(this).data('likesarray', likesArray);
        counter.text(likesCount[id]);//update on front end
      }
    })
  });

  $('#login').on('click', function(event) {
    $('.register').slideUp();
    $('.login').slideToggle();

  });
  $('#register').on('click', function(event) {
    $('.login').slideUp();
    $('.register').slideToggle();
  });


  $('#compose').on('click', function(event) {
    $('.new-tweet').slideToggle();
    $('.text').focus();
  });

  $('.new-tweet form').on('input', function(event) {
    let text = $(this).find('.text').val();
    if (!(text === "") || !(text === null)) { //check if tweet has content before posting
      $('.no-error-empty').slideUp();
    }
    if (!(text.length > 140)) { //check less than 140 char
      $('.no-error-limit').slideUp();
    }
  });

  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault(); //intercept post with ajax
    let serialized = $(this).serialize(); //serialize to query string
    if(!validate(this)){
      return;
    }
    //reset textarea and counter
    $('.text').val('');
    $('.counter').text(140);
    $.ajax({
      url:'/tweets/',
      method: 'POST',
      data: serialized,
      success: function () {
        loadTweets();
      }
    })
  });


});
 //function check if valid post entry
  function validate(This) {
    let text = $(This).find('.text').val();
    if (text === "" || text === null) {
      $('.no-error-empty').slideDown();
      return false;
    } else if (text.length > 140) {
      $('.no-error-limit').slideDown();
      return false;
    }
    return true;
  };
  //responsible fetching tweets
  function loadTweets(x) {
    $.ajax({
    url:'/tweets/',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      if(x){
      renderTweets(data)
      } else {
      datalength = (Object.keys(data).length);
      renderTweets(data[datalength-1]);
      }
    }})
  }


//});
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
      <img class="likes" data-numberoflikes=${tweetobj.likes.length} data-id=${tweetobj._id} data-likesarray=${JSON.stringify(tweetobj.likes)} src='https://cdn2.iconfinder.com/data/icons/pittogrammi/142/80-128.png'/>
      <p class="likesshow">${tweetobj.likes.length}</p>
      </span>
    </footer>`

    let $tweet = $('<article>').append(html);
    return $tweet;
  }

