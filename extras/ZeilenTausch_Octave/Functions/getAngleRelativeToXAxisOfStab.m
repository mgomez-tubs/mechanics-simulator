function angle = getAngleRelativeToXAxisOfStab(stab)
  # Get global variables
  global elementMatrix;
  global knotenMatrix;
  
  # Get Knoten of the stab
  startKnoten_number  = elementMatrix(stab,1);
  endKnoten_number    = elementMatrix(stab,2);
  
  # Get vectors of the knoten
  startKnoten = [knotenMatrix(startKnoten_number,1), knotenMatrix(startKnoten_number,2)];
  endKnoten   = [knotenMatrix(endKnoten_number,1), knotenMatrix(endKnoten_number,2)];

  angle = getAngleRelativeToXAxis(startKnoten, endKnoten);
endfunction