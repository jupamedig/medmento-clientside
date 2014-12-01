$(document).ready(function(){
  bindListeners();
});

function bindListeners(){
  $("#reminder-form").on('submit', createReminder);
  $("#testing").on('click', getReminders);
};

function createReminder(evt){
  evt.preventDefault();
  // var dataToSend = {}
  var request = $.ajax({
    type: 'post',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json',
    data: $(this).serialize()
  });
  request.done(function(res){
    console.log(res)
    // $('form').hide();
  });
  request.fail(function(res) {
    console.log('create reminder fail!')
});
};

function getReminders(evt){
  evt.preventDefault();
  var request = $.ajax({
    type: 'get',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json'
  });
  request.done(function(res){
    console.log(res)
  });
  request.fail(function(res) {
    console.log('get reminders fail!')
  });
};