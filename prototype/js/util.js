var u = {};

// Return true if a number
u.isNum = function (value) {
  // Thanks to http://stackoverflow.com/questions/7248150/verifying-all-text-boxes-are-numbers-in-jquery
  if (/^-?\d+(\.\d+)?$/.test(value)) { return true; }
  return false;
}

// Convert 92px to an integer of 92, convert -92px to an integer of -92px
u.parseInt = function (value) {
  num = parseInt(value);
  if (/px$/.test(value)) { num = parseInt((value).replace('px','')); }
  if (/^-$/.test(value)) { return num*-1; }
  return num;
}