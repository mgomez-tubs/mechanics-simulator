clear all
# Create Matrix
A = zeros(5,5);

i=1;
for var1 = 1:5
  for var2 = 1:5
    A(var1,var2) = i;
    i++;
  endfor
endfor

A;
b = [1;2;3;4;5];
#A * b 

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
 

function array = doTheThing(A,b,i)
  #new matrix
  matrix = shiftColumnToLast(shiftRowToLast(A,i),i);
  #new vector 
  vector = shiftRowToLast(b,i);
  
  array = {matrix,vector};
endfunction


##############################
 
shiftNumber=2
A*b
newProduct = doTheThing(A,b,shiftNumber);

newProduct{1} * newProduct{2}



