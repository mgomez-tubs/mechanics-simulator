function vector = aussenKraefteVectorTopF(input_vector, sorting_vector, anzahlLaeger)
  vector = zeros(rows(input_vector)-anzahlLaeger,1);
  for i=1:rows(vector)
    vector(i) = input_vector(sorting_vector(i));
  endfor
endfunction