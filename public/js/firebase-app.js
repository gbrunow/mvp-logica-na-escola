var auth;
var userRef,
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

  const rootRef = firebase.database().ref();
  const usersRef = rootRef.child('users');

  firebase.auth().onAuthStateChanged(user => {
    if(!user){
      firebase.auth().signInAnonymously();
    }
    userRef = usersRef.child(user.uid);
    var timeRef = userRef.child('accesses').push({ arrivedAt: firebase.database.ServerValue.TIMESTAMP });
    accessKey = timeRef.key;

    //sync down user object
    userRef.on('value', snap => {
      usr = snap.val();
    });
  });

  $('button').on('click', function(){
    var btn = $(this).attr('id');
    incrementButtonCount(btn);
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
    })


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
