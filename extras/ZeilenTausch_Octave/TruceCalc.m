# Clean Terminal
clc

# Clean Variables
clear all

# Use custom path
addpath("Functions")

# Get beispiel Knotenmatrix
knotenMatrix = getKnotenMatrix_bsp();

# Get beispiel Elementmatrix
elementMatrix = getElementMatrix_bsp();
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
multiplicand_sorting_vector = [1;2;3;4;5;6;7;8;9;10] #1,2 -> 1x1y; 23 -> 2x2y ...

K_matrx*multiplicand_sorting_vector;

#R1X
neweq = conservativeRowBottomPush(K_matrx,multiplicand_sorting_vector,1);
K_matrx = neweq{1};
multiplicand_sorting_vector= neweq{2}
K_matrx*multiplicand_sorting_vector;

#R1Y
neweq = conservativeRowBottomPush(K_matrx,multiplicand_sorting_vector,1); # careful, the 2 ist shifted upwards
K_matrx = neweq{1};
multiplicand_sorting_vector= neweq{2}
K_matrx*multiplicand_sorting_vector;

#R1X
neweq = conservativeRowBottomPush(K_matrx,multiplicand_sorting_vector,4); # same as above
K_matrx = neweq{1};
multiplicand_sorting_vector= neweq{2};
K_matrx*multiplicand_sorting_vector;
# fix: pass a vector


