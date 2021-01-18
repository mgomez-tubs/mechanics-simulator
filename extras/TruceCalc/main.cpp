#include "trucecalculation.h"
#include <Eigen/Core>
#include <iostream>

using Eigen::ArrayXd;
using Eigen::ArrayX2d;

int main()
{
    std::cout << "Program starting..." << std::endl;

    ArrayX2i elementMatrix(7,2);
    elementMatrix <<    1,2,
                        2,3,
                        4,5,
                        1,4,
                        2,5,
                        2,4,
                        3,5;
    // Transform to C++ friendly index numbers
    elementMatrix-=1;

    //std::cout <<    elementMatrix << std::endl;

    ArrayX2d knotenMatrix(5,2);
    knotenMatrix<<      0,    0,
                        270,  468,
                        540,  0,
                        810,  468,
                        1080, 0;

    //std::cout <<    knotenMatrix << std::endl;

    ArrayXd aussenKraefteVector(10);
    aussenKraefteVector <<  0,0,4,-5,0,0,0,0,0,0;

    //std::cout <<    aussenKraefteVector << std::endl;

    ArrayXi lagerVector(3);
    lagerVector <<  1,2,10;

    //std::cout <<    lagerVector << std::endl;

    TruceCalculation truceCalculation(elementMatrix, knotenMatrix, aussenKraefteVector, lagerVector);
    return 0;
}
