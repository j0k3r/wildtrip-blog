import path from 'node:path';
import Image from '@11ty/eleventy-img';

export default {
  tags: ['posts'],
  layout: 'layouts/post.njk',
  permalink: (data) => `/${data?.page?.fileSlug}/`,
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
    excerptImage: async (data) => {
      if (!data.excerpt_image) {
        return;
      }

      const { dir: blogPostSourceDirectory } = path.parse(data.page.inputPath);
      const src = path.join(blogPostSourceDirectory, data.excerpt_image);

      // remove first level `content` because the image plugin is adding it back (as it's the input dir for 11ty)
      return src.replace(/^content\//, '');
    },
  },
};
