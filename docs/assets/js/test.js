
function gunzip(compressed){
  var gunzip = new Zlib.Gunzip(compressed);
  var byteArray = gunzip.decompress();
  return byteArray;
}
