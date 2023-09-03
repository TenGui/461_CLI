TRANSCRIBER = tsc

all:
	$(TRANSCRIBER) runNpmApi.ts

test: 
	node runNpmApi.js

clean: 
	rm runNpmApi.js

PHONY:
