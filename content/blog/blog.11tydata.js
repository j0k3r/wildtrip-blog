export default {
  tags: ['posts'],
  layout: 'layouts/post.njk',
  permalink: '{{ page.fileSlug }}/',
  eleventyComputed: {
    geoData: (data) => {
      let res = '';
      if (data.location) {
        res = '<script type="text/javascript">';
        res += `const geoSetview = [${JSON.parse(data.location).reverse()}];`;

        if (data.location_zoom) {
          res += `const geoSetzoom = ${data.location_zoom};`;
        }

        res += `
const geoJson =
[{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": ${data.location}
    },
    "properties": {
        "marker-color": "#f1762d",
        "marker-symbol": "star",
        "url": "${data.page.url}",
        "title": "${data.title.replace(/"/g, '')}"
    }
}];
</script>`;
      }

      return res;
    },
  },
};
