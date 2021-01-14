#
# Careful: this does only work for Staebe with the same EA and auch gleiche L�nge
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
aussenkraefteVektor_ERS = [0;0;0;0;0;0;4;-5;0;0]; # Transform!
aussenkraefteVektor = [0;0;0;4;-5;0;0];
lagerVector = [1;2;6];     # Lager in Knoten 1 Y Richtung: 2 und so
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

neweq = conservativeRowBottomPush(K_matrx,multiplicand_sorting_vector,lagerVector);   
K_matrx = neweq{1};
multiplicand_sorting_vector= neweq{2};

function array = extractSubmatricesFromK(K_matrx, anzahlLaeger)
  array = cell(2,2);
  a = rows(K_matrx)-anzahlLaeger;
  b = rows(K_matrx);
  array(1,1) = K_matrx([1:a],[1:a]);
  array(1,2) = K_matrx([1:a],[a+1:b]);
  array(2,1) = K_matrx([a+1:b],[1:a]);
  array(2,2) = K_matrx([a+1:b],[a+1:b]);
endfunction

K_matrx_submatrices = extractSubmatricesFromK(K_matrx, rows(lagerVector));

# Extrahiere Submatrizen von K
K_matrx_11 = K_matrx_submatrices{1,1};
K_matrx_12 = K_matrx_submatrices{1,2};
K_matrx_21 = K_matrx_submatrices{2,1};
K_matrx_22 = K_matrx_submatrices{2,2};

function vector = aussenKraefteVectorTopF(input_vector, sorting_vector, anzahlLaeger)
  vector = zeros(rows(input_vector)-anzahlLaeger,1);
  for i=1:rows(vector)
    vector(i) = input_vector(sorting_vector(i));
  endfor
  vector
endfunction


# Bilde pF from aussenKraefteVector
pF = aussenKraefteVectorTopF(aussenkraefteVektor_ERS, multiplicand_sorting_vector, rows(lagerVector))

# Berechne Knotenverschiebungen vF
vF = inv(K_matrx_11) * pF;

# Ermittlung Auflagerreaktionsgroessen
pR = K_matrx_21 * vF
