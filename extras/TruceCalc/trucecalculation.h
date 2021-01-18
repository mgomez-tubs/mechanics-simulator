#ifndef TRUCECALCULATION_H
#define TRUCECALCULATION_H

#include <Eigen/Dense>
#include <iostream>

using std::cout;
using std::endl;

using Eigen::Array;
using Eigen::ArrayXd;
using Eigen::ArrayXi;
using Eigen::ArrayX2d;
using Eigen::ArrayX2i;
using Eigen::Array4i;

using Eigen::MatrixXd;
using Eigen::MatrixX2d;
using Eigen::Matrix4d;

using Eigen::VectorXd;

// Matrix manipulation
using Eigen::seq;

// Structs
struct rearrangedMatrixXd {
    MatrixXd matrix;
    ArrayXd sequence;
};

class TruceCalculation
{
public:
    TruceCalculation(ArrayX2d, ArrayX2i, ArrayXd, ArrayXi);

private:
    // Calculate
    MatrixX2d calculateLagerkraefte(ArrayX2d, ArrayX2i, ArrayXd, ArrayXi);
    Matrix4d  calculate_k_stab(int, ArrayX2d, ArrayX2i);

    // Builders
    Array<Matrix4d,Eigen::Dynamic,1> buildkStab_liste(ArrayX2d, ArrayX2i);
    double getAngleRelativeToXAxis(ArrayXi stabStart, ArrayXi stabEnd);
    Array<Array4i, Eigen::Dynamic, 1> buildElementIndexVector(ArrayX2d);
    MatrixXd buildSystemSteifigkeitsMatrix(int, Array<Matrix4d,Eigen::Dynamic,1>, Array<Array4i, Eigen::Dynamic, 1>);
    rearrangedMatrixXd conservativeRowBottomPush(MatrixXd, ArrayXi);
    VectorXd buildPf(ArrayXd, ArrayXd, int);

    // Matrix extraction
    Array<MatrixXd,2,2> extractSubmatricesFromK(MatrixXd, int);

    // Shifts
    MatrixXd shiftRowToLast(MatrixXd, int);
    MatrixXd shiftColumnToLast(MatrixXd, int);

    // Input variables
    ArrayX2d elementMatrix;
    ArrayX2i knotenMatrix;
    ArrayXd  aussenKraefteVector;
    ArrayXi  lagerVector;

    // Misc
    double getAngleFromStab(int);

    // Methods
    double buildkStab_Liste(double**, double**);
};



#endif // TRUCECALCULATION_H
