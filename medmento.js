$(document).ready(function(){
  bindListeners();

  // (function(){
  //   parseInt($(".frequency-period").val());
  // });
});

function bindListeners(){
  $("#reminder-form").on('submit', createReminder);
  $("#testing").on('click', getReminders);
};

function createReminder(evt){
  evt.preventDefault();
  // var dataToSend = {}
  // var frequency_period = parseInt($("#frequency-value").val());
  var frequency_period = 5;
  var patient_name = $("#patient-name").val();
  var patient_number = $("#patient-number").val();
  var request = $.ajax({
    type: 'post',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json',
    // data: $(this).serialize()
    data: {
      patient_name: patient_name,
      patient_number: patient_number,
      frequency_period_id: frequency_period
    }
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


// adds all the options to the frequency_quantity select dropdown in the form
$(function(){
    var $select = $(".1-31");
    for (i=1;i<=31;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});



