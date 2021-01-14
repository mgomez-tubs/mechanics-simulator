function angle = getAngleRelativeToXAxis(startPoint, endPoint)
  steigung = (endPoint(2)-startPoint(2))/(endPoint(1)-startPoint(1));
  angle =  atan(steigung);
endfunction