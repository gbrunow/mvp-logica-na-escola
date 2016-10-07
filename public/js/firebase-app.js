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
  // firebase.auth().signInAnonymously();
  var userRef,
      user,
      accessKey;

  const rootRef = firebase.database().ref();
  const usersRef = rootRef.child('users');

  firebase.auth().onAuthStateChanged(user => {
    userRef = usersRef.child(user.uid);
    var timeRef = userRef.child('accesses').push({ arrivedAt: firebase.database.ServerValue.TIMESTAMP });
    accessKey = timeRef.key;

    //sync down user object
    userRef.on('value', snap => {
      user = snap.val();
    });
  });

  $('button').on('click', function(){
    var btn = $(this).attr('id');
    incrementButtonCount(btn);
  });

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
