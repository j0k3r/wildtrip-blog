import fs from 'node:fs';
import path from 'node:path';
import { HtmlBasePlugin, IdAttributePlugin, InputPathToUrlTransformPlugin } from '@11ty/eleventy';
import Image, { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import pluginNavigation from '@11ty/eleventy-navigation';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import dayjs from 'dayjs';

import pluginFilters, { filterTags } from './_config/filters.js';

export default async function (eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor('drafts', '*', (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
      return false;
    }
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig
    .addPassthroughCopy({
      './public/': '/',
    })
    .addPassthroughCopy('./content/feed/pretty-atom-feed.xsl');

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch images for the image pipeline.
  eleventyConfig.addWatchTarget('content/**/*.{svg,webp,png,jpg,jpeg,gif}');

  // Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
  // Adds the {% css %} paired shortcode
  eleventyConfig.addBundle('css', {
    toFileDirectory: 'dist',
  });
  // Adds the {% js %} paired shortcode
  eleventyConfig.addBundle('js', {
    toFileDirectory: 'dist',
  });

  // Official plugins
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  eleventyConfig.addPlugin(feedPlugin, {
    type: 'atom', // or "rss", "json"
    outputPath: '/rss.xml',
    stylesheet: 'feed/pretty-atom-feed.xsl',
    collection: {
      name: 'posts',
      limit: 10,
    },
    metadata: {
      language: 'fr',
      title: 'wildtrip.blog',
      description: 'En vadrouille en Asie du sud, en Chine, en Russie et ailleurs dans le monde',
      base: 'https://wildtrip.blog/',
      author: {
        name: 'Jérémy Benoist',
      },
    },
  });

  // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // Output formats for each image.
    formats: ['webp', 'auto'],

    // widths: ["auto"],

    htmlOptions: {
      imgAttributes: {
        // e.g. <img loading decoding> assigned on the HTML tag will override these values.
        loading: 'lazy',
        decoding: 'async',
      },
    },

    sharpOptions: {
      animated: true,
    },

    // because a lot of old articles have dead images
    failOnError: false,
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // by default we use Eleventy’s built-in `slugify` filter:
    // slugify: eleventyConfig.getFilter("slugify"),
    // selector: "h1,h2,h3,h4,h5,h6", // default
  });

  eleventyConfig.addShortcode('currentBuildDate', () => {
    return new Date().toISOString();
  });

  eleventyConfig.addShortcode('svg', (file) => {
    const relativeFilePath = `./public/svg/${file}.svg`;
    const data = fs.readFileSync(relativeFilePath, (err, contents) => {
      if (err) return err;
      return contents;
    });

    return data.toString('utf8');
  });

  eleventyConfig.addAsyncShortcode('photoset', async function (id) {
    const contentPath = path.dirname(this.page.inputPath);
    const photosetDir = `${contentPath}/photos/${id}`;
    const photosetData = JSON.parse(fs.readFileSync(`${photosetDir}/data.json`));

    if (photosetData.length === 1) {
      const data = photosetData.pop();
      if (data.type === 'video') {
        // generate the big photo to be able to get the final url and put it in the anchor
        const poster = await Image(`${contentPath}/${data.poster}`, {
          formats: ['jpg'],
          widths: ['auto'],
          outputDir: path.dirname(this.page.outputPath),
          urlPath: this.page.url,
        });

        // move video into the content directory
        fs.copyFileSync(
          `${contentPath}/${data.path}`,
          `${path.dirname(this.page.outputPath)}/${path.basename(data.path)}`,
        );

        return `<p style="text-align: center;"><video controls poster="${poster.jpeg[0].url}"><source src="${this.page.url}/${path.basename(data.path)}" type="video/mp4" /></video></p>`;
      }

      return `<p style="text-align: center;"><img class="th" src="${data.path}" title="${data.title}" alt="${data.title}" width="800" /></p>`;
    }

    const res = await Promise.all(
      photosetData.map(async (data) => {
        if (data.type === 'video') {
          // generate the big photo to be able to get the final url and put it in the anchor
          const poster = await Image(`${contentPath}/${data.poster}`, {
            formats: ['jpg'],
            widths: ['auto'],
            outputDir: path.dirname(this.page.outputPath),
            urlPath: this.page.url,
          });

          // move video into the content directory
          fs.copyFileSync(
            `${contentPath}/${data.path}`,
            `${path.dirname(this.page.outputPath)}/${path.basename(data.path)}`,
          );

          return `<li><video controls poster="${poster.jpeg[0].url}"><source src="${this.page.url}/${path.basename(data.path)}" type="video/mp4" /></video></li>`;
        }

        // generate the big photo to be able to get the final url and put it in the anchor
        const photoBig = await Image(`${contentPath}/${data.path}`, {
          formats: ['jpg'],
          widths: ['auto'],
          outputDir: path.dirname(this.page.outputPath),
          urlPath: this.page.url,
        });

        return `<li><a class="th" href="${photoBig.jpeg[0].url}"><img src="${data.square}" alt="${data.title}" title="${data.title}"></a></li>`;
      }),
    );

    return `<div class="row"><div class="large-11 columns large-centered"><ul class="clearing-thumbs" data-clearing>${res.join('')}</ul></div></div>`;
  });

  // Features to make your build faster (when you need them)

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  eleventyConfig.addPassthroughCopy({ 'public/favicon': '/' });

  eleventyConfig.addDateParsing((dateValue) => {
    return dayjs(dateValue).toDate();
  });

  // build list of tags with number of contents per tag sorted by most contents per tag (with a minimum of 3 contents)
  eleventyConfig.addCollection('tagsList', (collection) => {
    const tagsObject = {};
    for (const item of collection.getAll()) {
      if (item.data.tags) {
        for (const tag of filterTags(item.data.tags)) {
          if (typeof tagsObject[tag] === 'undefined') {
            tagsObject[tag] = 1;
          } else {
            tagsObject[tag] += 1;
          }
        }
      }
    }

    const tagList = [];
    for (const tagObject of Object.keys(tagsObject)) {
      tagList.push({ tagName: tagObject, tagCount: tagsObject[tagObject] });
    }

    return tagList.filter((tag) => tag.tagCount >= 3).sort((a, b) => b.tagCount - a.tagCount);
  });

  // build all points for the main map
  eleventyConfig.addCollection('geoJson', (collection) => {
    const geoJson = [];
    for (const item of collection.getAll()) {
      if (item.data.location) {
        geoJson.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: JSON.parse(item.data.location),
          },
          properties: {
            'marker-color': '#F85931',
            url: `${item.data.page.url}`,
            title: `${item.data.title}`,
          },
        });
      }
    }

    return geoJson;
  });
}

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: ['md', 'njk', 'html', '11ty.js'],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: 'njk',

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: 'njk',

  // These are all optional:
  dir: {
    input: 'content', // default: "."
    includes: '../_includes', // default: "_includes" (`input` relative)
    data: '../_data', // default: "_data" (`input` relative)
    output: '_site',
  },

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.

  // pathPrefix: "/",
};
