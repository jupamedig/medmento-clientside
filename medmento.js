$(document).ready(function() {
  bindListeners();
});

function bindListeners() {
  loadEvents();
  $("#reminder-form").on('submit', createReminder);
  $("#testing").on('click', getReminders);
  $(document).on('click', ".delete-event", deleteEvent);
};

function deleteEvent(evt) {
  evt.preventDefault();
  var id = $(this).closest('#med-row').data('event-id');
  debugger
  $.ajax({
  type: 'DELETE',
  url: "http://medmento.herokuapp.com/api/v1/events/" + id
  }).done(console.log("deleted")).fail(function(){alert("Item Not Found!")});
}

function loadEvents() {
  $.ajax({
    type: 'GET',
    url: 'http://medmento.herokuapp.com/api/v1/events'
  }).done(function(serverData){
      for( i=0; i < serverData.length; i++ ) {
        var drug_name = serverData[i].drug_name;
        var patient_name =  serverData[i].patient_name;
        var patient_number = serverData[i].patient_number;
        var message = serverData[i].message;
        var eventId = serverData[i].id;

        var source = $("#person-template").html();
        var template = Handlebars.compile(source);
        var context = { drug_name: drug_name, patient_name: patient_name, patient_number: patient_number, message: message, eventId: eventId};

        var html = template(context)
        $("#account-reminders").prepend(html)
      }
      })
    .fail(function(){console.log("failed initial load")})
};

function createReminder(evt) {
  evt.preventDefault();

  var request = $.ajax({
    type: 'POST',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json',
    data: $(this).serialize()
  });
  request.done(function(serverData) {
    var source   = $("#person-template").html();
    var template = Handlebars.compile(source);
    var context = { drug_name: serverData.drug_name, patient_name: serverData.patient_name, patient_number: serverData.patient_name, message: serverData.message, eventId: serverData.id };
    var html = template(context);

    // var html = html.data("eventId", serverData)
    $("#account-reminders").prepend(html)
  });
  request.fail(function(res) {
    console.log('create reminder fail!')
});
};

function getReminders(evt) {
  evt.preventDefault();
  var request = $.ajax({
    type: 'get',
    url: 'http://medmento.herokuapp.com/api/v1/events',
    dataType: 'json'
  });
  request.done(function(res) {
    console.log(res)
  });
  request.fail(function(res) {
    console.log('get reminders fail!')
  });
};

// function getReminders(evt) {
//   evt.preventDefault();
//   var request = $.ajax({
//     type: 'DELETE',
//     url: 'http://medmento.herokuapp.com/api/v1/events'
//   });
//   request.done(function(res) {
//     console.log(res)
//   });
//   request.fail(function(res) {
//     console.log('get reminders fail!')
//   });
// };

function deleteAll() {
  for (var id = 0; id < 101; id ++) {
    var request = $.ajax({
      type: 'DELETE',
      url: "http://medmento.herokuapp.com/api/v1/events/" + id
    });
    request.done(function(res) {
      console.log(res)
    });
    request.fail(function(res) {
      console.log('get reminders fail!')
    });
  }
}



// adds all the options to the frequency_quantity select dropdown in the form
$(function() {
    var $select = $(".1-31");
    for (i=1;i<=31;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});



