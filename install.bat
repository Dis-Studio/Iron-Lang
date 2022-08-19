echo "Transferring files to the build directory..."
move index-linux build/Iron-Lang-linux
move index-macos build/Iron-Lang-macos
move index-win.exe build/Iron-Lang-win.exe
copy build/Iron-Lang-win.exe C:/Windows/system32/ironlang.exe