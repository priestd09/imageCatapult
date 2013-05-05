$(function() {
  $("#imageListFilter").hide();
  $("#imageListUtility").hide();
  
  $( "#from" ).datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 2,
    dateFormat: "yy-mm-dd",
    onClose: function( selectedDate ) {
      $( "#to" ).datepicker( "option", "minDate", selectedDate );
    }
  });
  $( "#to" ).datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 2,
    dateFormat: "yy-mm-dd",
    onClose: function( selectedDate ) {
      $( "#from" ).datepicker( "option", "maxDate", selectedDate );
    }
  });
});

$(function() {
  $( "#dbImageList" ).selectable();
  refreshImages($( "#dbImageList" ));
});

function timestampToDate(stamp)
{

  var date = new Date(stamp*1000);
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var seconds = date.getSeconds();
//   
//   var year = date.getFullYear();
//   var month = date.getMonth() + 1;
//   var date = date.getDate();
// 
//   var formattedTime = hours + ':' + minutes + ':' + seconds;
//   var formattedDate = date + '/' + month + '/' + year;
//   
//   return formattedTime + ' ' + formattedDate; 
  
  return date.toLocaleString("en-GB");
}

function createImageListElement(data)
{
  var li = $('<li>');
  li.attr('class','ui-widget-content')
  li.addClass(data[2]);
  
  if (data[2] == 'queued')
  {
    if (data[3] != 0)
    {
      var triangle = $('<div>');
      triangle.addClass('triangle');
      triangle.appendTo(li);
      var jobTime = $('<span>');
      jobTime.addClass('jobTimeStamp');
      jobTime.text(timestampToDate(data[3]));
      jobTime.appendTo(li);
    }
  }

  var img = $('<img id="dynamic">');
  img.attr('src', data[1] + '.thumb.jpg');
  img.attr('dbid',data[0]);
  img.appendTo(li);

  return li;
}

$( "#applyFilterButton" ).click(function() {
  var fromDate = $("#from").datepicker('getDate');
  var fromEpoch = fromDate.getTime()/1000.0;
  var toDate = $("#to").datepicker('getDate');
  //add a day - want everything up to the end of midnight
  //on the to date
  toDate.setDate(toDate.getDate()+1);
  var toEpoch = toDate.getTime()/1000.0;
  $( "#dbImageList" ).html( "" );

  // get images from the db
  $.ajax({
    url: "../image",
    dataType: 'json',
    async: false,
    data: {imageList: 0,
     minDate: fromEpoch,
     maxDate: toEpoch},
    success: function(json) {
      $.each(json, function (e, y) {
        var li = createImageListElement(y);
        $('#dbImageList').append(li);
      });
    } 
  });

  $("#imageListFilter").hide("fast");
  $("#imageListFilterButton").show("fast");
});

function refreshImages(listElement)
{
  listElement.html( "" );
  // get images from the db
  $.ajax({
    url: "../image",
    dataType: 'json',
    async: false,
    data: {imageList: 0},
    success: function(json) {
      $.each(json, function (e, y) {
        var li = createImageListElement(y);
        listElement.append(li);
      });
    } 
  });

  // get the min/max date range
  $.ajax({
    url: "../image",
    dataType: 'json',
    async: false,
    data: {getImageDateRange: 0},
    success: function(json) {
      var minEpoch = new Date(json[0]*1000);
      var maxEpoch = new Date(json[1]*1000);
      $("#from").datepicker('setDate', minEpoch);
      $("#to").datepicker('setDate', maxEpoch);
    } 
  });
}

$( "#imageListFilterButton" ).click(function() {
  $("#imageListFilterButton").hide("fast");
  $("#imageListFilter").show("fast");
});

$( "#imageListFilterHide" ).click(function() {
  $("#imageListFilter").hide("fast");
  $("#imageListFilterButton").show("fast");
});


$( "#imageListUtilityShow" ).click(function() {
  $("#imageListUtilityShow").hide("fast");
  $("#imageListUtility").show("fast");
});

$( "#imageListUtilityHide" ).click(function() {
  $("#imageListUtility").hide("fast");
  $("#imageListUtilityShow").show("fast");
});