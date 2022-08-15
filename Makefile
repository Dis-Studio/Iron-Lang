.DEFAULT_GOAL := all

.PHONY: libs build run all

libs:
	@echo "Installing the right libraries..."
	@sudo npm i pkg -g
build:
	@echo "Compilation..."
	@pkg src/index.js
	@echo "Transferring files to the build directory..."
	@mv index-linux build/Iron-Lang-linux
	@mv index-macos build/Iron-Lang-macos
	@mv index-win.exe build/Iron-Lang-win.exe
	
run:
	@echo "Compiling the test code..."
	@./build/Iron-Lang-linux examples/test.in
	@echo "Running the test code..."
	./examples/test

all: build run
