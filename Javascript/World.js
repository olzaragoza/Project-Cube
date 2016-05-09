function World(a) {
  this.chunks = {};
  this.newMap(a);
}
World.prototype.newMap = function(a) {
  this.chunks = {};
  this.map = new Map(a);
  this.spawn = {x:0, y:this.map.getAbsoluteHeight(0, 0) + 3, z:0};
};
World.prototype.mapGrid9 = function(a, c) {
  for (var e = a - 1;e <= a + 1;e++) {
    for (var b = c - 1;b <= c + 1;b++) {
      this.chunks[e + "_" + b] || this.addChunk(e, b);
    }
  }
};
function Chunk(a, c) {
  this.x = a;
  this.z = c;
  this.nodes = {};
  this.renderNodes = {};
  var e = new Map;
  this.corners = [e.getAbsoluteHeight(this.x, this.z), e.getAbsoluteHeight(this.x + 16, this.z), e.getAbsoluteHeight(this.x + 16, this.z + 16), e.getAbsoluteHeight(this.x, this.z + 16)];
}
World.prototype.addChunk = function(a, c) {
  for (var e = 0;16 > e;e++) {
    for (var b = 0;16 > b;b++) {
      for (var g = this.map.getAbsoluteHeight(16 * a + e, 16 * c + b), d = 0;d < g;d++) {
        var f;
        0 == d ? f = "bedrock" : 2 * d < g ? f = "stone" : 4 == d && d == g - 1 || 5 == d && d == g - 1 || 6 == d && d == g - 1 ? (4 == d && d == g - 1 && (this.addNode(16 * a + e, 5, 16 * c + b, "water"), this.addNode(16 * a + e, 6, 16 * c + b, "water")), 5 == d && d == g - 1 && this.addNode(16 * a + e, 6, 16 * c + b, "water"), f = "sand") : f = d < g - 1 ? "dirt" : "grass";
        this.addNode(16 * a + e, d, 16 * c + b, f);
      }
    }
  }
};
World.prototype.getNode = function(a, c, e) {
  var b = Math.floor(a / 16), g = Math.floor(e / 16);
  return this.chunks[b + "_" + g] ? this.chunks[b + "_" + g].nodes[a + "_" + c + "_" + e] : !1;
};
World.prototype.addNode = function(a, c, e, b) {
  var g = Math.floor(a / 16), d = Math.floor(e / 16);
  if (this.getNode(a, c, e)) {
    return!1;
  }
  this.chunks[g + "_" + d] || (this.chunks[g + "_" + d] = new Chunk(g, d));
  b = new Node(a, c, e, b);
  this.chunks[g + "_" + d].nodes[a + "_" + c + "_" + e] = b;
  this.occludedFaceCulling(b);
};
World.prototype.removeNode = function(a) {
  a.removed = !0;
  this.occludedFaceCulling(a);
  var c = Math.floor(a.x / 16), e = Math.floor(a.z / 16);
  delete this.chunks[c + "_" + e].renderNodes[a.x + "_" + a.y + "_" + a.z];
  delete this.chunks[c + "_" + e].nodes[a.x + "_" + a.y + "_" + a.z];
};
World.prototype.occludedFaceCulling = function(a) {
  for (var c = [FACE.FRONT, FACE.BACK, FACE.RIGHT, FACE.LEFT, FACE.TOP, FACE.BOTTOM], e = [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]], b, g = 0;3 > g;g++) {
    var d = 2 * g, f = 2 * g + 1;
    (b = this.getNode(a.x + e[d][0], a.y + e[d][1], a.z + e[d][2])) ? (a.removed || b.removed ? (a.sides |= c[d], b.sides |= c[f]) : FACE.TOP & 1 << d && a.type.half ? (a.sides |= c[d], b.sides |= c[f]) : a.type.transparent && !b.type.transparent ? (a.sides &= ~c[d], b.sides |= c[f]) : !a.type.transparent && b.type.transparent ? (a.sides |= c[d], b.sides &= ~c[f]) : a.type.transparent && b.type.transparent && a.type == b.type ? (a.sides &= ~c[d], b.sides &= ~c[f]) : a.type.transparent && b.type.transparent && 
    a.type != b.type ? (a.sides |= c[d], b.sides |= c[f]) : 15 & 1 << d && a.type.half && !b.type.half ? (a.sides &= ~c[d], b.sides |= c[f]) : (a.sides = 15 & 1 << d && !a.type.half && b.type.half ? a.sides | c[d] : a.sides & ~c[d], b.sides &= ~c[f]), this.renderNode(b)) : a.sides |= c[d];
    (b = this.getNode(a.x + e[f][0], a.y + e[f][1], a.z + e[f][2])) ? (a.removed || b.removed ? (a.sides |= c[f], b.sides |= c[d]) : FACE.BOTTOM & 1 << f && b.type.half ? (a.sides |= c[f], b.sides |= c[d]) : a.type.transparent && !b.type.transparent ? (a.sides &= ~c[f], b.sides |= c[d]) : !a.type.transparent && b.type.transparent ? (a.sides |= c[f], b.sides &= ~c[d]) : a.type.transparent && b.type.transparent && a.type == b.type ? (a.sides &= ~c[f], b.sides &= ~c[d]) : a.type.transparent && b.type.transparent && 
    a.type != b.type ? (a.sides |= c[f], b.sides |= c[d]) : 15 & 1 << f && a.type.half && !b.type.half ? (a.sides &= ~c[f], b.sides |= c[d]) : (a.sides = 15 & 1 << f && !a.type.half && b.type.half ? a.sides | c[f] : a.sides & ~c[f], b.sides &= ~c[d]), this.renderNode(b)) : a.sides |= c[f];
  }
  this.renderNode(a);
};
World.prototype.renderNode = function(a) {
  var c = Math.floor(a.x / 16), e = Math.floor(a.z / 16);
  a.sides & 63 ? this.chunks[c + "_" + e].renderNodes[a.x + "_" + a.y + "_" + a.z] = a : delete this.chunks[c + "_" + e].renderNodes[a.x + "_" + a.y + "_" + a.z];
};