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
    TruceCalculation(ArrayX2i, ArrayX2d, ArrayXd, ArrayXi);
    VectorXd result;

    // Public Methods
    VectorXd getResult();
    double* getResultAsArray();

private:
    // Calculate
    VectorXd calculateLagerkraefte(ArrayX2i, ArrayX2d, ArrayXd, ArrayXi);
    Matrix4d  calculate_k_stab(int, ArrayX2i, ArrayX2d);

    // Builders
    Array<Matrix4d,Eigen::Dynamic,1> buildkStab_liste(ArrayX2i, ArrayX2d);
    double getAngleRelativeToXAxis(ArrayXd stabStart, ArrayXd stabEnd);
    Array<Array4i, Eigen::Dynamic, 1> buildElementIndexVector(ArrayX2i);
    MatrixXd buildSystemSteifigkeitsMatrix(int, Array<Matrix4d,Eigen::Dynamic,1>, Array<Array4i, Eigen::Dynamic, 1>);
    rearrangedMatrixXd conservativeRowBottomPush(MatrixXd, ArrayXi);
    VectorXd buildPf(ArrayXd, ArrayXd, int);

    // Matrix extraction
    Array<MatrixXd,2,2> extractSubmatricesFromK(MatrixXd, int);

    // Shifts
    MatrixXd shiftRowToLast(MatrixXd, int);
    MatrixXd shiftColumnToLast(MatrixXd, int);

    // Input variables
    ArrayX2i elementMatrix;
    ArrayX2d knotenMatrix;
    ArrayXd  aussenKraefteVector;
    ArrayXi  lagerVector;

    // Misc
    double getAngleFromStab(int);

    // Methods
    double buildkStab_Liste(double**, double**);
};



#endif // TRUCECALCULATION_H
