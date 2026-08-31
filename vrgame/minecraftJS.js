var scene, creeper, savedelement, numbero, newBullet, scoretext, gameovertext;

var gameOver = false;
var score = 0;

function start() {
  scene = $('a-scene')[0];
  creeper = $(".creepercl");
  carmera2 = $(".carmera2");
  scoretext = $("#score-text");
  gameovertext = $("#gameover-text");
  numbero = 0;
  $('.menu-creeper').on('hitstart', startGame);
}

function startGame() {
  addCreeper();
  $('.menu-creeper').remove();
  scoretext.attr('visible', 'true');
  $('#game-title').attr('visible', 'false');
  $('#toplay').attr('visible', 'false');
  $('.chest').attr('visible', 'true');
  setInterval(addCreeper, 20000);
}

function die() {
  var collidedCreeper = event.target;
  score = score + 1;
  scoretext.attr("value", "Gunpowder:" + score);
  // sound removed (asset files not included)
  // $("#creeperkillsound")[0].components.sound.playSound();
  collidedCreeper.remove();
  addCreeper();
}

function addCreeper(){
  var newcreeper = creeper.clone();
  var chicken = $(".chichen");
  newcreeper.attr("visible", "true");
  newcreeper.attr('class','enemy');
  newcreeper.on('hitstart', die);
  chicken.on('hitstart', redirect);
  var position = creeper.attr('position');
  var randomX = randomPos(5, 30);
  var randomZ = randomPos(5, 30);
  var newPos = getD(randomX, position.y, randomZ, Math.floor(Math.random() * 4));
  newcreeper.attr('position', newPos);
  newcreeper.on("animationcomplete", endgame);
  $(scene).append(newcreeper);
}

function randomPos(min, max){
  var diff = max - min;
  var randint = Math.random()*diff + min;
  return Math.round(randint);
}

function redirect(){
  window.location.href = "https://jkgamer-web.github.io";
}

function getD(x, y, z, direct){
  var randomNum = direct;
  if (randomNum == 0){
    x = "-" + x;
    z = "-" + z;
    
  }else if (randomNum == 1){
    z = "-" + z;
  }else if (randomNum == 2){
    x = "-" + x;
  }else if (randomNum == 3){
    x = x;
    z = z;
  }
  else if (randomNum != 0 && randomNum != 1 && randomNum != 2 && randomNum != 3){
    getD(randomPos(5, 30) , creeper.attr("position").y, randomPos(5, 30), Math.floor(Math.random() * 4));
  }
  return x + " " + y + " " + z;
}

function fire(bullet, aim){
  numbero = numbero + 1;
  newBullet = $(bullet).clone();
  newBullet.attr('class', 'projectile');
  newBullet.attr('id', 'arrow' + numbero);
  var carmera2 = $(".carmera2");
  var position = $(".carmera").attr('position');
  $(this.el).attr('rotation');
  newBullet.attr('visible', 'true');
  var bulletPos = $(bullet).attr('position');
  var target = aim.x + ' ' + bulletPos.y + ' ' + aim.z;
  var duration = Math.sqrt(Math.pow(aim.x, 2) + Math.pow(aim.z, 2)) * 100;
  newBullet.on('animationcomplete', vanish);
  newBullet.attr('animation','property:position; from:' + (position.x) + " " + "1.4" + " " + (position.z) + '; to:'+ target +'; dur:' + duration + ';');
  $(scene).append(newBullet);
}

function vanish(){
  event.target.remove();
}

function endgame() {
  event.target.remove();
  gameovertext.attr("visible", "true");
  // sound removed (asset files not included)
  // var creeperblowup = $("#gameoversound")[0];
  // creeperblowup.components.sound.playSound();
  gameOver = true;
}

function CCOLOR(){
  var carmera2 = $(".carmera2");
  var randomNum = Math.floor(Math.random() * 4);
  if (randomNum == 0){
    carmera2.attr("color", "red");
  }else if(randomNum == 1){
    carmera2.attr("color", "black");
  }else if(randomNum == 2){
    carmera2.attr("color", "orange");
  }else if(randomNum == 3){
    carmera2.attr("color", "yellow");
  }
}

function shoot() {
  var bullet = this.data;
  $(this.el).on("click", function(event){
    var aim = event.detail.intersection.point;
    if(!gameOver){
      fire(bullet, aim);
      rotate();
    }
  });
  }

function rotate() {
  var rotationVal = $(savedelement).attr('rotation');
  $(newBullet.attr('id', 'arrow' + numbero)).attr('rotation', 0 + ' ' + (rotationVal.y + 90) + ' ' + rotationVal.z); 
  console.log(rotationVal.y + 90);
}

function saveel() {
  savedelement = this.el;
}

AFRAME.registerComponent("start-game", {
  init: start
});

AFRAME.registerComponent("colorrrr", {
  init: CCOLOR
});

AFRAME.registerComponent("shoot", {
   schema: { type: 'selector' },
   init: shoot
});

AFRAME.registerComponent("rotation-reader", {init: saveel});