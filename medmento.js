$(document).ready(function() {
  bindListeners();
});

function bindListeners() {
  loadEvents();
  $("#reminder-form").on('submit', createReminder);
  $("#testing").on('click', getReminders);
  $(document).on('click', ".delete-event", deleteEvent);
  dropDown();
};

function deleteEvent(evt) {
  evt.preventDefault();
  var id = $(this).closest('#med-row').data('event-id');
  $.ajax({
    type: 'DELETE',
    url: "http://localhost:3000/api/v1/clockwork_events/" + id
  }).done(function(){

    var itemToRemove = $('div').filter(function(i,e) {
      return $(e).data('event-id') == id;
    });



    itemToRemove.remove();

  }).fail(function(){alert("Item Not Found!")});
}

function loadEvents() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/api/v1/clockwork_events'
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

  var day = $("#day-of-week").val();
  var time = $("#reminder-time").val();

  if ($('#daily').is(':checked')) {
    $("#at").val(time)
  } else {
    $("#at").val(day + " " + time)
  }
  data = $(this).serialize()

  var request = $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/api/v1/clockwork_events',
    dataType: 'json',
    data: $(this).serialize()
  });
  request.done(function(serverData) {
    var source   = $("#person-template").html();
    var template = Handlebars.compile(source);
    var context = { drug_name: serverData.drug_name, patient_name: serverData.patient_name, patient_number: serverData.patient_name, message: serverData.message, eventId: serverData.id };
      var html = template(context);
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
    url: 'http://localhost:3000/api/v1/clockwork_events',
    dataType: 'json'
  });
  request.done(function(res) {
    console.log(res)
  });
  request.fail(function(res) {
    console.log('get reminders fail!')
  });
};

function dropDown() {
  $('#weekly-dropdown').hide();
  $('#weekly').on('click', function(){
    $('#weekly-dropdown').fadeIn('slow');
  });
  $('#daily').on('click', function(){
   $('#weekly-dropdown').hide('slow');
 });
}


$(function() {
  var $select = $(".1-31");
  for (i=1;i<=31;i++){
    $select.append($('<option></option>').val(i).html(i))
  }
});



