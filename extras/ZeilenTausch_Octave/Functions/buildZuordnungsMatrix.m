function matrix = buildZuordnungsMatrix(elementMatrix, anzKnoeten)
  anzStaebe = rows(elementMatrix);
  
  # Build Matrix
  matrix = zeros(anzStaebe*2, anzKnoeten);
  
  currentStab = 1;
  for i=1:2:anzStaebe*2
      matrix(i,elementMatrix(currentStab,1)) = 1;
      matrix(i+1,elementMatrix(currentStab,2)) = 1;
      currentStab++;
  endfor
endfunction