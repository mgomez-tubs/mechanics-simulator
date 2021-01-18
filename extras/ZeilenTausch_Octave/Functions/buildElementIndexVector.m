function vector = buildElementIndexVector(elementMatrix)
  # Create output vector
  vector = cell(1,rows(elementMatrix));
  for i=1:columns(vector)   # Staying in the same row (looping thrugh adjacent array elements) might be more CPU efficient cause
    startKnoten = elementMatrix(i,1);
    endKnoten   = elementMatrix(i,2);
    vector(1,i) = [2*startKnoten-1,2*startKnoten,2*endKnoten-1,2*endKnoten];
  endfor
endfunction