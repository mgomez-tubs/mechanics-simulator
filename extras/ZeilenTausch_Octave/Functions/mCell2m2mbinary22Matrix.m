function cell = mCell2m2mbinary22Matrix(Acell, Bmtrx)
  zeilen = rows(Acell);
  spalten = columns(Bmtrx);
  common = columns(Acell);
  
  # Create cell
  cell = cell(zeilen,spalten);
  for i=1:zeilen
    for j=1:spalten
      cell(i,j) = zeros(2);
      for k=1:common        
        if(rows(Acell{i,k}) != 0 && rows(Bmtrx) != 0)
          #printf("FOUND SOMETHING!\n");
          if(Bmtrx(k,j) == 0)
            cell{i,j} += Acell{i,k} * zeros(2);
          elseif(Bmtrx(k,j) == 1)
            cell{i,j} += Acell{i,k} * eye(2);
          else
            printf("TERRIBLE ERROR\n");
            return
          endif
        endif
      endfor
    endfor
  endfor
endfunction