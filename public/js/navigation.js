$(document).ready(function () {

  checkOrientation();

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
    toggleShowAction();
  });

  $('.btn-like').on('click', function(){
    $(this).hide('fast');
  });

  $('.btn-gotIt').on('click', function(){
    toggleHelp();
  });

  $('.btn-next-level').on('click', function(){
    toggleNextLevelScreen();
    nextLevel();
    $(this).show('fast');
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
  });
});

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

function toggleNextLevelScreen(){
  $('.next-level-container').fadeToggle('slow');
}
