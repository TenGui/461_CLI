TRANSCRIBER = tsc
FILENAME = gitApiEx

all:
	$(TRANSCRIBER) $(FILENAME).ts

test: 
	node $(FILENAME).js

PHONY:
