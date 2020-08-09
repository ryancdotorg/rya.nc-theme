LESS_INCLUDE = --include-path=static/css/src:static/img:static/font
FONT_NAMES = iosevka-ryanc
FONT_STYLES = regular bold italic bolditalic
FONT_SUBSETS = basic latin greek symbol other full
FONT_EXTS = woff woff2

#map = $(foreach a,$(2),$(call $(1),$(a)))

font_styles = $(patsubst %,static/font/%,$(patsubst %,$(1)-%,$(FONT_STYLES)))
font_subsets = $(foreach style,$(font_styles),$(patsubst %,$(style)-%, $(FONT_SUBSETS)))
font_files = $(foreach subset,$(font_subsets),$(patsubst %,$(subset).%, $(2)))

all: style theme_js

theme_js: bundle_js min_js

bundle_js: $(sort $(patsubst %/,%.bundle.js,$(dir $(wildcard static/js/*/*.js))))

min_js: $(patsubst %.js,%.min.js,$(filter-out %.min.js,$(filter-out %.bundle.js,$(wildcard static/js/*.js))))

font: $(patsubst %,static/css/iosevka-ryanc-%.css,$(FONT_EXTS))

style: static/css/inline.css static/css/print.css $(patsubst %,static/css/iosevka-ryanc-%.css,$(FONT_EXTS))

%.min.js: %.js
	terser --safari10 --emca 5 -c passes=2 -m --mangle-props regex=/^_/ -o $@ $<

%.bundle.js: %/*.js
	terser --safari10 --emca 5 -c passes=2 -m --mangle-props regex=/^_/ -o $@ $^
#terser --safari10 --emca 5 -e window,document:window,document -c passes=2 -m --mangle-props regex=/^_/ -o $@ $(sort $^)

static/js/cssasync.min.js: static/js/loadCSS_1.3.1.js static/js/cssrelpreload_1.3.1.js
	terser --safari10 --emca 5 $^ -cmo $@

#static/js/cssryanc.min.js: static/js/cssryanc.js
#	terser --safari10 --emca 5 -c evaluate=false -m --mangle-props regex=/^_/ -o $@ $<

static/css/%.css: static/css/src/%.less static/css/src/*.less static/css/src/*.css
	lessc $(LESS_INCLUDE) $< | csso | tr -d '\n' > $@

static/font/%.otf: static/font/%.woff
	woff2sfnt $< > $@

static/font/%.uwoff: static/font/%.otf
	sfnt2uwoff $<

static/font/%-full.woff: static/font/src/%.ttf
	pyftsubset $< --unicodes='*' \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-full.woff2: static/font/src/%.ttf
	pyftsubset $< --unicodes='*' \
		--flavor=woff2 --output-file=$@

static/font/%-basic.woff: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0020-007E,U+00A0-00BF,U+00D7,U+00F7 \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-basic.woff2: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0020-007E,U+00A0-00BF,U+00D7,U+00F7 \
		--flavor=woff2 --output-file=$@

static/font/%-latin.woff: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0000-001F,U+007F-009F,U+00C0-00D6,U+00D8-00F6,U+00F9-036F,U+1E00-1EFF,U+2000-20CF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-latin.woff2: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0000-001F,U+007F-009F,U+00C0-00D6,U+00D8-00F6,U+00F9-036F,U+1E00-1EFF,U+2000-20CF \
		--flavor=woff2 --output-file=$@

static/font/%-greek.woff: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0370-03FF,U+1F00-1FFF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-greek.woff2: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0370-03FF,U+1F00-1FFF \
		--flavor=woff2 --output-file=$@

static/font/%-symbol.woff: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+20D0-2BFF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-symbol.woff2: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+20D0-2BFF \
		--flavor=woff2 --output-file=$@

static/font/%-other.woff: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0400-01DFF,U+2E80-1FFFFF \
		--flavor=woff --with-zopfli --output-file=$@

static/font/%-other.woff2: static/font/src/%.ttf
	pyftsubset $< --unicodes=U+0400-01DFF,U+2E80-1FFFFF \
		--flavor=woff2 --output-file=$@


clean:
	rm static/font/*.woff 2> /dev/null || true
	rm static/font/*.woff2 2> /dev/null || true
	rm static/css/*.css 2> /dev/null || true
	rm static/js/*.min.js 2> /dev/null || true
	rm static/js/*.bundle.js 2> /dev/null || true

.PHONY: all clean style theme_js bundle_js min_js

.SECONDARY:
.SECONDEXPANSION:
static/css/%-woff.css:  static/css/src/%.less static/css/src/font-face.less $$(call font_files, $$*, woff)
	lessc $(LESS_INCLUDE) --global-var="@font-format=woff"  $< $@

static/css/%-woff2.css: static/css/src/%.less static/css/src/font-face.less $$(call font_files, $$*, woff2)
	lessc $(LESS_INCLUDE) --global-var="@font-format=woff2" $< $@
