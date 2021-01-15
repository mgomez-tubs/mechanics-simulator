# Clean Terminal and variables
clc
clear all

# Use custom path
addpath("Functions")

# Get beispiel Knotenmatrix and Elementmatrix
elementMatrix = [1,2;2,3;4,5;1,4;2,5;2,4;3,5]
knotenMatrix  = [0,0;270,468;540,0;810,468;1080,0]
aussenkraefteVektor = [0;0;4;-5;0;0;0;0;0;0]
lagerVector = [1;2;10];     # Lager in Knoten 1 Y Richtung: 2 und so


######################
#dbstop in "berechnungLagerkraefte" at 37
erg = berechnungLagerkraefte(knotenMatrix, elementMatrix, aussenkraefteVektor, lagerVector)

