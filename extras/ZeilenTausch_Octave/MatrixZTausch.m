# Clean Terminal
clc

# Clean Variables
clear all

# Use custom path
addpath("Functions")

# Create Matrix
A = zeros(5,5);

i=1;
for var1 = 1:5
  for var2 = 1:5
    A(var1,var2) = i;
    i++;
  endfor
endfor

A
b = [1;2;3;4;5];
#A * b 

##############################
 
shiftNumber=1
A*b
newProduct = conservativeRowBottomPush(A,b,shiftNumber);
newProduct{1}
newProduct{1} * newProduct{2}



