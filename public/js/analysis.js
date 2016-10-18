var accesses,
    totalClicks,
    avgClicks,
    avgTime,
    likes,
    totalLikes;

var levelReach = [];

function calcStatistics(){
  rootRef.child('likes').on('value', snap => {
    likes = snap.val();
  });

  rootRef.child('total-likes').on('value', snap => {
    totalLikes = snap.val();
  });

  var users;

  usersRef.on('value', snap => {
    users = snap.val();
    accesses = Object.keys(users).length;

    var totalTime = 0;
    totalClicks = 0;
    levelReach = [];

    var ignored  = 0;
    for(var user in users){
      if(!users[user].ignore){
        if(users[user].clicks){
          totalClicks += users[user].clicks.total | 0;
        }

        var userAccesses = users[user].accesses;
        for(var userAccess in userAccesses){
          var arrived = userAccesses[userAccess].arrivedAt;
          var left = userAccesses[userAccess].leftAt;
          if(arrived && left){
            totalTime += left - arrived;
          }
        }

        if(users[user].level){
          var reach = levelReach[users[user].level] | 0;
          levelReach[users[user].level] =  reach + 1;
        }
      } else {
        ignored++;
      }
    }

    accesses -= ignored;
    avgTime = totalTime/(accesses*1000);
    avgClicks = totalClicks/accesses;

    showStatistics();
    showSessionStatus();
  });
}

function showStatistics(){
  $('.statistics-wrapper').slideDown('slow');
  $('#accesses').html(accesses);
  $('#totalClicks').html(totalClicks);
  $('#avgClicks').html(avgClicks.toFixed(2));
  $('#avgTime').html(avgTime.toFixed(2) + 's');
  $('#likes').html(likes);
  $('#totalLikes').html(totalLikes);

  $('#levelTable').empty();
  $('#levelTable').append('<th>nível</th><th colspan="4">percentual</th>');
  var levelsReach = 0;
  for(var level in levelReach){
    var reach = (levelReach[level] / accesses)*100;
    levelReach[level] = reach;
    levelsReach += reach;
  }
  var unknownReach = 100 - levelsReach;

  var thirdReach = 100;
  for(var level in levelReach){
    var reach = levelReach[level];
    var secondaryReach = (reach/levelsReach) * 100;
    $('#levelTable').append(
      '<tr>'
        + '<td>' + level + '</td>'
        + '<td>' + reach.toFixed(2) + '%</td>'
        + '<td>' + secondaryReach.toFixed(2) + '%</td>'
        + '<td>' + thirdReach.toFixed(2) + '%</td>' +
      '</tr>');
    thirdReach -= secondaryReach;
  }

  $('#levelTable').append('<tr><td> ?? </td><td>' + unknownReach.toFixed(2) + '%</td><td></td><td></td></tr>');
  $("#levelTable td:last-child").css({border:"none"});
}

function countMeOut(){
  userRef.update({ ignore: true });
}

function countMeIn(){
  userRef.update({ ignore: false });
}

function showSessionStatus(){
  $('#statusTable').empty();
  var status = "considerada";
  if(usr.ignore){
    status ="ignorada";
  }
  $('#statusTable').append('<tr><td>sessão ' + status + '</td></tr>');
}
