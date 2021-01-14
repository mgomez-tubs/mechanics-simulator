# Clean Terminal and variables
clc
clear all

# Use custom path
addpath("Functions")

# Get beispiel Knotenmatrix and Elementmatrix
knotenMatrix = getKnotenMatrix_bsp();
elementMatrix = getElementMatrix_bsp();
aussenkraefteVektor = [0;0;0;0;0;0;4;-5;0;0];

lagerVector = [1;2;6];     # Lager in Knoten 1 Y Richtung: 2 und so

######################

# Calculate k
k_pseudo = getk_pseudo_hypermatrix(elementMatrix, knotenMatrix);
k = transform_to_hypermatrix(k_pseudo);                          

# Calculate K_matrx
A = buildZuordnungsMatrix(elementMatrix, rows(knotenMatrix));

ATk = mbinary22MatrixCell2m2m(A',k);  
K = mCell2m2mbinary22Matrix(ATk,A);
K_matrx = cell2mat(K);

# Bringe Lagerknoten runter
neweq = conservativeRowBottomPush(K_matrx,lagerVector);   
K_matrx = neweq{1};
multiplicand_sorting_vector= neweq{2};

K_matrx_submatrices = extractSubmatricesFromK(K_matrx, rows(lagerVector));

# Extrahiere Submatrizen von K
K_matrx_11 = K_matrx_submatrices{1,1};
K_matrx_12 = K_matrx_submatrices{1,2};
K_matrx_21 = K_matrx_submatrices{2,1};
K_matrx_22 = K_matrx_submatrices{2,2};

# Bilde pF from aussenKraefteVector
pF = aussenKraefteVectorTopF(aussenkraefteVektor, multiplicand_sorting_vector, rows(lagerVector))

# Berechne Knotenverschiebungen vF
vF = inv(K_matrx_11) * pF;

# Ermittlung Auflagerreaktionsgroessen
format short g
pR = K_matrx_21 * vF
