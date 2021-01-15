# Clean Terminal and variables
clc
clear all

# Use custom path
addpath("Functions")

# Get beispiel Knotenmatrix and Elementmatrix
elementMatrix = [1,2;2,3;4,5;1,4;2,5;2,4;3,5];
knotenMatrix  = [0,0;270,468;540,0;810,468;1080,0]
aussenkraefteVektor = [0;0;4;-5;0;0;0;0;0;0];
lagerVector = [1;2;10];     # Lager in Knoten 1 Y Richtung: 2 und so

######################
# Bilde Liste der Elementsteifigkeiten
kStab_liste = getk_pseudo_hypermatrix(elementMatrix, knotenMatrix);

# Bilde Element Indexvektor
elementIndexVector = cell(1,rows(elementMatrix));
for i=1:columns(elementIndexVector)   # Staying in the same row (looping thrugh adjacent array elements) might be more CPU efficient cause
  startKnoten = elementMatrix(i,1);
  endKnoten   = elementMatrix(i,2);
  elementIndexVector(1,i) = [2*startKnoten-1,2*startKnoten,2*endKnoten-1,2*endKnoten];
endfor

# Bilde Systemsteifigkeitsmatrix
K_matrx = buildSystemSteifigkeitsMatrix(rows(knotenMatrix), kStab_liste, elementIndexVector);

# Bringe Lagerknoten runter
neweq = conservativeRowBottomPush(K_matrx,lagerVector);   
K_matrx = neweq{1};
multiplicand_sorting_vector= neweq{2};

# Extract submatrices from Steifigkeitsmatrix and save them as individual variables
K_matrx_submatrices = extractSubmatricesFromK(K_matrx, rows(lagerVector));

K_matrx_11 = K_matrx_submatrices{1,1};
K_matrx_12 = K_matrx_submatrices{1,2};
K_matrx_21 = K_matrx_submatrices{2,1};
K_matrx_22 = K_matrx_submatrices{2,2};

# Bilde pF from aussenKraefteVector
pF = aussenKraefteVectorTopF(aussenkraefteVektor, multiplicand_sorting_vector, rows(lagerVector));

# Berechne Knotenverschiebungen vF
vF = inv(K_matrx_11) * pF;

# Ermittlung Auflagerreaktionsgroessen
format short g
pR = K_matrx_21 * vF;

endergebniss = pR
