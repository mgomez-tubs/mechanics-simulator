#include "trucecalculation.h"
#include <Eigen/Core>
#include <iostream>

using Eigen::ArrayXd;
using Eigen::ArrayX2d;

int main()
{
    std::cout << "Program starting..." << std::endl;

    // Element matrix - as ArrayX2i
    ArrayX2i elementMatrix(7,2);
    elementMatrix <<    1,2,
                        2,3,
                        4,5,
                        1,4,
                        2,5,
                        2,4,
                        3,5;

    // Element matrix - as double[] and Column Major!
    int elementMatrix2[14] = {1,2,2,3,4,5,1,4,2,5,2,4,3,5};

    const int anz_Elemente = 7;

    //std::cout <<    elementMatrix << std::endl;

    ArrayX2d knotenMatrix(5,2);
    knotenMatrix<<      0,    0,
                        270,  468,
                        540,  0,
                        810,  468,
                        1080, 0;
    double knotenMatrix2[10] = {0,0,270,468,540,0,810,468,1080,0};
    int anz_Knoten = 5;

    ArrayXd aussenKraefteVector(10);
    aussenKraefteVector <<  0,0,4,-5,0,0,0,0,0,0;
    double aussenKraefteVector2[10] = {0,0,4,-5,0,0,0,0,0,0};

    ArrayXi lagerVector(3);
    lagerVector <<  1,2,10;
    int lagerVector2[3] = {1,2,10};
    int anz_Lager = 3;

    //TruceCalculation truceCalculation(elementMatrix, knotenMatrix, aussenKraefteVector, lagerVector);
    //truceCalculation.calculateLagerkraefte();

    TruceCalculation truceCalculation(elementMatrix2, anz_Elemente, knotenMatrix2, anz_Knoten, aussenKraefteVector2, lagerVector2, anz_Lager);
    truceCalculation.calculateLagerkraefte();
    cout << truceCalculation.getResult();

    return 0;
}
