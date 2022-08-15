%macro sys_call 4
    mov eax, %1
    mov ebx, %2
    mov ecx, %3
    mov edx, %4
    int 80h
%endmacro


%macro exit 1
    sys_call 1, %1, 0, 0
%endmacro
%macro print 1
    jmp %%astr
%%str db %1
%%strln equ $-%%str
%%astr: sys_call 4, 1, %%str, %%strln
%endmacro
%macro println 1
    print %1
    print 10
%endmacro