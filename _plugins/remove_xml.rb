# Remove xml from input

module Jekyll
  module RemoveXml

    def remove_xml(input)
	  input.gsub(/<.*?>/, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::RemoveXml)