$(function() {
  $("#search button").click(function() {
    search();
  });
  $("#search input").keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      search();
    }
  });
});

function search() {
  var result = idx.search($("#search input").val());
  if(result && result.length > 0) {
    window.location.replace(result[0].ref);
  } else {
    alert("Found nothing");
  }
}
