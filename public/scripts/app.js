/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
 $(document).ready( function() {
  // $('.no-error-empty').slideUp();
  // $('.no-error-limit').slideUp();
  loadTweets("all")
  let likesCount = {}
  $('body').on('click', '.likes',  function(event) {
    //$('.likes').data('likes', 1);
    // console.log($(this).data('likes'))//.find('.likes').data('id'));
    let id = $(this).data('id')
    let likesArray = $(this).data('likesarray');
    let likesnum = $(this).data("numberoflikes")
    let counter = $(this).next()
    likesCount[id] = likesCount[id] || likesnum; //data attribute not storing properly..
    $.ajax({
      url: '/tweets/like',
      method: 'POST',
      data: {id: id, 'likesArray': likesArray},
      success: function(name) {
    //  likesArray.indexOf(name) ? likesArray = likesArray: likesArray=[];
        let i = likesArray.indexOf(name);
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
        }// i !== -1 ? likesArray.splice(i,1): likesArray.push(name);
        $(this).data('numberoflikes', likesnum);
        $(this).data('likesarray', 'test');
        counter.text(likesCount[id]);
        // console.log(likesCount);
        // likesCount[id] = likesnum;
        // console.log(likesCount);
        // console.log('data likes array after:', $(this).data('likesarray'))
      }
    })
  });

  $('#login').on('click', function(event) {
    $('.login').slideToggle();
  });
  $('#register').on('click', function(event) {
    $('.register').slideToggle();
  });


  $('#compose').on('click', function(event) {
    $('.new-tweet').slideToggle();
    $('.text').focus();

  });

  $('.new-tweet form').on('input', function(event) {
    let text = $(this).find('.text').val();
    if (!(text === "") || !(text === null)) {
      $('.no-error-empty').slideUp();
    }
    if (!(text.length > 140)) {
      $('.no-error-limit').slideUp();
    }
  });

  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault();
    console.log('Test', $(this).find('.test').val());
    let serialized = $(this).serialize();
    if(!validate(this)){
      return;
    }
    // let text = $(this).find('.text').val();
    // if (text === "" || text === null) {
    //   console.log(text.length);
    //   return;
    // } else if (text.length > 140) {
    //   console.log('wtf too big');
    //   $(this).after('<span class="error">TOO MANY LETTER</span>');
    //   return;
    // }
    // console.log(serialized);
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
  function validate(This) {
    let text = $(This).find('.text').val();
    // if ($(This).find('.error')) { //if error span already shown
    //   console.log($(This).find('.error'));
    //   ($(This).find('.error').removeClass('error'));
    //   console.log($(This).find('.error'));
    // }

    if (text === "" || text === null) {
      $('.no-error-empty').slideDown();
      return false;
    } else if (text.length > 140) {
      $('.no-error-limit').slideDown();
      return false;
    }
    return true;
  };
  });


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
    }
    })
    // error: function () {
    //   console.log('theres an error');
    // }
    }
  });


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

  function formatDate (date) {
  }
