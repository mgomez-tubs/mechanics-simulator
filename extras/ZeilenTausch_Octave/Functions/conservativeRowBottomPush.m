function array = conservativeRowBottomPush(A,b,i)
  #new matrix
  matrix = shiftColumnToLast(shiftRowToLast(A,i),i);
  #new vector 
  vector = shiftRowToLast(b,i);
  
  array = {matrix,vector};
endfunction

function A_new = shiftRowToLast(A,zeile)
  A_new = A;
  # Bring input row to the end
  A_new(rows(A_new),:) = A(zeile,:);
  # Shift everything up from input row
  for i = zeile:rows(A)-1
    A_new(i,:) = A(i+1,:);
  endfor
endfunction
 
function A_new2 = shiftColumnToLast(A,column)
  A_new2 = A;
  # Bring the input column to the end
  A_new2(:,columns(A_new2)) = A(:,column);
  #Shift eveything left from input column
  for j = column:columns(A)-1
    A_new2(:,j) = A (:,j+1);
  endfor
endfunction