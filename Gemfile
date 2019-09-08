# A sample Gemfile
source "https://rubygems.org"

gem 'jekyll'
gem 'flickraw', '~> 0.9.9'
gem 'i18n', '~> 0.7.0'
gem 'gsl', '~> 2.1', '>= 2.1.0.1'
gem 'algoliasearch', '~> 1.10'
gem 'rails-html-sanitizer', '~> 1.0.4'
gem 'classifier-reborn', '~> 2.0'
gem 'redcarpet', '~> 3.4'
gem 'nokogiri', '~> 1.8.1'
# because of CVE-2018-8048 (https://github.com/flavorjones/loofah/issues/144)
gem 'loofah', '~> 2.2.3'

# rb-fsevent > 0.9.4 no longer supports OS X 10.6 through 10.8.
require 'rbconfig'
if RbConfig::CONFIG['target_os'] =~ /darwin(1[0-3])/i
  gem 'rb-fsevent', '<= 0.9.4'
end

group :jekyll_plugins do
  gem 'jekyll-assets'
  gem 'uglifier'
  gem 'jekyll-paginate'
  gem 'jekyll-sitemap'
end
