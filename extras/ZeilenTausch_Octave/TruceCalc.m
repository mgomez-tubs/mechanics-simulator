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

erg = berechnungLagerkraefte(knotenMatrix, elementMatrix, aussenkraefteVektor, lagerVector)

