module Jekyll

  class TagIndex < Page
    def initialize(site, base, dir, tag, path)
      @site = site
      @base = base
      @dir = dir
      @name = path
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_index.html')

      self.data['tag'] = tag
      prettytag = tag.gsub(/(\w+)/) {|s| s.capitalize}

      self.data['permalink'] = '/'+dir+'/'+path

      tag_title_prefix = site.config['tag_title_prefix'] || 'Posts Tagged &ldquo;'
      tag_title_suffix = site.config['tag_title_suffix'] || '&rdquo;'

      self.data['title'] = "#{tag_title_prefix}#{prettytag}#{tag_title_suffix}"

      # if this tag has associated location (defined in _config.yml), add it
      if site.config['tag_location'][tag.delete(' ')]
        self.data['location'] = site.config['tag_location'][tag.delete(' ')]
      end
    end
  end

  class TagGenerator < Generator
    safe true
    def generate(site)
      if site.layouts.key? 'tag_index'
        dir = site.config['tag_dir'] || 'tag'

        site.tags.keys.each do |tag|
          write_tag_index(site, dir, tag)
        end
      end
    end

    def write_tag_index(site, dir, tag)
      path = tag.delete(' ') + '.html'

      index = TagIndex.new(site, site.source, dir, tag, path)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)

      site.pages << index
    end
  end
end
