---
---
var geoJson =
[
{% for post in site.posts %}
  {% include points.geojson %}
{% endfor %}
];
