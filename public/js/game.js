var commandList = [];
var repeat = false;
var x = 0,
    y = 0;
var degree = 0;

function execute(command){
  var directionCommand = true;
  var step = 50;
  var w = (degree % 360 + 90) * Math.PI/180;

  switch (command) {
    case 'front':
      x -=  step * Math.cos(w);
      y -= step * Math.sin(w);
      break;
    case 'back':
      x +=  step * Math.cos(w);
      y += step * Math.sin(w);
      break;
    case 'left':
      degree -= 90;
      break;
    case 'right':
      degree += 90;
      break;
    case 'repeat':
      repeat = true;
      break;
    default:
      // directionCommand = false;
      break;
  }

  x = Math.round(x);
  y = Math.round(y);

  if(directionCommand){
    return move(command);
  }
}
function move(command){
  if(x < 0 || x > 700 || y < -450 || y > 0){
    $('.vehicule').removeClass('vehicule-ok').addClass('vehicule-damaged');
    // $('.vehicule').addClass('vehicule-damaged');
    keepPlaying = false;
    repeat = false;
  }

  x = x > 0 ? x : 0;
  y = y < 0 ? y : 0;

  x = x < 700 ? x : 700;
  y = y > -450 ? y : -450;

  // $("#vehicule").removeClass().addClass(command);
  $("#vehicule>span").css({'transform' : 'rotate('+ degree +'deg)'});
  var movement = $("#vehicule span").animate({ top: y, left: x });
  return movement;
}

var hasRepeat = false;
var repeatIndex = 0;
function addCommand(command, silent){
  var icon;
  var directionCommand = true;

  switch (command) {
    case 'front':
      icon = 'glyphicon-arrow-up';
      break;

    case 'back':
      icon = 'glyphicon-arrow-down';
      break;

    case 'left':
      icon = 'glyphicon-share-alt turn-left';
      break;

    case 'right':
      icon = 'glyphicon-share-alt';
      break;

    case 'repeat':
      icon = 'glyphicon-retweet';
      repeat = true;
      repeatIndex = commandList.length;
      // directionCommand = false;
      break;

    default:

      break;
  }

  if(!hasRepeat){
    // if(directionCommand){
      commandList.push(command);
    // }
    $('#command-panel').append('<span class="glyphicon ' + icon + " " + command + '" aria-hidden="true"></span><span>&nbsp;</span>');
    // hasRepeat = repeat;
    if(!silent){
      execute(command);
    }
  }
}

var keepPlaying = true;
function play(){
  keepPlaying = true;
  restart();
  run(0);
}

function stop(){
  keepPlaying = false;
  repeat = false;
  restart();
}

function run(index){
  if(index >= commandList.length){
    if(repeat){
      index = repeatIndex;
    } else {
      keepPlaying = false;
    }
  }

  if(keepPlaying){
    var animate = execute(commandList[index]);
    animate.promise().done(function(){
      run(++index);
    });
  }
}

function restart(){
  x = 0;
  y = 0;
  degree = 0;
  repeat = false;
  move('right');
  $('.vehicule').removeClass('vehicule-damaged').addClass('vehicule-ok');
}
function reset(){
  repeat = false;
  hasRepeat = false;
  commandList = [];
  restart();
  $('#command-panel').children().remove();
  $('.stack-item').show('fast');
}
