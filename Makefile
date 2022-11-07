LESS_INCLUDE = --include-path=src/css:src/font:src/img:static/css/src:static/img:static/font
FONT_NAMES = iosevka-ryanc
FONT_STYLES = regular bold italic bolditalic
FONT_SUBSETS = basic latin greek symbol other full
FONT_EXTS = woff woff2

#map = $(foreach a,$(2),$(call $(1),$(a)))

font_styles = $(patsubst %,static/font/%,$(patsubst %,$(1)-%,$(FONT_STYLES)))
font_subsets = $(foreach style,$(font_styles),$(patsubst %,$(style)-%, $(FONT_SUBSETS)))
font_files = $(foreach subset,$(font_subsets),$(patsubst %,$(subset).%, $(2)))

icons = Mastodon Twitter GitHub LinkedIn Email RSS
icon_sources = $(patsubst %,src/img/icon-%.svg, $(icons))

all: style javascript

image: static/img/icons.svg static/img/hdr-760-24yiq07.png \
	static/img/hdr-760-zq.webp static/img/hdr-760.jpg \
	static/img/hdr-760.webp static/img/hdr-760.avif \
	static/img/hex_mask_tile.png \
	$(patsubst %,static/img/icon-%.png, $(icons))

javascript: bundle_js min_js

bundle_js: $(patsubst %/,%.bundle.js,$(foreach js,$(sort $(dir $(wildcard src/js/*/*.js))),$(subst src/,static/,$(js))))

min_js: $(patsubst %.js,%.min.js,$(foreach js,$(wildcard src/js/*.js),$(subst src/,static/,$(js))))

ext_js: static/js/hyphenopoly_loader.min.js

font: $(patsubst %,static/css/iosevka-ryanc-%.css,$(FONT_EXTS))

style: static/css/inline.css static/css/print.css $(patsubst %,static/css/iosevka-ryanc-%.css,$(FONT_EXTS))

static/%: src/%
	cp -a $< $@

static/js/hyphenopoly_loader.min.js: ext/Hyphenopoly-4.12.0/Hyphenopoly_Loader.js
	terser $< -safari10 --ecma 5 -c passes=2 -m -d \
	'Hyphenopoly={"require":{"en-us":"anesthesiologist"},"setup":{"selectors":".article"}}' \
	-o $@

static/js/Hyphenopoly.js: ext/Hyphenopoly-4.12.0/Hyphenopoly.js
	terser $< -safari10 --ecma 5 -c passes=2 -m -o $@

static/js/%.min.js: src/js/%.js
	terser $< --safari10 --ecma 5 -c passes=2 -m reserved=_ --mangle-props regex=/^_.+/ \
	| terser --safari10 --ecma 5 --define _=\"\" -o $@

static/css/%.css: src/css/%.less
	lessc $(LESS_INCLUDE) $< | csso | tr -d '\n' > $@

static/css/%.css: src/css/%.css
	csso < $< | tr -d '\n' > $@

static/css/inline.css: src/css/inline.less src/css/*.less src/css/*.css \
                       static/img/hdr-760-zq.webp \
                       static/img/hex_mask_tile.png
	lessc $(LESS_INCLUDE) $< | csso | tr -d '\n' > $@

static/img/icons.svg: $(icon_sources)
	scripts/svgtool.py merge $^ > $@

static/img/icon-%.png: src/img/icon-%.svg
	convert -density 600 -resize 120x120 -background transparent -dither None -colors 8 $< $@
	zopflipng -y --iterations=10 --filters=01234meb --lossy_transparent $@ $@ > /dev/null

static/img/%.webp: static/img/%.png
	cwebp -quiet -z 9 $< -o $@

static/font/%.otf: static/font/%.woff
	woff2sfnt $< > $@

static/font/%.uwoff: static/font/%.otf
	sfnt2uwoff $<

static/font/%-full.woff: src/font/%.ttf
	pyftsubset $< --unicodes='*' \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-full.woff2: src/font/%.ttf
	pyftsubset $< --unicodes='*' \
		--flavor=woff2 --output-file=$@

static/font/%-basic.woff: src/font/%.ttf
	pyftsubset $< --unicodes=U+0020-007E,U+00A0-00BF,U+00D7,U+00F7 \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-basic.woff2: src/font/%.ttf
	pyftsubset $< --unicodes=U+0020-007E,U+00A0-00BF,U+00D7,U+00F7 \
		--flavor=woff2 --output-file=$@

static/font/%-latin.woff: src/font/%.ttf
	pyftsubset $< --unicodes=U+0000-001F,U+007F-009F,U+00C0-00D6,U+00D8-00F6,U+00F9-036F,U+1E00-1EFF,U+2000-20CF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-latin.woff2: src/font/%.ttf
	pyftsubset $< --unicodes=U+0000-001F,U+007F-009F,U+00C0-00D6,U+00D8-00F6,U+00F9-036F,U+1E00-1EFF,U+2000-20CF \
		--flavor=woff2 --output-file=$@

static/font/%-greek.woff: src/font/%.ttf
	pyftsubset $< --unicodes=U+0370-03FF,U+1F00-1FFF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-greek.woff2: src/font/%.ttf
	pyftsubset $< --unicodes=U+0370-03FF,U+1F00-1FFF \
		--flavor=woff2 --output-file=$@

static/font/%-symbol.woff: src/font/%.ttf
	pyftsubset $< --unicodes=U+20D0-2BFF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-symbol.woff2: src/font/%.ttf
	pyftsubset $< --unicodes=U+20D0-2BFF \
		--flavor=woff2 --output-file=$@

static/font/%-other.woff: src/font/%.ttf
	pyftsubset $< --unicodes=U+0400-01DFF,U+2E80-10FFFF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-other.woff2: src/font/%.ttf
	pyftsubset $< --unicodes=U+0400-01DFF,U+2E80-10FFFF \
		--flavor=woff2 --output-file=$@

clean: clean_js clean_css

clean_all: clean_js clean_css clean_font

clean_font:
	rm static/font/*.woff 2> /dev/null || true
	rm static/font/*.woff2 2> /dev/null || true

clean_css:
	rm static/css/*.css 2> /dev/null || true

clean_js:
	rm static/js/*.js 2> /dev/null || true

.PHONY: all clean font style javascript image \
	clean_all clean_font clean_css clean_js \
	bundle_js min_js ext_js

.SECONDARY:
.SECONDEXPANSION:
static/css/%-woff.css:  src/css/%.less src/css/font-face.less $$(call font_files, $$*, woff)
	lessc $(LESS_INCLUDE) --global-var="@font-format=woff"  $< | csso | tr -d '\n' > $@

static/css/%-woff2.css: src/css/%.less src/css/font-face.less $$(call font_files, $$*, woff2)
	lessc $(LESS_INCLUDE) --global-var="@font-format=woff2" $< | csso | tr -d '\n' > $@

static/js/%.bundle.js: $$(sort $$(wildcard src/js/$$*/*.js))
	terser $^ --safari10 --ecma 5 -c passes=2 -m reserved=_ --mangle-props regex=/^_.+/ \
		-e window,document,location,navigator:window,document,location,navigator \
	| terser --safari10 --ecma 5 --define _=\"\" \
	| sed -E 's/try[{]Z[}]catch[(].[)][{][}]//' > $@
