function array = extractSubmatricesFromK(K_matrx, anzahlLaeger)
  array = cell(2,2);
  a = rows(K_matrx)-anzahlLaeger;
  b = rows(K_matrx);
  array(1,1) = K_matrx([1:a],[1:a]);
  array(1,2) = K_matrx([1:a],[a+1:b]);
  array(2,1) = K_matrx([a+1:b],[1:a]);
  array(2,2) = K_matrx([a+1:b],[a+1:b]);
endfunction