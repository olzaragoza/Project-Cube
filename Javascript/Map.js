function Map(a) {
  this.seed = a;
  this.cache = {};
}
Map.prototype.getAbsoluteHeight = function(a, b) {
  return 10 * this.getHeight(a, b) + 5 | 0;
};
Map.prototype.getHeight = function(a, b) {
  var c = Math.floor(a / 16), d = Math.floor(b / 16), f = (a % 16 + 16) % 16, g = (b % 16 + 16) % 16;
  if (this.cache[c + "_" + d]) {
    return this.cache[c + "_" + d][f][g];
  }
  this.cache[c + "_" + d] = [];
  var e = this.getCorners(c, d), h, k;
  for (a = 0;16 > a;a++) {
    for (this.cache[c + "_" + d][a] = [], h = this.interpolate(e[0], e[1], a / 16), k = this.interpolate(e[2], e[3], a / 16), b = 0;16 > b;b++) {
      this.cache[c + "_" + d][a][b] = this.interpolate(h, k, b / 16);
    }
  }
  return this.cache[c + "_" + d][f][g];
};
Map.prototype.getCorners = function(a, b) {
  return[this.noise(16 * a, 16 * b), this.noise(16 * a + 16, 16 * b), this.noise(16 * a, 16 * b + 16), this.noise(16 * a + 16, 16 * b + 16)];
};
Map.prototype.noise = function(a, b) {
  var c = a + b * this.seed;
  n = c << 13 ^ c;
  return(n * (n * n * 60493 + 19990303) + 1376312589 & 2147483647) / 2147483648;
};
Map.prototype.interpolate = function(a, b, c) {
  c = .5 * (1 - Math.cos(3.1415927 * c));
  return a * (1 - c) + b * c;
};