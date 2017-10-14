$(document).ready(function() {

  $("#articles").click(function(event) {
    event.preventDefault();

    $.getJSON("/articles", function(data) {
      displayResults(data);
    });
  });


  function displayResults(data) {
    $("tbody").empty();
    for(var i = 0; i < data.length; i++) {

      var img = data[i].title;
      img.replace("\n\n", "");
      console.log(img);
      $("#table> tbody").append("<tr>")
      .append($("<td>").append(img))
      .append("<td>" + data[i].link + "</td>");
    };
  }
})
