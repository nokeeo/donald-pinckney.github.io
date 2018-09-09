# donald-pinckney.github.io

# License
The content of all blog posts (files ending in `.md` contained in `_posts/`), all book content (files contained in `books/`), and other content files  (files contained in `public/files/`) remain the sole property of Donald Pinckney, unless otherwise specified. The remaining source code used to format and display that content is licensed under the MIT license.

# Setup Dependencies
## Ubuntu
```bash
# Install Ruby and Jekyll stuff
sudo apt install ruby ruby-dev
sudo gem install jekyll jekyll-paginate jekyll-gist github-pages jekyll-sitemap jekyll-seo-tag bundler

# Install Rust and mdbook stuff
curl https://sh.rustup.rs -sSf | sh # (follow direction, maybe have to setup PATH, and probably restart your shell)
cargo install mdbook
```

# How to build and run
To build and locally preview the site, run `./run` from the root directory of the repository, and then navigate to [http://127.0.0.1:4000/](http://127.0.0.1:4000/)
