function Player(b) {
  this.world = b;
  this.position = this.world.spawn;
  this.rotation = {x:0, y:0, z:0};
  this.chunk = {x:0, z:0};
  this.delta = {x:0, y:0, z:0};
  this.height = 1.7;
  this.size = .3;
  this.speed = 5;
  this.rSpeed = 2.5;
  this.velocity = 0;
  this.jumpSpeed = this.fallSpeed = 7;
  this.acceleration = 21;
  this.firstUpdate = this.collision = this.gravity = !0;
  this.lastUpdate = (new Date).getTime();
  this.rotationMatrix = [];
  this.keys = {};
  this.collisionNodes = [];
  var c = this;
  document.onkeydown = function(b) {
    c.onKeyEvent(b.keyCode, !0);
  };
  document.onkeyup = function(b) {
    c.onKeyEvent(b.keyCode, !1);
  };
  this.joystick = new SQUARIFIC.framework.TouchControl(document.getElementById("joystick"), {pretendArrowKeys:!0, mindistance:25, middletop:25, middleleft:25});
  this.joystick.on("pretendKeydown", function(b) {
    c.onKeyEvent(b.keyCode, !0);
  });
  this.joystick.on("pretendKeyup", function(b) {
    c.onKeyEvent(b.keyCode, !1);
  });
  this.spawn();
}
Player.prototype.onKeyEvent = function(b, c) {
  var d = String.fromCharCode(b).toLowerCase();
  this.keys[d] = c;
  this.keys[b] = c;
};
Player.prototype.spawn = function() {
  this.position = this.world.spawn;
  this.rotation = {x:0, y:0, z:0};
  this.chunk = {x:Math.floor(this.world.spawn.x / 16), z:Math.floor(this.world.spawn.z / 16)};
  this.world.mapGrid9(this.chunk.x, this.chunk.z);
};
Player.prototype.update = function() {
  this.elapsed = ((new Date).getTime() - this.lastUpdate) / 1E3;
  this.lastUpdate = (new Date).getTime();
  this.keys[37] && (this.rotation.y += this.rSpeed * this.elapsed);
  this.keys[39] && (this.rotation.y -= this.rSpeed * this.elapsed);
  if (this.keys[38] || this.keys[40]) {
    if (c = (this.keys[38] ? 1 : -1) * this.elapsed * this.rSpeed, 1.5708 >= this.rotation.x + c && -1.5708 <= this.rotation.x + c) {
      this.rotation.x += c;
    } else {
      if (1.5708 < this.rotation.x + c || -1.5708 > this.rotation.x + c) {
        this.rotation.x = 1.5708 * (0 < c ? 1 : -1);
      }
    }
  }
  this.rotTrig = {cosx:Math.cos(this.rotation.x), sinx:Math.sin(this.rotation.x), cosy:Math.cos(this.rotation.y), siny:Math.sin(this.rotation.y)};
  var b = this.speed * this.elapsed * this.rotTrig.siny, c = this.speed * this.elapsed, d = this.speed * this.elapsed * this.rotTrig.cosy;
  this.delta.x = 0;
  this.delta.z = 0;
  this.gravity || (this.velocity = this.delta.y = 0);
  this.keys.w && (this.delta.x -= b, this.delta.z += d);
  this.keys.s && (this.delta.x += b, this.delta.z -= d);
  this.keys.d && (this.delta.x += d, this.delta.z += b);
  this.keys.a && (this.delta.x -= d, this.delta.z -= b);
  this.keys.r && (this.delta.x -= b*1.5, this.delta.z += d*1.5);
  this.keys[32] && this.gravity && !this.delta.y && (this.velocity = this.jumpSpeed);
  this.keys[33] && !this.gravity && (this.delta.y += c);
  this.keys[34] && !this.gravity && (this.delta.y -= c);
  this.gravity && this.velocity > -this.fallSpeed && (this.velocity -= this.acceleration * this.elapsed);
  this.gravity && this.velocity < -this.fallSpeed && (this.velocity = -this.acceleration);
  this.delta.y = this.velocity * this.elapsed;
  this.firstUpdate && (this.delta.y = 0, this.firstUpdate = !1);
  this.collision && this.collisionDetection();
  this.position.x += this.delta.x;
  this.position.y += this.delta.y;
  this.position.z += this.delta.z;
  b = Math.floor(this.position.x / 16);
  c = Math.floor(this.position.z / 16);
  if (b != this.chunk.x || c != this.chunk.z) {
    this.chunk.x = b, this.chunk.z = c, this.world.mapGrid9(this.chunk.x, this.chunk.z);
  }
};
Player.prototype.collisionDetection = function() {
  for (var b = Math.floor(this.position.x), c = Math.floor(this.position.y), d = Math.floor(this.position.z), e = b - 1;e <= b + 1;e++) {
    for (var f = c - 2;f <= c + 1;f++) {
      for (var g = d - 1;g <= d + 1;g++) {
        (a = this.world.getNode(e, f, g)) && a.type.solid && this.collisionNodes.push(a);
      }
    }
  }
  for (var h in this.collisionNodes) {
    var a = this.collisionNodes[h];
    this.delta.x && this.position.z + this.size > a.z && this.position.z - this.size - 1 < a.z && this.position.y + this.height + .2 > a.y && this.position.y - 1 < a.y && (this.position.x + this.size + this.delta.x >= a.x && this.position.x < a.x + .5 ? (this.delta.x = 0, this.position.x = a.x - this.size) : this.position.x - this.size + this.delta.x <= a.x + 1 && this.position.x > a.x + .5 && (this.delta.x = 0, this.position.x = a.x + 1 + this.size));
    this.delta.z && this.position.x + this.size > a.x && this.position.x - this.size - 1 < a.x && this.position.y + this.height + .2 > a.y && this.position.y - 1 < a.y && (this.position.z + this.size + this.delta.z >= a.z && this.position.z < a.z + .5 ? (this.delta.z = 0, this.position.z = a.z - this.size) : this.position.z - this.size + this.delta.z <= a.z + 1 && this.position.z > a.z + .5 && (this.delta.z = 0, this.position.z = a.z + 1 + this.size));
    this.position.x + this.size > a.x && this.position.x - this.size - 1 < a.x && this.position.z + this.size > a.z && this.position.z - this.size - 1 < a.z && (this.position.y + this.height + .2 + this.delta.y >= a.y && this.position.y < a.y && (this.delta.y = -.01, this.velocity = 0, this.position.y = a.y - this.height - .2), this.position.y + this.delta.y <= a.y + 1 && (this.velocity = this.delta.y = 0, this.position.y = a.y + 1));
  }
  this.collisionNodes.length = 0;
};
Player.prototype.nodeCollision = function(b) {
  return this.position.x + this.size > b.x && this.position.x - this.size < b.x + 1 && this.position.z + this.size > b.z && this.position.z - this.size < b.z + 1 && this.position.y + .2 > b.y && this.position.y < b.y + 1 ? !0 : !1;
};
