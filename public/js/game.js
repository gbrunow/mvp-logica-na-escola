var commandList = [];
var repeat = false,
    showAction = false;
var x = 0,
    y = 0;
var degree = 0,
    step = 50;
var level = 0,
    completed = false;

var objective;

// var objective = {
//   0:{ allowPicking: true,
//     commands: { back: 4, front: 4, left: 4, right: 4, repeat: 1 },
//     targets: [
//       { x: 3, y: 1 },
//     ]
//   },
//   1:{ allowPicking: true,
//     commands: { back: 0, front: 1, left: 0, right: 0, repeat: 1 },
//     targets: [
//       { x: 0, y: 5 },
//     ]
//   },
//   2:{ allowPicking: true,
//     commands: { back: 1, front: 3, left: 1, right: 2, repeat: 1 },
//     targets: [
//       { x: 5, y: 2 },
//     ]
//   },
//   3:{ allowPicking: true,
//     commands: { back: 2, front: 5, left: 2, right: 2, repeat: 1 },
//     targets: [
//       { x: 1, y: 2 },
//       { x: 1, y: 4 },
//       { x: 1, y: 6 },
//       { x: 2, y: 2 },
//       { x: 2, y: 4 },
//       { x: 2, y: 6 },
//     ]
//   },
//   4:{ allowPicking: false,
//     commands: { back: 3, front: 4, left: 2, right: 2, repeat: 1 },
//     targets: [
//       { x: 1, y: 1 },
//       { x: 2, y: 2 },
//       { x: 3, y: 3 },
//       { x: 4, y: 4 },
//       { x: 5, y: 5 },
//       { x: 6, y: 6 },
//     ]
//   },
//   5:{ allowPicking: false,
//     commands: { back: 3, front: 7, left: 2, right: 2, repeat: 1 },
//     targets: [
//       { x: 3, y: 3 },
//       { x: 6, y: 6 },
//       { x: 9, y: 9 },
//     ]
//   },
// };


function execute(command){
  var w = (degree % 360 + 90) * Math.PI/180;

  switch (command) {
    case 'front':
      x -= Math.round(Math.cos(w));
      y -= Math.round(Math.sin(w));
      break;
    case 'back':
      x += Math.round(Math.cos(w));
      y += Math.round(Math.sin(w));
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

      break;
  }
  return move(command);
}

const xlim = 712;
const ylim = -465;
function move(command){
  xMove =  x * step;
  yMove = y * step ;

  if(xMove < 0 || xMove > xlim || yMove < ylim || yMove > 0){
    $('.vehicule').removeClass('vehicule-ok').addClass('vehicule-damaged');
    // $('.vehicule').addClass('vehicule-damaged');
    keepPlaying = false;
    repeat = false;
  }

  xMove = xMove > 0 ? xMove : 0;
  yMove = yMove < 0 ? yMove : 0;

  xMove = xMove < xlim ? xMove : xlim;
  yMove = yMove > ylim ? yMove : ylim;

  $("#vehicule>span").css({'transform' : 'rotate('+ degree +'deg)'});
  var movement = $("#vehicule span").animate({ top: yMove, left: xMove });
  return movement;
}

var repeatIndex = 0;
function addCommand(command, silent){
  var icon;

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
      break;

    default:

      break;
  }

  commandList.push(command);
  $('#command-panel').append('<span class="glyphicon ' + icon + " " + command + '" aria-hidden="true"></span><span>&nbsp;</span>');
  if(!silent && showAction){
    execute(command);
  }
}

var keepPlaying = true;
function play(){
  keepPlaying = true;
  restart();
  run(0);
}

function stop(){
  if(!completed){
    keepPlaying = false;
    repeat = false;
    restart();
  }
}

function isObjectiveCompleted(){
  var completed = true;
  objective[level].targets.forEach(function(target){
    if(target.x == x && target.y == -y){
      target.achieved = true;
      target.element.addClass('target-achieved');
    }
    completed &= target.achieved;
  });

  return completed;
}

function run(index){
  if(index >= commandList.length){
    if(repeat){
      index = repeatIndex;
    } else {
      keepPlaying = false;
    }
  }

  if(completed){
    toggleNextLevelScreen();
  } else if(keepPlaying){
    var animate = execute(commandList[index]);
    animate.promise().done(function(){
      run(++index);
      completed = isObjectiveCompleted();
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
  $('div.target > span.target').removeClass('target-achieved');
  objective[level].targets.forEach(function(target){
    target.achieved = false;
  });
  completed = false;
}
function reset(){
  if(!completed){
    repeat = false;
    commandList = [];
    restart();
    $('#command-panel').children().remove();
    $('.stack-item').show('fast');
  }
}

function nextLevel(){
  completed = false;
  level++;
  saveGame();
  if(Object.keys(objective).length > level){
    closeHelp();
    hideAction();
    reset();
    loadGame();
  } else {
    showEnd();
  }
}

function toggleShowAction(){
  if(objective[level].allowPicking){
    $('.btn-show-hide > span').toggleClass('glyphicon-eye-open');
    $('.btn-show-hide > span').toggleClass('glyphicon-eye-close');
    showAction = !showAction;
  } else {
    $('#spy-modal').modal('show');
  }
}

function hideAction(){
  $('.btn-show-hide > span').removeClass('glyphicon-eye-close');
  $('.btn-show-hide > span').addClass('glyphicon-eye-open');
  showAction = false;
}

function loadGamePieces(){
  var backs = objective[level].commands.back,
      fronts = objective[level].commands.front,
      lefts = objective[level].commands.left,
      rights = objective[level].commands.right,
      repeats = objective[level].commands.repeat;

  var backButton    = $('div.back-source').html(),
      frontButton   = $('div.front-source').html(),
      leftButton    = $('div.left-source').html(),
      rightButton   = $('div.right-source').html(),
      repeatButton  = $('div.repeat-source').html();

  for(var i = 0; i < backs; i++){
    $('div.back-stack').append(backButton);
  }

  for(var i = 0; i < fronts; i++){
    $('div.front-stack').append(frontButton);
  }

  for(var i = 0; i < lefts; i++){
    $('div.left-stack').append(leftButton);
  }

  for(var i = 0; i < rights; i++){
    $('div.right-stack').append(rightButton);
  }

  for(var i = 0; i < repeats; i++){
    $('div.repeat-stack').append(repeatButton);
  }

  $('.btn-command').on('click', function(){
    addCommand($(this).attr('id'));
    $(this).parent().toggle('fast');
    closeHelp();
  });
}

function loadTargets(){
  if(objective[level].targets){
    var targetHTML = $('div.target-container').html();

    for( var i = 0; i < objective[level].targets.length; i ++){
      $('#screen > div.target-container > div.dynamic').append(targetHTML);
    }

    $('div.target-container > div.dynamic > div.target').each(function(index){
      var target = objective[level].targets[index];
      $(this).show();
      $(this).children('span').animate({ top: -target.y * step, left: target.x * step});
      target.element = $(this).children('span');
    });
  }

}

function loadGame(){
  $('div.dynamic').empty();
  loadGamePieces();
  loadTargets();
  if(level == 0){
    toggleHelp();
  }
}

function showEnd(){
  $('div.dynamic').empty();
  $('div.end-container').show('slow');
}
