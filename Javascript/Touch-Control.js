SQUARIFIC = {framework:{}};
SQUARIFIC.framework.TouchControl = function(d, f) {
  var l, m, n, e = [], g = this, p = 0, q = 0, h = [], k = [{angle:0, keyCodes:[39]}, {angle:45, keyCodes:[39, 40]}, {angle:90, keyCodes:[40]}, {angle:135, keyCodes:[40, 37]}, {angle:180, keyCodes:[37]}, {angle:-180, keyCodes:[37]}, {angle:-135, keyCodes:[37, 38]}, {angle:-90, keyCodes:[38]}, {angle:-45, keyCodes:[38, 39]}];
  f || (f = {});
  isNaN(f.mindistance) && (f.mindistance = 20);
  isNaN(f.middleLeft) && (f.middleLeft = 0);
  isNaN(f.middleTop) && (f.middleTop = 0);
  if (!d) {
    throw "Joystick Control: No element provided! Provided:" + d;
  }
  f.pretendArrowKeys = !0;
  this.on = function(b, a) {
    e.sort(function(a, b) {
      return a.id - b.id;
    });
    var c = 1 > e.length ? 0 : e[e.length - 1].id + 1;
    e.push({id:c, name:b, cb:a});
    return c;
  };
  this.removeOn = function(b) {
    var a;
    for (a = 0;a < e.length;a++) {
      if (e[a].id === b) {
        return e.splice(b), !0;
      }
    }
    return!1;
  };
  this.cb = function(b, a) {
    var c;
    for (c = 0;c < e.length;c++) {
      e[c].name === b && "function" == typeof e[c].cb && e[c].cb(a);
    }
  };
  this.removeNonFakedKeys = function(b) {
    for (var a = 0;a < h.length;a++) {
      g.inArray(h[a], b) || g.cb("pretendKeyup", {keyCode:h[a]});
    }
  };
  this.inArray = function(b, a) {
    if (!a) {
      return!1;
    }
    for (var c = 0;c < a.length;c++) {
      if (a[c] === b) {
        return!0;
      }
    }
    return!1;
  };
  this.handleTouchStart = function(b) {
    b.changedTouches[0].target == d && (l = d.style.position, m = d.style.top, n = d.style.left, p = b.changedTouches[0].clientX, q = b.changedTouches[0].clientY, d.style.position = "fixed", d.style.left = b.changedTouches[0].clientX - f.middleLeft + "px", d.style.top = b.changedTouches[0].clientY - f.middleTop + "px", b.preventDefault());
  };
  this.handleTouchStop = function(b) {
    b.changedTouches[0].target == d && (d.style.position = l, d.style.top = m, d.style.left = n, g.removeNonFakedKeys(), b.preventDefault());
  };
  this.handleTouchMove = function(b) {
    if (b.changedTouches[0].target == d) {
      var a, c, e = [];
      a = b.changedTouches[0].clientX - p;
      c = b.changedTouches[0].clientY - q;
      d.style.left = b.changedTouches[0].clientX - f.middleLeft + "px";
      d.style.top = b.changedTouches[0].clientY - f.middleTop + "px";
      b.preventDefault();
      b = Math.sqrt(Math.pow(a, 2) + Math.pow(c, 2));
      if (f.pretendArrowKeys) {
        if (b < f.mindistance) {
          g.removeNonFakedKeys();
        } else {
          b = 45 * Math.round(180 * Math.atan2(c, a) / Math.PI / 45);
          for (a = 0;a < k.length;a++) {
            if (k[a].angle === b) {
              for (c = 0;c < k[a].keyCodes.length;c++) {
                e.push(k[a].keyCodes[c]);
              }
            }
          }
          for (a = 0;a < e.length;a++) {
            g.inArray(e[a], h) || h.push(e[a]), g.cb("pretendKeydown", {keyCode:e[a]});
          }
          g.removeNonFakedKeys(e);
        }
      }
    }
  };
  d.addEventListener("touchstart", g.handleTouchStart);
  d.addEventListener("touchend", g.handleTouchStop);
  d.addEventListener("touchmove", g.handleTouchMove);
};