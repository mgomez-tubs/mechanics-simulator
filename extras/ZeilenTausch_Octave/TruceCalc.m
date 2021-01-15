# Clean Terminal and variables
clc
clear all

addpath("Functions")
# Use custom path

# Get beispiel Knotenmatrix and Elementmatrix
elementMatrix = [1,2;2,3;4,5;1,4;2,5;2,4;3,5];
knotenMatrix  = [0,0;270,468;540,0;810,468;1080,0]
aussenkraefteVektor = [0;0;4;-5;0;0;0;0;0;0];
lagerVector = [1;2;10];     # Lager in Knoten 1 Y Richtung: 2 und so


######################
function K_mtrx = buildSystemSteifigkeitsMatrix(knotenAnzahl, kStab_liste, IV)
  K_mtrx = zeros(knotenAnzahl*2,knotenAnzahl*2)
  knotenAnzahl
  for currentStab=6
    for j=1:4
      for k =1:4    
        #
        K_mtrx(IV{currentStab}(j),IV{currentStab}(k)) = 1
        #K_mtrx(IV{currentStab}(j),IV{currentStab}(k)) += kStab_liste{currentStab}(j,k);
      endfor
    endfor
  endfor
endfunction

v = zeros(rows(knotenMatrix)*2,1); #do something with this in the future
elementIndexVector = cell(1,rows(elementMatrix));

kStab_liste = getk_pseudo_hypermatrix(elementMatrix, knotenMatrix);

for i=1:columns(elementIndexVector)   # Staying in the same row (looping thrugh adjacent array elements) might be more CPU efficient cause
  startKnoten = elementMatrix(i,1);
  endKnoten   = elementMatrix(i,2);
  elementIndexVector(1,i) = [2*startKnoten-1,2*startKnoten,2*endKnoten-1,2*endKnoten];
endfor


k_matrx = buildSystemSteifigkeitsMatrix(rows(knotenMatrix), kStab_liste, elementIndexVector);