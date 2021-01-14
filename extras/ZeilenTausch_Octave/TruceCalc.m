#
# Careful: this does only work for Staebe with the same EA and auch gleiche Länge
#
#

# Clean Terminal and variables
clc
clear all

# Use custom path
addpath("Functions")

# Get beispiel Knotenmatrix and Elementmatrix
knotenMatrix = getKnotenMatrix_bsp();
elementMatrix = getElementMatrix_bsp();
aussenkraefteVektor = [0;0;0;4;-5;0;0]
######################
# Calculate k
k_pseudo = getk_pseudo_hypermatrix(elementMatrix, knotenMatrix); # Returns 7x1 Cell
k = transform_to_hypermatrix(k_pseudo);                          # Returns 7x7 Cell

# Calculate K_matrx
A = buildZuordnungsMatrix(elementMatrix, rows(knotenMatrix));    # Returns 5x14 Matrix

ATk = mbinary22MatrixCell2m2m(A',k);  
K = mCell2m2mbinary22Matrix(ATk,A);
K_matrx = cell2mat(K);

# Bringe Lagerknoten runter
multiplicand_sorting_vector = [1;2;3;4;5;6;7;8;9;10]; #1,2 -> 1x1y; 23 -> 2x2y ...

neweq = conservativeRowBottomPush(K_matrx,multiplicand_sorting_vector,[1;2;6]);
K_matrx = neweq{1};
multiplicand_sorting_vector= neweq{2};

# Extrahiere Submatrizen von K
K_matrx_11 = K_matrx([1:7],[1:7]);
K_matrx_12 = K_matrx([1:7],[8:10]);
K_matrx_21 = K_matrx([8:10],[1:7]);
K_matrx_22 = K_matrx([8:10],[8:10]);

# Bilde pF
pF = aussenkraefteVektor;

# Berechne Knotenverschiebungen vF
vF = inv(K_matrx_11) * pF;

# Ermittlung Auflagerreaktionsgroessen
pR = K_matrx_21 * vF
