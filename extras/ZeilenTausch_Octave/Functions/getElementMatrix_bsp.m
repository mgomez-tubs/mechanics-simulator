function elementMatrix = getElementMatrix_bsp
  elementMatrix = zeros(7,2);
  
  # Stab 1
  elementMatrix(1,1) = 1;
  elementMatrix(1,2) = 2;
  # Stab 2
  elementMatrix(2,1) = 2;
  elementMatrix(2,2) = 3;
  # Stab 3
  elementMatrix(3,1) = 4;
  elementMatrix(3,2) = 5;
  # Stab 4
  elementMatrix(4,1) = 1;
  elementMatrix(4,2) = 4;
  # Stab 5
  elementMatrix(5,1) = 2;
  elementMatrix(5,2) = 5;
  # Stab 6
  elementMatrix(6,1) = 2;
  elementMatrix(6,2) = 4;
  # Stab 7
  elementMatrix(7,1) = 3;
  elementMatrix(7,2) = 5;
endfunction
