
$(function() {
  $('#search input.button').on('click', function() {
    return search();
  });

  $('#search-query').on('keyup', function() {
    return search();
  });

  function search() {
    var query   = $('#search-query').val();
    var result  = $('#search-results');
    var entries = $('#search-results .entries');

    if (query.length <= 2) {
      result.hide();
      entries.empty();
    } else {
      // retrieve matching result with content
      var results = $.map(idx.search(query), function(result) {
        return $.grep(docs, function(entry) {
          return entry.id === result.ref;
        })[0];
      });

      entries.empty();

      if (results && results.length > 0) {
        $.each(results, function(key, post) {
          entries.append('<article>'+
          '  <h3>'+
          '    <small><time>'+post.date+'</time></small>'+
          '    <a href="'+post.id+'">'+post.title+'</a>'+
          '  </h3>'+
          '</article>');
        });
      } else {
        entries.append('<p>Aucun article trouvé :-(</p>');
      }

      result.show();
    }

    return false;
  }
});
