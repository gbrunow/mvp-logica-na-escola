$(document).ready(function () {

  checkOrientation();

  var backs = 3,
      fronts = 6,
      lefts = 3,
      rights = 3;

  var backButton  = $('.back-stack').html();
  var frontButton = $('.front-stack').html();
  var leftButton  = $('.left-stack').html();
  var rightButton = $('.right-stack').html();
  var minAct = Math.min(backs, fronts, lefts, rights);

  for(var i = 0; i < backs; i++){
    $('.back-stack').append(backButton);
  }
  for(var i = 0; i < fronts; i++){
    $('.front-stack').append(frontButton);
  }
  for(var i = 0; i < lefts; i++){
    $('.left-stack').append(leftButton);
  }
  for(var i = 0; i < rights; i++){
    $('.right-stack').append(rightButton);
  }

  $('.btn-play').on('click', function(){
    closeHelp();
    play();
  });

  $('.btn-stop').on('click', function(){
    stop();
  });

  $('.btn-reset').on('click', function(){
    reset();
  });

  $('.btn-help').on('click', function(){
    toggleHelp();
  });

  $('.btn-show-hide').on('click', function(){
    $('.btn-show-hide > span').toggleClass('glyphicon-eye-open');
    $('.btn-show-hide > span').toggleClass('glyphicon-eye-close');
    toggleShowAction();
  });

  $('.btn-front').on('click', function(){
    addCommand('front');
    $(this).parent().toggle('fast');
  });

  $('.btn-back').on('click', function(){
    addCommand('back');
    $(this).parent().toggle('fast');
  });

  $('.btn-left').on('click', function(){
    addCommand('left');
    $(this).parent().toggle('fast');
  });

  $('.btn-right').on('click', function(){
    addCommand('right');
    $(this).parent().toggle('fast');
  });

  $('.btn-repeat').on('click', function(){
    addCommand('repeat');
    $(this).parent().toggle('fast');
  });

  $('.btn-gotIt').on('click', function(){
    toggleHelp();
  });

  $('.btn-play').tipsy({
    gravity: 'w',
    html: true,
    title: function(){
        return 'Executar Comandos';
    }
  });

  $('.btn-stop').tipsy({
    gravity: 'w',
    html: true,
    title: function(){
        return 'Parar Execução';
    }
  });

  $('.btn-reset').tipsy({
    gravity: 'w',
    html: true,
    title: function(){
        return 'Reiniciar';
    }
  });

  $('.btn-help').tipsy({
    gravity: 'w',
    html: true,
    title: function(){
        return 'Ajuda';
    }
  });

  $('.btn-show-hide').tipsy({
    gravity: 'w',
    html: true,
    title: function(){
      if(showAction)
        return 'Ocultar comandos';
      else
        return 'Visualizar comandos'
    }
  });

  $('.btn-like').tipsy({
    gravity: 'w',
    html: true,
    title: function(){
        return 'Massa!';
    }
  });

  $('.front-stack').tipsy({
    gravity: 's',
    html: true,
    title: function(){
        return 'Seguir em Frente';
    }
  });

  $('.back-stack').tipsy({
    gravity: 's',
    html: true,
    title: function(){
        return 'Retroceder';
    }
  });

  $('.left-stack').tipsy({
    gravity: 's',
    html: true,
    title: function(){
        return 'Virar para a Esquerda';
    }
  });

  $('.right-stack').tipsy({
    gravity: 's',
    html: true,
    title: function(){
        return 'Virar para a Direita';
    }
  });

  $('.repeat-stack').tipsy({
    gravity: 's',
    html: true,
    title: function(){
        return 'Laço de Repetição';
    }
  });

  $('body').on('orientationchange', function(){
    checkOrientation();
  })

  function checkOrientation(){
    if($(window).width() < 850 && $(window).width() < $(window).height()){
      $(".warning-wrapper").fadeIn('fast');
    } else {
      $(".warning-wrapper").fadeOut('fast');
    }
  }

  function toggleHelp(){
    $('.help-container').each(function(){
      $(this).slideToggle('slow');
    });
  }

  function closeHelp(){
    $('.help-container').each(function(){
      $(this).slideUp('slow');
    });
  }

});
