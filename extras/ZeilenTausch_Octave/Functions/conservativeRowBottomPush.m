function array = conservativeRowBottomPush(A,b,rows_to_push)  
  # Transform rows to push
  trf_rows_to_push = rows_to_push;
  
  backpush=0;
  for i=1:rows(rows_to_push)
    trf_rows_to_push(i) = rows_to_push(i) - backpush;
    backpush++;
  endfor

  matrix = A;
  vector = b;
  
  for i=1:rows(rows_to_push)
    #new matrix
    matrix = shiftColumnToLast(shiftRowToLast(matrix,trf_rows_to_push(i)),trf_rows_to_push(i));
    #new multiplicand sorting vector 
    vector = shiftRowToLast(vector,trf_rows_to_push(i));  
  endfor
  
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