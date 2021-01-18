#include "trucecalculation.h"

TruceCalculation::TruceCalculation(ArrayX2d elementMatrix, ArrayX2i knotenMatrix, ArrayXd aussenKraefteVector, ArrayXi lagerVector)
{
    // Store input variables
    this->elementMatrix = elementMatrix;
    this->knotenMatrix  = knotenMatrix;
    this-> aussenKraefteVector = aussenKraefteVector;
    this->lagerVector = lagerVector;

    calculateLagerkraefte(elementMatrix, knotenMatrix, aussenKraefteVector, lagerVector);

    std::cout << "Good!" << std::endl;
}

MatrixX2d TruceCalculation::calculateLagerkraefte(ArrayX2d elementMatrix, ArrayX2i knotenMatrix, ArrayXd aussenKraefteVector, ArrayXi lagerVector){
    // Bilde Liste der Elementsteifigkeiten kStab_liste (> Tested)
    Array<Matrix4d,Eigen::Dynamic,1> kStab_liste = this->buildkStab_liste(elementMatrix, knotenMatrix);

    // Bilde Element Indexvektor elementIndexVector (> Tested)
    Array<Array4i, Eigen::Dynamic, 1> elementIndexVector = buildElementIndexVector(elementMatrix);

    // Bilde Systemsteifigkeitsmatrix K_mtrx
    MatrixXd K_mtrx = buildSystemSteifigkeitsMatrix(knotenMatrix.rows(), kStab_liste, elementIndexVector);

    cout << " " << endl << K_mtrx;

    // Bringe Lagerknoten runter
    rearrangedMatrixXd rearrangedMatrix = conservativeRowBottomPush(K_mtrx, lagerVector);



    // Store new K matrix and the sorted sequence
    K_mtrx = rearrangedMatrix.matrix;
    ArrayXd sorted_row_sequence = rearrangedMatrix.sequence;

    // Build K_mtrx submatrices
    Array<MatrixXd,2,2> K_mtrx_submatrices = extractSubmatricesFromK(K_mtrx, lagerVector.rows());

    // Build pF from aussenKraefteVector
    VectorXd pF = buildPf(aussenKraefteVector, sorted_row_sequence, lagerVector.rows());

    // Berechne Knotenverschiebungen K_11 * vF = pF
    MatrixXd vF = K_mtrx_submatrices(0,0).partialPivLu().solve(pF);
    cout << " " << endl << K_mtrx_submatrices(0,0);
    cout << " " << endl << pF;
    cout << " " << endl << vF;

    MatrixX2d pR(2,2);
    pR << 1,1,1,1;
    return pR;
}

// Build k_stab_liste
Array<Matrix4d,Eigen::Dynamic,1> TruceCalculation::buildkStab_liste(ArrayX2d elementMatrix, ArrayX2i knotenMatrix){
    // Store anzahl Staebe in a variable
    int anzStaebe = elementMatrix.rows();

    // Declare output array
    Array<Matrix4d,Eigen::Dynamic,1> kStab_liste(anzStaebe);

    // Fill output array
    for(int i = 0; i<anzStaebe; i++){
        kStab_liste(i) = calculate_k_stab(i, elementMatrix, knotenMatrix);
    }

    return kStab_liste;
}

// Calculate K_stab
Matrix4d TruceCalculation::calculate_k_stab(int stab, ArrayX2d elementMatrix, ArrayX2i knotenMatrix){
    // Get knoten of the stab
    int startKnoten_number  = elementMatrix(stab, 0);
    int endKnoten_number    = elementMatrix(stab, 1);

    // Get start and ending position of the stab
    ArrayXi stabStart = knotenMatrix.row(startKnoten_number);
    ArrayXi stabEnd   = knotenMatrix.row(endKnoten_number);

    // Get angle of Stab, relative to X-Axis
    double angle = getAngleRelativeToXAxis(stabStart, stabEnd);

    // Calculate c and s
    double c = cos(angle);
    double s = sin(angle);

    // Prefetch variables
    double cc=c*c;
    double sc=s*c;
    double ss=s*s;

    // Build k_stab
    Matrix4d k_stab;
    k_stab <<   cc,sc,-cc,-sc,
                sc,ss,-sc,-ss,
                -cc,-sc,cc,sc,
                -sc,-ss,sc,ss;

    return k_stab;
}

// Build Element Index Vector
Array<Array4i, Eigen::Dynamic, 1> TruceCalculation::buildElementIndexVector(ArrayX2d elementMatrix){
    Array<Array4i, Eigen::Dynamic, 1> elementIndexVector(elementMatrix.rows());

    for(int i = 0; i<elementIndexVector.rows(); i++){
        int startKnoten = elementMatrix(i,0);
        int endKnoten   = elementMatrix(i,1);
        elementIndexVector(i) << 2*startKnoten-1, 2*startKnoten, 2*endKnoten-1, 2*endKnoten;
        elementIndexVector(i)+=1;
    }
    return elementIndexVector;
}

