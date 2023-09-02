TRANSCRIBER = tsc

all:
	$(TRANSCRIBER) createToken.ts
	$(TRANSCRIBER) runGitHubApi.ts

test: 
	node runGitHubApi.js

clean: 
	rm createToken.js runGitHubApi.js

PHONY:
