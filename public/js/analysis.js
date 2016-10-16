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
    for(var user in users){
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
    }

    avgTime = totalTime/(accesses*1000);
    avgClicks = totalClicks/accesses;

    showStatistics();
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
  $('#levelTable').append('<th>nível</th><th>percentual</th>');
  for(var level in levelReach){
    var reach = (levelReach[level] / accesses)*100;
    $('#levelTable').append('<tr><td>' + level + '</td><td id="acessos">' + reach.toFixed(2) + '%</td></tr>');
  }
}
