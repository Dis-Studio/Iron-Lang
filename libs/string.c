#include <stddef.h>

void setString(char *str, char *newstr){
    for(; *newstr != 0; newstr++, str++)
        *str = *newstr;
}
size_t stringLength(char *str){
    size_t length = 0;
    for(; *str != 0; str++, length++);
    return length;
}