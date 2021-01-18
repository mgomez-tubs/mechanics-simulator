function output_cell = buildkStab_liste(elementMatrix, knotenMatrix)
   # Store anzahl Staebe in a variable
   anzStaebe = rows(elementMatrix);
   # Build output cell
   output_cell = cell(anzStaebe,1);
   # Fill output cell
   for i = 1:anzStaebe
     output_cell{i,1}= calculate_k_stab(i, elementMatrix, knotenMatrix);
   endfor
   
endfunction

function k = calculate_k_stab(stab, elementMatrix, knotenMatrix)
  # Get knoten of the stab
  startKnoten_number  = elementMatrix(stab,1);
  endKnoten_number    = elementMatrix(stab,2);
  
  # Get start and ending position of the stab
  stabStart = knotenMatrix(startKnoten_number,:);
  stabEnd   = knotenMatrix(endKnoten_number,:);
  
  # Get angle relative to X Axis
  angle = calculateAngleRelativeToXAxis(stabStart, stabEnd);
  
  # Calculate c and s
  c = cos(angle);
  s = sin(angle);
  
  # Prefetch variables
  cc=c*c;
  sc=s*c;
  ss=s*s;
  
  k = [cc,sc,-cc,-sc;sc,ss,-sc,-ss;-cc,-sc,cc,sc;-sc,-ss,sc,ss];
endfunction