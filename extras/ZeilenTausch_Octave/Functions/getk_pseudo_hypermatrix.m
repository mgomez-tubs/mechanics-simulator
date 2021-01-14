function cell2 = getk_pseudo_hypermatrix(elementMatrix, knotenMatrix)
   # Store anzahl Staebe in a variable
   anzStaebe = rows(elementMatrix);
   # Build Cell
   cell2 = cell(anzStaebe,1);
   # Fill cell
   for i = 1:anzStaebe
     cell2{i,1}= getk_stab(i, elementMatrix, knotenMatrix);
   endfor
endfunction

function k = getk_stab(stab, elementMatrix, knotenMatrix)
  # Get Knoten of the stab
  startKnoten_number  = elementMatrix(stab,1);
  endKnoten_number    = elementMatrix(stab,2);
  
  # Get vectors of the knoten
  startKnoten = [knotenMatrix(startKnoten_number,1), knotenMatrix(startKnoten_number,2)];
  endKnoten   = [knotenMatrix(endKnoten_number,1), knotenMatrix(endKnoten_number,2)];
  
  # Get angle
  angle = getAngleRelativeToXAxis(startKnoten, endKnoten);
  
  # Fill k_stab
  c= cos(angle);
  s= sin(angle);
  origMatrix = [c*c,s*c;s*c,s*s];
  origMatrix_neg = origMatrix * -1;
  k = cell(2,2);
  k(1,1) = k(2,2) = origMatrix;
  k(1,2) = k(2,1) = origMatrix_neg;
endfunction