require "redcarpet"
require "rouge"
require "rouge/plugins/redcarpet"

class String
    # colorization
    def colorize(color_code)
      "\e[#{color_code}m#{self}\e[0m"
    end
  
    def red
      colorize(31)
    end
  
    def green
      colorize(32)
    end
  
    def yellow
      colorize(33)
    end
  
    def blue
      colorize(34)
    end
  
    def pink
      colorize(35)
    end
  
    def light_blue
      colorize(36)
    end
end

class Runnable < Redcarpet::Render::HTML
    include Rouge::Plugins::Redcarpet
    # def image(link, title, alt)
    #     puts "TESTING!"
    #     name = File.basename(link, ".*")
    #     img = "<img src=\"#{link}\" alt=\"#{alt}\" title=\"#{title}\">"
    #     figure = "<a href=\"#{link}\" data-lightbox=\"#{name}\" data-title=\"#{alt}\">#{img}</a>"
    #     caption = title ? "<figcaption>#{title}</figcaption>" : ""
    #     return "<figure>#{figure}#{caption}</figure>"
    # end

    def postprocess(doc)
        # puts doc
        if doc.include? "```"
            raise "\nERROR: fenced code block not properly parsed!"
            # return nil
        end
        return doc
    end

    def generate_id(str)
        gen_id = basic_generate_id(str)
        gen_id = 'section' if gen_id.empty?
        @used_ids ||= {}
        if @used_ids.key?(gen_id)
            gen_id += "-#{@used_ids[gen_id] += 1}"
        else
            @used_ids[gen_id] = 0
        end
        return gen_id
    end

    # The basic version of the ID generator, without any special provisions for empty or unique
    # IDs.
    def basic_generate_id(str)
        gen_id = str.gsub(/^[^a-zA-Z]+/, '')
        gen_id.tr!('^a-zA-Z0-9 -', '')
        gen_id.tr!(' ', '-')
        gen_id.downcase!
        gen_id
    end

    def header(text, level)
        theId = generate_id(text)
        tag = "h#{level}"
        "<#{tag} id=\"#{theId}\">#{text}</#{tag}>"
    end

    RE_PATH = %r{path=(?<path>[^,]+)}
    RE_SLICE = %r{slice=(?<slice>\d+)}

    def get_path_slice(attrsStr)
        if matches = attrsStr.match(RE_PATH)
            path = matches[:path]
        else
            path = nil
        end

        if matches = attrsStr.match(RE_SLICE)
            slice = matches[:slice]
        else
            slice = nil
        end

        return path, slice
    end

    def block_code(code, language)
        if language.nil? then
            return super(code, language)
        end

        attrs = language.split(',')
        if (attrs.include? 'idris') && !(attrs.include? 'ignore') && !(attrs.include? 'noplaypen') then
            # puts "Attributes:"
            # puts attrs
            # puts "\nCode:"
            # puts code

            pathM, sliceM = get_path_slice(language)
            if pathM.nil? && sliceM.nil? then
                dataFields = ""
                classFields = ""
            elsif pathM.nil? then
                dataFields = ""
                classFields = ""
            elsif sliceM.nil? then
                dataFields = " data-path=\"#{pathM}\" data-slice=\"0\""
                classFields = " path=#{pathM} slice=0"
            else
                dataFields = " data-path=\"#{pathM}\" data-slice=\"#{sliceM}\""
                classFields = " path=#{pathM} slice=#{sliceM}"
            end

            editableClass = (attrs.include? 'editable') ? '' : 'readonly'
            norunClass = (attrs.include? 'norun') ? ' norun' : ''

            codeEsc = CGI::escapeHTML(code)
            retVal = "<pre class=\"playpen-wrapper\"><pre class=\"playpen#{norunClass}\"#{dataFields}><code class=\"language-idris editable #{editableClass}#{classFields}\">#{codeEsc}</code></pre></pre>"
            
            # retVal2 = super(code, language)
            
            # puts "Data fields:"
            # puts dataFields
            # puts "HTML:"
            # puts retVal
            # puts "old HTML:"
            # puts retVal2
            # puts "\n===================\n\n"
            return retVal
        else
            lang = attrs[0]
            super(code, lang)
        end
    end
end

class Jekyll::Converters::Markdown::Runnable
    def initialize(config)
        @config = config
        options = {
            strikethrough: true,
            no_intra_emphasis: true,
            tables: true,
            space_after_headers: true,
            underline: true,
            footnotes: true,
            fenced_code_blocks: true
        }
        @renderer = Redcarpet::Markdown.new(Runnable, options)
    end

    def convert(content)
        @renderer.render(content)
    end
end