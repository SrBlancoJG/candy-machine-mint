var settings = {
  textureSize: 1024,
  animating: true,
  animationSpeed: 10,
};

var gl = GL.create();
var mesh = GL.Mesh.plane();

var ifs;
var ifsRenderer;
var canvasGl, $canvasGl;
var canvas2d, $canvas2d;

var cancelNextInit = false;
function initIFS() {
  if (ifs) ifs.dispose();
  if (ifsRenderer) ifsRenderer.dispose();

  ifs = new IFS(gl, settings.textureSize);
  ifsRenderer = new IFSRenderer(ifs, gl.canvas, gl, canvas2d.getContext('2d'));
  ifsRenderer.animating = settings.animating;
  ifsRenderer.animationSpeed = settings.animationSpeed;

  ifs.brightness = 1.32;

  for (var i = 0; i < 3; i++) {
    var angle = Math.random() * 2 * Math.PI;
    var scale = Math.random() * 0.6 + 0.3;
    var a = Math.cos(angle) * scale;
    var d = Math.sin(angle) * scale;
    var item = {
      matrix: new GL.Matrix(
        a, -d, 0.0, Math.random() - 0.5,
        d, a, 0.0, Math.random() - 0.5,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
      ),
      color: [Math.floor(Math.random() * (100 - 20 + 1) + 20), Math.floor(Math.random() * (100 - 20 + 1) + 20), Math.floor(Math.random() * (100 - 20 + 1) + 20)],
      _color: [1, 1, 1, 1],
      rotationSpeed: 0 | Math.random() * 100 + 50
    };
    ifs.functions.push(item);
  }
  ifsRenderer.fitToScreen();
}

function saveIFS() {
  var m, c, result = "";
  function append(val) {
    result += (Math.round(val * 10000) / 10000) + "|";
  }

  append(ifs.brightness);
  append(ifsRenderer.animationSpeed);

  m = ifs.globalTransform.matrix.m;
  append(m[0]);
  append(m[1]);
  append(m[4]);
  append(m[5]);
  append(m[3]);
  append(m[7]);
  append(ifs.globalTransform.rotationSpeed);

  append(ifs.functions.length);
  for (var i = 0; i < ifs.functions.length; i++) {
    m = ifs.functions[i].matrix.m;
    append(m[0]);
    append(m[1]);
    append(m[4]);
    append(m[5]);
    append(m[3]);
    append(m[7]);

    c = ifs.functions[i].color;
    append(c[0]);
    append(c[1]);
    append(c[2]);

    append(ifs.functions[i].rotationSpeed);
  }
  return result;
}

function loadIFS(values) {
  var newIfs = new IFS(gl, settings.textureSize);
  var newIfsRenderer = new IFSRenderer(newIfs, gl.canvas, gl, canvas2d.getContext('2d'));
  newIfsRenderer.animating = settings.animating;

  values = values.split('|');
  var error = false, m, it = 0;
  function next() {
    if (it >= values.length) {
      error = true;
      return;
    }
    var v = values[it++];
    if (v.indexOf('.') != -1) v = parseFloat(v);
    else v = parseInt(v);
    if (isNaN(v)) error = true;
    return v;
  }

  newIfs.brightness = next();
  newIfsRenderer.animationSpeed = next();

  m = newIfs.globalTransform.matrix.m;
  m[0] = next(); if (error) return;
  m[1] = next(); if (error) return;
  m[4] = next(); if (error) return;
  m[5] = next(); if (error) return;
  m[3] = next(); if (error) return;
  m[7] = next(); if (error) return;
  newIfs.globalTransform.rotationSpeed = next(); if (error) return;

  var c, object, count;

  count = next(); if (error) return;

  for (var i = 0; i < count; i++) {
    object = {
      matrix: new GL.Matrix(),
      color: [0, 0, 0],
      _color: [1, 1, 1, 1],
      rotationSpeed: 0
    };

    m = object.matrix.m;
    m[0] = next(); if (error) return;
    m[1] = next(); if (error) return;
    m[4] = next(); if (error) return;
    m[5] = next(); if (error) return;
    m[3] = next(); if (error) return;
    m[7] = next(); if (error) return;

    c = object.color;
    c[0] = next(); if (error) return;
    c[1] = next(); if (error) return;
    c[2] = next(); if (error) return;

    object.rotationSpeed = next(); if (error) return;
    newIfs.functions.push(object);
  }


  var wasAnimating = false;

  if (ifs) ifs.dispose();
  if (ifsRenderer) ifsRenderer.dispose();

  ifs = newIfs;
  ifsRenderer = newIfsRenderer;
}

