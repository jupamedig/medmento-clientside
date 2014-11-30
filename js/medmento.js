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
    url: 'http://localhost:3000/api/v1/events',
    dataType: 'json',
    data: $(this).serialize()
  });
  request.done(function(res){
    console.log(res)
    // $('form').hide();
  });
  request.fail(console.log('fail!'));
};

function getReminders(evt){
  evt.preventDefault();
  var request = $.ajax({
    type: 'get',
    url: 'localhost:3000/api/v1/events',
    dataType: 'json'
  });
  request.done(function(res){
    console.log(res)
    console.log("awesome")
    // $('form').hide();
  });
  request.fail(function(res) {
    console.log(res)
    console.log('fail!')
  });
};