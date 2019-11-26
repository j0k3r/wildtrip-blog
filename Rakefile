require 'fileutils'
require 'net/http'
require 'zip'
require 'rubygems'
require 'bundler/setup'
require 'jekyll'
require 'algoliasearch'

namespace :site do
  jekyll_config = Jekyll.configuration(source: '.', destination: '_site')
  jekyll_site = Jekyll::Site.new(jekyll_config)

  desc "Generate blog files"
  task :generate do
    jekyll_site.process
  end

  desc "Generate, index and publish blog to gh-pages"
  task :index, [:algolia_api_key] => :generate do |t, args|
    application_id = ENV['ALGOLIA_APP_ID'] || jekyll_config['algolia']['application_id']

    raise "missing algolia_api_key argument" if args[:algolia_api_key].nil?

    # send all title/urls to Algolia's indexing API
    Algolia.init application_id: application_id, api_key: args[:algolia_api_key]
    index = Algolia::Index.new(jekyll_config['algolia']['index_name'])

    index.set_settings attributesToIndex: ['title', 'content', 'unordered(url)']
    index.clear! rescue "not fatal"
    index.add_objects jekyll_site.posts.map { |post| {
      title: post.title,
      url: post.url,
      date: post.date,
      content: post.content.gsub(/<[^>]*>/ui, '').gsub(/<!--(.*?)-->[\n]?/m, "")
    } }
  end

  desc "Retrieve previous cache for Flickr API calls"
  task :flickrcache do
    uri = URI(ENV['FLICKR_CACHE_ZIP_URL'])
    zipped_folder = Net::HTTP.get(uri)

    File.open('cache.zip', 'wb') do |file|
      file.write(zipped_folder)
    end

    Zip::File.open('cache.zip') do |zip_file|
      zip_file.each do |entry|
        puts "Extracting #{entry.name}"
        entry.extract(jekyll_config['flickr']['cache_dir'] + '/' + entry.name) { true }
      end
    end

    File.delete('cache.zip')
  end

  desc "Build the website"
  task :build do
    if !File.exist?('_config.yml')
      FileUtils.mv('_config.yml.dist', '_config.yml')
    end

    FileUtils.mkdir_p jekyll_config['flickr']['cache_dir']

    Rake::Task["site:flickrcache"].execute
  end
end
