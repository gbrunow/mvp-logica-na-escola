var auth;
var userRef,
    usersRef,
    rootRef,
    usr,
    accessKey;

$(document).ready(function () {
  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCDnoQEmOJ0uj1ilohXwsuV3dAMM_tzIkA",
    authDomain: "mvp-logica-na-escola.firebaseapp.com",
    databaseURL: "https://mvp-logica-na-escola.firebaseio.com",
    storageBucket: "mvp-logica-na-escola.appspot.com",
    messagingSenderId: "1061942948043"
  };
  firebase.initializeApp(config);

  rootRef = firebase.database().ref();
  usersRef = rootRef.child('users');

  firebase.auth().onAuthStateChanged(user => {
    if(!user){
      firebase.auth().signInAnonymously();
    }
    userRef = usersRef.child(user.uid);
    var timeRef = userRef.child('accesses').push({ arrivedAt: firebase.database.ServerValue.TIMESTAMP });
    accessKey = timeRef.key;

    //download objectives and load game
    rootRef.child('objective').on('value', snap => {
      objective = snap.val();
      //load current user level
      userRef.child('level').once('value', snap => {
        level = snap.val() | 0;
        loadGame();
        $('button').on('click', function(){
          var btn = $(this).attr('id');
          incrementButtonCount(btn);
        });
      });
    })

    //sync down user object
    userRef.on('value', snap => {
      usr = snap.val();
    });
  });

  $('.btn-like').on('click', function(){
    //increment likes
    if(!usr.clicks.like || usr.clicks.like <= 1){
      rootRef.child('likes').once('value', snap => {
        var likes = snap.val()|0;
        rootRef.update({ likes: likes + 1 });
      });
    }
    rootRef.child('total-likes').once('value', snap => {
      var likes = snap.val()|0;
      rootRef.update({ 'total-likes': likes + 1 });
    });
  })

  function incrementButtonCount(btn){
    var update = {};
    userRef.child('clicks').once('value', snap => {
      var clicks = snap.val();

      if (clicks){
        var btnClicks = clicks[btn] ? clicks[btn] : 0;
        update[btn] = btnClicks + 1;
        update['total'] = clicks['total'] + 1;
      } else {
        update[btn] = 1;
        update['total'] = 1;
      }
      userRef.child('clicks').update(update);
    });
  }

  $(window).unload( function() {
    userRef.child('accesses').child(accessKey).update({ leftAt: firebase.database.ServerValue.TIMESTAMP });
  });
});

function saveGame(){
  userRef.update({ level: level });
}

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
        levelReach[users[user].level] = levelReach[users[user].level] | 0 + 1;
      }
    }

    avgTime = totalTime/(accesses*1000);
    avgClicks = totalClicks/accesses;
    // Object.keys(users).forEach(function(key){
    //   user = users[key];
    //   console.log(user);
    // });
    showStatistics();
  });
}

//temporary

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
    // <tr>
    //   <td>3</td><td>90%</td>
    // </tr>
  }
  console.log(levelReach);
}
