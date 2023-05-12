# A sample Gemfile
source "https://rubygems.org"

gem 'jekyll', '~> 3.9.2'
gem 'flickraw', '~> 0.9.9'
gem 'i18n', '~> 0.9.5'
gem 'gsl', '~> 2.1', '>= 2.1.0.1'
gem 'algoliasearch', '~> 1.27'
gem 'rails-html-sanitizer', '~> 1.4.4'
gem 'classifier-reborn', '~> 2.3'
gem 'redcarpet', '~> 3.6'
gem 'nokogiri', '~> 1.14.3'
# because of CVE-2018-8048 (https://github.com/flavorjones/loofah/issues/144)
gem 'loofah', '~> 2.21.1'

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
