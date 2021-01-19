#include <emscripten/bind.h>
double number_array[5] = {0,1,2,3,4};
extern "C" {
    double* get_array();
}

double* get_array(){
    return number_array;
}