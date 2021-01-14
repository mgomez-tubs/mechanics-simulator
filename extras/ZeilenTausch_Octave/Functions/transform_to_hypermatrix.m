function output_cell = transform_to_hypermatrix(k_pseudo)
  output_cell = cell(rows(k_pseudo)*2);
  rows = rows(output_cell);
  current_k=1;
  for i=1:2:rows
      output_cell{i,i} = k_pseudo{current_k,1}{1,1};
      output_cell{i,i+1} = k_pseudo{current_k,1}{1,2};
      output_cell{i+1,i} = k_pseudo{current_k,1}{2,1};
      output_cell{i+1,i+1} = k_pseudo{current_k,1}{2,2};
      current_k++;
  endfor
endfunction