// Build Systemsteifigkeitsmatrix
MatrixXd TruceCalculation::buildSystemSteifigkeitsMatrix(int knotenAnzahl, Array<Matrix4d,Eigen::Dynamic,1> kStab_liste, Array<Array4i, Eigen::Dynamic, 1> IV){
    MatrixXd K_mtrx(knotenAnzahl*2, knotenAnzahl*2);
    std::cout << "Knotenanzahl ist " << knotenAnzahl << std::endl;
    // Fill with zeroes
    K_mtrx = MatrixXd::Zero(knotenAnzahl*2, knotenAnzahl*2);

    for(int currentStab=0; currentStab<IV.rows(); currentStab++){
        for(int j=0; j<4; j++){
            for(int k=0; k<4; k++){
                K_mtrx(IV(currentStab)(j), IV(currentStab)(k)) += kStab_liste(currentStab)(j,k);
            }
        }
    }
    return K_mtrx;
}

// Conservative Row Bottom Push
rearrangedMatrixXd TruceCalculation::conservativeRowBottomPush(MatrixXd matrix, ArrayXi rows_to_push){
    // Create a new variable to store the rows to be pushed
    ArrayXi trf_rows_to_push = rows_to_push;
    ArrayXd vector(matrix.rows());

    // Create vector which stores the new sort
    for(int i = 0; i < matrix.rows(); i++){
        vector(i) = i;
    }

    // Since every time we shift a row to the bottom and consequently move all the elements below up,
    // the order of the elements is changed, we transform the original rows to push
    // to take every one of this back pushes into account.

    // Temporal variable for backpush
    int backpush = 0;

    for(int i = 0; i < rows_to_push.rows(); i++){
        backpush++;
        trf_rows_to_push(i) = rows_to_push(i) - backpush;
    }

    for(int i = 0; i < rows_to_push.rows(); i++){
        // Build matrix
        matrix = shiftColumnToLast(shiftRowToLast(matrix, trf_rows_to_push(i)), trf_rows_to_push(i));
        // Build sorting vector
        vector = shiftRowToLast(vector, trf_rows_to_push(i));
    }

    rearrangedMatrixXd rearrangedMatrix = {matrix, vector};

    return rearrangedMatrix;
}

// Shift Row to Last
MatrixXd TruceCalculation::shiftRowToLast(MatrixXd A, int input_row){
    MatrixXd A_new = A;

    // Bring input row to the end
    A_new(Eigen::last,Eigen::all) = A(input_row, Eigen::all);

    // Shift everything up from input_row
    for(int i = input_row; i<A_new.rows()-1; i++){  // Careful: This -1 is not because of the index shifting from octave to c++, but because we already set the last row of the new matrix before
        A_new(i, Eigen::all) = A(i+1, Eigen::all);
    }
    return A_new;
}

// Shift Column to Last
MatrixXd TruceCalculation::shiftColumnToLast(MatrixXd M, int input_column){
    MatrixXd M_new = M;

    // Bring the input column to the end
    M_new(Eigen::all, Eigen::last) = M_new(Eigen::all, input_column);

    // Shift eveything left from input column
    for(int i = input_column; i < M.rows()-1; i++){
        M_new(Eigen::all, i) = M(Eigen::all, i+1);
    }
    return M_new;
}

// Extract submatrices From K
Array<MatrixXd,2,2> TruceCalculation::extractSubmatricesFromK(MatrixXd K_mtrx, int anzahlLager){
    Array<MatrixXd,2,2> K_matrx_submatrices(2,2);
    int a = K_mtrx.rows() - anzahlLager;

    K_matrx_submatrices(0,0) = K_mtrx(Eigen::seqN(0,a), Eigen::seqN(0,a));
    K_matrx_submatrices(0,1) = K_mtrx(Eigen::seqN(0,a), Eigen::seq(a,Eigen::last));
    K_matrx_submatrices(1,0) = K_mtrx(Eigen::seq(a,Eigen::last),Eigen::seqN(0,a));
    K_matrx_submatrices(1,1) = K_mtrx(Eigen::seq(a,Eigen::last),Eigen::seq(a,Eigen::last));

    return K_matrx_submatrices;
}

// Build pF
VectorXd TruceCalculation::buildPf(ArrayXd input_vector, ArrayXd sorted_row_sequence, int anzahlLaeger){
    VectorXd vector(input_vector.rows()-anzahlLaeger);
    for(int i = 0; i < vector.rows(); i++){
        vector(i) = input_vector((int) sorted_row_sequence(i)); // TODO: Fix this
    }
    cout << vector << endl;
    return vector;
}

double TruceCalculation::getAngleRelativeToXAxis(ArrayXi stabStart,ArrayXi stabEnd){
    double steigung = (stabEnd(1)-stabStart(1))/(stabEnd(0)-stabStart(0));
    double angle =  atan(steigung);
    return angle;
}
