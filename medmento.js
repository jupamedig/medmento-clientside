$(document).ready(function() {
  $('#weekly-dropdown').hide();
  $('#edit-weekly-dropdown').hide();

  bindListeners();
});

function bindListeners() {
  loadEvents();
    $(document).on('click', "#data-button", dataGraph);
  $("#reminder-form").on('submit', createReminder);
  $("#testing").on('click', getReminders);
  $('#weekly').on('click', function(){
    $('#weekly-dropdown').fadeIn('slow');
  });
  $('#daily').on('click', function(){
    $('#weekly-dropdown').hide('slow');
  });
    $('#edit-weekly').on('click', function(){
    $('#edit-weekly-dropdown').fadeIn('slow');
  });
  $('#edit-daily').on('click', function(){
    $('#edit-weekly-dropdown').hide('slow');
  });


  $(document).on('click', "#delete", deleteEvent);
  $(document).on('click', "#edit", editReminder);

  $("#edit-reminder-form").on('submit', updateReminder)

};

function dataGraph(evt) {
  evt.preventDefault();

  var id = $(this).closest('#med-row').data('event-id');
  $.ajax({
    type: 'GET',
    // do not hardcode id
    url: "http://localhost:3000/api/v1/clockwork_events/" + id + "/pain_ratings/"
  }).done(function(serverData){

  $.ajax({
  type: 'GET',
  url: "http://localhost:3000/api/v1/clockwork_events/" + id
  }).done(function(serverData){
        name = serverData.patient_name.charAt(0).toUpperCase() + serverData.patient_name.slice(1);
       $("#chartModal h2 span").text(name)
  })
    .fail(function(){console.log("Server Failure")})


    var painRatings = [];
    var xAxisDays = [];
    for (var index=0; index < serverData.length; index++ ) {
      painRatings.push(serverData[index].rating)
      var day = serverData[index].updated_at.slice(8,10);
      var month = serverData[index].updated_at.slice(5,7);
      var year = serverData[index].updated_at.slice(0,4);
      var date = month + "-" + day + "-" + year;
      xAxisDays.push(date)
    }

    var sum = painRatings.reduce(function(a, b) { return a + b });
    var avg = (sum / painRatings.length).toFixed(1);
    $("#chartModal h5 span").text(avg)

 var userData = {
    labels : xAxisDays,
    datasets : [
      {
        fillColor : "rgba(172,194,132,0.4)",
        strokeColor : "#ACC26D",
        pointColor : "#fff",
        pointStrokeColor : "#9DB86D",
        data : painRatings
      }
    ]
  }

  var userChart = document.getElementById('user-chart-modal').getContext('2d');
  userChart.canvas.width = 800;
  userChart.canvas.height = 500;

  new Chart(userChart).Line(userData);
  }).fail(function(){console.log("Server Error")})


}



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

 $('#formModal').foundation('reveal','close');

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
  // evt.preventDefault();
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

function editReminder(evt) {
  var id = $(this).closest('#med-row').data('event-id');

  // $('#formModal').find('h3').html("Edit Reminder");
  // $('form').attr('id', 'edit-reminder-form');
  $('#edit-reminder-form').attr('data-event-id', id);
  // var id = $(evt.target).parents().find('#med-row').attr('data-event-id')
  var request = $.ajax({
    type: 'get',
    url: 'http://localhost:3000/api/v1/clockwork_events/' + id
  });
  request.done(function(res) {

    $('#patient_name').val(res.patient_name);
    $('#patient_number').val(res.patient_number);
    $('#drug_name').val(res.drug_name);
    $('#message').val(res.message);
    // $('#patient_name').val(res.patient_name);

    if(res.frequency_period_id === 5){
      var day = (res.at).substr(0,(res.at).indexOf(' '));
      var time = (res.at).substr((res.at).indexOf(' ')+1);
      $('#edit-reminder-form').find('#edit-weekly').prop('checked', true);
      $('#edit-day-of-week').val(day);
      $('#edit-weekly-dropdown').show();
      $('#edit-reminder-time').val(time);

    } else {
      $('#edit-weekly-dropdown').hide();
      $('#edit-daily').prop('checked', true);
      $('#edit-reminder-time').val(res.at);
    };



  });
  request.fail(function(res) {
    console.log('single reminder failed to populate form!')
  });
};

function updateReminder(evt) {
  evt.preventDefault();
  console.log('updateReminder WORKED');

  var id = $(this).attr("data-event-id")
  parsePhoneNumber();


  var day = $("#edit-day-of-week").val();
  var time = $("#edit-reminder-time").val();

  if ($('#edit-daily').is(':checked')) {
    $("#edit-at").val(time)
  } else {
    $("#edit-at").val(day + " " + time)
  }

  $('#editModal').foundation('reveal','close');

  var request = $.ajax({
    type: 'PUT',
    url: 'http://localhost:3000/api/v1/clockwork_events/' + id,
    data: $(this).serialize()
  });
  request.done(function(res){
    console.log(res);
    console.log("updateReminder DONEEEE");
    window.location.reload();
    // delete Mary out of the DOM
  });
  request.fail(function(res) {
    console.log("update reminder fail!")
  });
}

  // Parse phone number into "1234567890" format

function parsePhoneNumber() {
  var replacementText = $("input[id='patient_number']").val().replace(/\D/g,'')
  $("input[id='patient_number']").val(replacementText)
}
