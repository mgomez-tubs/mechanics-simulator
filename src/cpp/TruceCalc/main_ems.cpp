#include "trucecalculation.h"

extern "C" {
    double* calculateLagerKraefte(int* elementMatrix, int anz_Elemente, double* knotenMatrix, int anz_Knoten, double* aussenKraefteVector, int* lagerVector, int anz_Lager){
        TruceCalculation truceCalculation(elementMatrix, anz_Elemente, knotenMatrix, anz_Knoten, aussenKraefteVector, lagerVector, anz_Lager);
        truceCalculation.calculateLagerkraefte();
        return truceCalculation.getResultAsArray();
    }
}