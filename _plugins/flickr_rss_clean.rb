
# Replace liste of image by a image side by side
# for rss feed

module Jekyll
  module FlickrRssClean

    def clean_rss(input)

      input.gsub(/\<li\>\<a class=\"th\" href=\"(.*)\"\>\<img src=\"(.*)\"\>\<\/a\>\<\/li\>/, '<p><img src="\1" /></p>')
    end
  end
end

Liquid::Template.register_filter(Jekyll::FlickrRssClean)
