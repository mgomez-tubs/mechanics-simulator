function cell = mbinary22MatrixCell2m2m(AT,k_hypermatrix)
  # Check if matrix multiplication is possible
  if(columns(AT) != rows(k_hypermatrix))
    printf("The matrix multiplication can not be resolved since the given matrices are incompatible.\n");
    return
  endif
  
  zeilen = rows(AT);
  spalten = columns(k_hypermatrix);
  common = columns(AT) ;
  
  # Create Cell
  cell = cell(zeilen,spalten);
   
  for i=1:zeilen
    for j=1:spalten
      cell{i,j} = zeros(2);
      for k=1:common
        #printf("i :%d", i)
        #printf(", j :%d", j)
        #printf(", k :%d", k)
        #printf("\n")
        
        if(AT(i,k) != 0 && rows(k_hypermatrix{k,j}) != 0)
          #printf("FOUND SOMETHING!\n")
          cell{i,j} += k_hypermatrix{k,j};
        endif
      endfor
    endfor
  endfor
endfunction