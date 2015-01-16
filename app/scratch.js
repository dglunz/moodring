$.ajax({
    type: 'GET',
    dataType: 'json',
    data: {id: <%= @repo.id %>},
    url: '/commit_sentiments',
    cache: false,
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.responseText);
      alert(thrownError);
    },
    xhr: function () {
           var xhr = new window.XMLHttpRequest();
           //Download progress
           xhr.addEventListener("progress", function (evt) {
             console.log("boom", evt);
             //$('#detail-table').append("Test");
           }, false);
           return xhr;
         },
    beforeSend: function () {
                  $('#loading').show();
                },
    complete: function () {
                $("#loading").hide();
              },
    success: function (json) {
               $("#data").html("data receieved");
             }
  });

