function K_mtrx = buildSystemSteifigkeitsMatrix(knotenAnzahl, kStab_liste, IV)
  K_mtrx = zeros(knotenAnzahl*2,knotenAnzahl*2);
  for currentStab=1:columns(IV)
    for j=1:4
      for k =1:4
        K_mtrx(IV{currentStab}(j),IV{currentStab}(k)) += kStab_liste{currentStab}(j,k);
      endfor
    endfor
  endfor
endfunction