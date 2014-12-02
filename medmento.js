$(document).ready(function(){
  bindListeners();
});

function bindListeners(){
  $("#reminder-form").on('submit', createReminder);
  $("#testing").on('click', getReminders);
};

function createReminder(evt){
  evt.preventDefault();
  // var frequency_period_id = parseInt($("#frequency-value").val());
  // var patient_name = $("#patient-name").val();
  // var frequency_quantity = $("#frequency_quantity").val();
  // var patient_number = $("#patient-number").val();
  // var drug_name = $("#drug_name").val();
  // var time = $("#time").val();
  // var message = $("#message").val();
  // var dataToSend = {frequency_period_id: frequency_period_id, frequency_quantity: frequency_quantity, patient_name: patient_name, patient_number: patient_number, drug_name: drug_name, time: time, message: message}

  var request = $.ajax({
    type: 'post',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json',
    data: $(this).serialize()
  });
  request.done(function(serverData){
    console.log("DONE!!!!")
    console.log(serverData)
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



