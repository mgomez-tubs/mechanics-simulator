function array = conservativeRowBottomPush(matrix,rows_to_push)  
  # Create a new variable to store the rows to be pushed
  trf_rows_to_push = rows_to_push;
  
  # Create vector which stores the new sort
  # Enumerate as [1,2,3,...]
  vector = zeros(rows(matrix),1);
  for i=1:rows(vector)
    vector(i) = i;
  endfor
  
  # Temporal variable for backpush
  backpush=0;
  for i=1:rows(rows_to_push)
    trf_rows_to_push(i) = rows_to_push(i) - backpush; # Need to keep the original order list!
    backpush++;
  endfor
  
  trf_rows_to_push
  
  for i=1:rows(rows_to_push)
    #new matrix
    matrix = shiftRowToLast(matrix,trf_rows_to_push(i));
    matrix = shiftColumnToLast(matrix,trf_rows_to_push(i));
    #new multiplicand sorting vector 
    vector = shiftRowToLast(vector,trf_rows_to_push(i));  
  endfor
  
  array = {matrix,vector};
endfunction

function A_new = shiftRowToLast(A,input_row)
  A_new = A;
  # Bring input row to the end
  A_new(rows(A_new),:) = A(input_row,:);
  # Shift everything up from input row
  for i = input_row:rows(A)-1
    A_new(i,:) = A(i+1,:);
  endfor
endfunction
 
function V_new = shiftColumnToLast(A,input_column)
  V_new = A;
  # Bring the input column to the end
  V_new(:,columns(V_new)) = A(:,input_column);
  #Shift eveything left from input column
  for j = input_column:columns(A)-1
    V_new(:,j) = A (:,j+1);
  endfor
endfunction