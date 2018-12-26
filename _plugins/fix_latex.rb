module Jekyll
    module FixLatexFilter
        def fix_latex(input)
            input.gsub('\\<br />', '\\\\\\')
        end
    end
end
 
Liquid::Template.register_filter(Jekyll::FixLatexFilter)