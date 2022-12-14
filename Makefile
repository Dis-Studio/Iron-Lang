.DEFAULT_GOAL := all

.PHONY: libs build install run all

libs:
	@echo "Installing the right libraries..."
	@sudo npm i pkg -g
	@sudo pacman -S gcc nodejs
build:
	@echo "Compilation..."
	@pkg src/index.js
	@echo "Transferring files to the build directory..."
	@mv index-linux build/Iron-Lang-linux
	@mv index-macos build/Iron-Lang-macos
	@mv index-win.exe build/Iron-Lang-win.exe
install: build
	@echo Installing...
	@sudo cp build/Iron-Lang-linux /bin/ironlang
	@sudo cp build/Iron-Lang-linux /usr/bin/ironlang
	
run:
	@echo "Compiling the test code..."
	@node src/index.js -f examples/test.in -o test
	@echo "Running the test code..."
	@echo
	@./test