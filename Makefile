TRANSCRIBER = tsc

all:
	$(TRANSCRIBER) runGitHubApi.ts

test: 
	node runGitHubApi.js

clean: 
	rm runGitHubApi.js

PHONY:
