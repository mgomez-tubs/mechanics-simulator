function output_cell = getk_pseudo_hypermatrix(elementMatrix, knotenMatrix)
   # Store anzahl Staebe in a variable
   anzStaebe = rows(elementMatrix);
   # Build Cell
   output_cell = cell(anzStaebe,1);
   # Fill cell
   for i = 1:anzStaebe
     output_cell{i,1}= getk_stab(i, elementMatrix, knotenMatrix);
   endfor
endfunction

function k = getk_stab(stab, elementMatrix, knotenMatrix)
  # Get knoten of the stab
  startKnoten_number  = elementMatrix(stab,1);
  endKnoten_number    = elementMatrix(stab,2);
  
  # Get start and ending position of the knoten
  startKnoten = [knotenMatrix(startKnoten_number,1), knotenMatrix(startKnoten_number,2)];
  endKnoten   = [knotenMatrix(endKnoten_number,1), knotenMatrix(endKnoten_number,2)];
  
  # Get angle relative to X Axis
  angle = getAngleRelativeToXAxis(startKnoten, endKnoten);
  
  # Fill k_stab
  c = cos(angle);
  s = sin(angle);
  
  k = zeros(4,4);
  
  k(1,1) = k(3,3) = c*c;
  k(1,3) = k(3,1) = -c*c;
  
  k(2,2) = k(4,4) = s*s;
  k(4,2) = k(2,4) = -s*s;
  
  k(1,2) = k(2,1) = k(3,4) = k(4,3) = s*c;
  k(1,4) = k(2,3) = k(3,2) = k(4,1) = -s*c;
  
endfunction