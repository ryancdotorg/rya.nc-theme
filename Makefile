LESS_INCLUDE = --include-path=src/css:src/font:src/img:static/css/src:static/img:static/font
FONT_NAMES = iosevka-ryanc
FONT_STYLES = regular bold italic bolditalic
FONT_SUBSETS = basic latin greek symbol other full
FONT_EXTS = woff woff2

#map = $(foreach a,$(2),$(call $(1),$(a)))

font_styles = $(patsubst %,static/font/%,$(patsubst %,$(1)-%,$(FONT_STYLES)))
font_subsets = $(foreach style,$(font_styles),$(patsubst %,$(style)-%, $(FONT_SUBSETS)))
font_files = $(foreach subset,$(font_subsets),$(patsubst %,$(subset).%, $(2)))

all: style javascript

javascript: bundle_js min_js

bundle_js: $(patsubst %/,%.bundle.js,$(foreach js,$(sort $(dir $(wildcard src/js/*/*.js))),$(subst src/,static/,$(js))))

min_js: $(patsubst %.js,%.min.js,$(foreach js,$(wildcard src/js/*.js),$(subst src/,static/,$(js))))

font: $(patsubst %,static/css/iosevka-ryanc-%.css,$(FONT_EXTS))

style: static/css/inline.css static/css/print.css $(patsubst %,static/css/iosevka-ryanc-%.css,$(FONT_EXTS))

static/js/%.min.js: src/js/%.js
	terser $< --safari10 --ecma 5 -c passes=2 -m --mangle-props regex=/^_/ -o $@

static/css/%.css: src/css/%.less
	lessc $(LESS_INCLUDE) $< | csso | tr -d '\n' > $@

static/css/inline.css: src/css/inline.less src/css/*.less src/css/*.css \
                       static/img/green-circuits-thin-1200-lq.webp \
                       static/img/hex_mask_tile.png
	lessc $(LESS_INCLUDE) $< | csso | tr -d '\n' > $@

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

.PHONY: all clean font style javascript \
	clean_all clean_font clean_css clean_js \
	bundle_js min_js

.SECONDARY:
.SECONDEXPANSION:
static/css/%-woff.css:  src/css/%.less src/css/font-face.less $$(call font_files, $$*, woff)
	lessc $(LESS_INCLUDE) --global-var="@font-format=woff"  $< $@

static/css/%-woff2.css: src/css/%.less src/css/font-face.less $$(call font_files, $$*, woff2)
	lessc $(LESS_INCLUDE) --global-var="@font-format=woff2" $< $@

static/js/%.bundle.js: $$(sort $$(wildcard src/js/$$*/*.js))
	terser $^ --safari10 --ecma 5 -c passes=2 -m --mangle-props regex=/^_/ \
		-e window,document,location,navigator:window,document,location,navigator \
		-o $@
