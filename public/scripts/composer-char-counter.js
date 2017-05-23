$(document).ready( function() {
  //update character count dynamically as user types tweet
  $('.new-tweet textarea').on('input', function() {
    let counter = $(this).closest('.new-tweet').find('.counter');
    if(($(this).val().length > 140)) {
      counter.addClass('over140');
    } else {
      counter.removeClass('over140');
    }
    counter.text(140 - $(this).val().length);
  });


});