gl.onupdate = function (seconds) {
  ifs.step(seconds);
  ifsRenderer.step(seconds);
};

var fading = false;

gl.ondraw = function () {
  ifs.update();
  if (epilepsySafeTimer == 0) {
    if (!fading) {
      fading = true;
      $canvasGl.animate({ 'opacity': 1 }, 1000, 'swing', function () { fading = false; });
    }
  }
  else {
    fading = false;
    $canvasGl.stop(true).css('opacity', 0);
  }
  ifsRenderer.render();
};

gl.canvas.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

function glTextureToImage(texture) {
  var width = texture.width, height = texture.height,
    prevWidth = parseInt($canvasGl.css('width')), prevHeight = parseInt($canvasGl.css('height'));

  $canvasGl.css({ width: width, height: height });
  canvasGl.width = width;
  canvasGl.height = height;

  gl.viewport(0, 0, width, height);

  glTextureToImage.shader = glTextureToImage.shader || new GL.Shader([
    'varying vec2 coord;',

    'void main() {',
    'coord = (gl_Vertex.xy + 1.0) * 0.5;',
    'gl_Position.zw = gl_Vertex.zw;',
    'gl_Position.xy = gl_Vertex.xy;',
    '}'
  ].join('\n'), [
    'uniform sampler2D texture;',
    'varying vec2 coord;',

    'void main() {',
    'gl_FragColor = texture2D(texture, coord);',
    '}'
  ].join('\n'));

  texture.bind(0);
  glTextureToImage.shader.uniforms({
    texture: 0
  }).draw(mesh);
  texture.unbind(0);

  var result = canvasGl.toDataURL();

  $canvasGl.css({ width: prevWidth, height: prevHeight });
  canvasGl.width = prevWidth;
  canvasGl.height = prevHeight;

  gl.viewport(0, 0, prevWidth, prevHeight);

  return result;
}

function resize() {
  var sizeW = $('#fractal-container').width(),
    sizeH = $('#fractal-container').height();

  $canvasGl.css({ width: sizeW, height: sizeH });
  canvasGl.width = sizeW;
  canvasGl.height = sizeH;

  gl.viewport(0, 0, sizeW, sizeH);

  $canvas2d.css({ width: sizeW, height: sizeH });
  canvas2d.width = sizeW;
  canvas2d.height = sizeH;
}

function getUrlHash() {
  return decodeURIComponent(document.location.hash.substr(1));
}

function set_colors() {
  let sumsColors = [];
  for(let i = 0; i < 3; i++){
    sumsColors.push(ifs.functions[i].color.reduce((acumulator, color) => acumulator + color));
  }
  const indexMax = sumsColors.indexOf(Math.max(...sumsColors));
  const indexMin = sumsColors.indexOf(Math.min(...sumsColors));
  const indexMid = [0,1,2].filter(index => index != indexMin && index != indexMax)[0];
  document.documentElement.style.setProperty('--colorMax', 'rgb(' + ifs.functions[indexMax].color.map((color) => color * 255 / 100) + ')')
  document.documentElement.style.setProperty('--colorMid', 'rgb(' + ifs.functions[indexMid].color.map((color) => color * 255 / 100) + ')')
  document.documentElement.style.setProperty('--colorMin', 'rgb(' + ifs.functions[indexMin].color.map((color) => color * 255 / 100) + ')')
}
$(document).ready(function () {
  canvasGl = gl.canvas
  $canvasGl = $(canvasGl);
  $canvas2d = $('#fractal-ui');
  canvas2d = $canvas2d[0];

  $(window).bind('hashchange', function () {
    loadIFS(getUrlHash());
  });

  loadIFS(getUrlHash());
  if (ifs === undefined) { initIFS() };
  console.log("ifs", ifs)
  set_colors()
  $('#the-fractal').replaceWith($(canvasGl));
  $canvasGl.attr({ 'id': '#the-fractal', 'tabindex': '1' }).mousedown(function () { $(this).focus(); });

  gl.animate();

  $(window).resize(resize);
  resize();
});
