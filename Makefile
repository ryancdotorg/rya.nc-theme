all: static/js/cssasync.min.js static/css/inline.css theme_js

theme_js: bundle_js min_js

bundle_js: $(sort $(patsubst %/,%.bundle.js,$(dir $(wildcard static/js/*/*.js))))

min_js: $(patsubst %.js,%.min.js,$(filter-out %.min.js,$(filter-out %.bundle.js,$(wildcard static/js/*.js))))

%.min.js: %.js
	terser --safari10 --emca 5 -c passes=2 -m --mangle-props regex=/^_/ -o $@ $<

%.bundle.js: %/*.js
	terser --safari10 --emca 5 -c passes=2 -m --mangle-props regex=/^_/ -o $@ $^
#terser --safari10 --emca 5 -e window,document:window,document -c passes=2 -m --mangle-props regex=/^_/ -o $@ $(sort $^)

static/js/cssasync.min.js: static/js/loadCSS_1.3.1.js static/js/cssrelpreload_1.3.1.js
	terser --safari10 --emca 5 $^ -cmo $@

#static/js/cssryanc.min.js: static/js/cssryanc.js
#	terser --safari10 --emca 5 -c evaluate=false -m --mangle-props regex=/^_/ -o $@ $<
#	@echo >> $@

static/css/inline.css: $(wildcard static/css/src/*.css)
	csscombine static/css/src/import.css 2>/dev/null | \
	lessc - |  csso | tr -d '\n' > $@

clean:
	[ ! -f static/css/inline.css ] || rm static/css/inline.css
	rm static/js/*.min.js 2> /dev/null || true
	rm static/js/*.bundle.js 2> /dev/null || true

.PHONY: all clean theme_js bundle_js min_js
