$(document).ready(function(){
  bindListeners();
});

function bindListeners(){
  $("#save-button").on('submit', createReminder);
  $("#testing").on('click', getReminders);
};

function createReminder(){
  var request = $.ajax({
    type: 'post',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json'
  });
  request.done(function(response){
    console.log(response)
    // $('form').hide();
  });
  request.fail(console.log('fail!'));
};

function getReminders(){
  var request = $.ajax({
    type: 'get',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json'
  });
  request.done(function(response){
    console.log(response)
    // $('form').hide();
  });
  request.fail(console.log('fail!'));
};