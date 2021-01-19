#include <emscripten/bind.h>
double number_array[5] = {0.00, 0.01,0.02,0.03,0.04};
extern "C" {
    double* get_array();
}

double* get_array(){
    return number_array;
}