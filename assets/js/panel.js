// Script for the login page

$(function() {
  var background = chrome.extension.getBackgroundPage();

  // close all widgets with data-opened="false"
  for(var id in background.widgets_state) {
    if (background.widgets_state[id]) {
      $('#' + id)
        .data('opened', true)            
        .attr('data-opened', 'true')
        .find('.widget-content').show(200, function() {
            // get back the scrollbar after resizing
            $('body').removeClass('scrollbarhide');
        });
    } else {
      $('#' + id)
          .data('opened', false)
          .attr('data-opened', 'false')
          .find('.widget-content').hide(200);
    }
  }

  // a widget header click will minimize/maximize the widget's panel
  $('.widget .widget-header').on('click', function() {
      // check if it's closed or opened
      if($(this).parent().data('opened') === true) {
          $(this).parent()
                  .data('opened', false)
                  .attr('data-opened', 'false')
                  .find('.widget-content').hide(200);
          background.setWidgetsState($(this).parent()[0])
      }
      else {
          // hide the scrollbar while resizing
          $('html').addClass('scrollbarhide');
          $(this).parent()
                  .data('opened', true)            
                  .attr('data-opened', 'true')
                  .find('.widget-content').show(200, function() {
                      // get back the scrollbar after resizing
                      $('body').removeClass('scrollbarhide');
                  });
          background.setWidgetsState($(this).parent()[0])
      }
  });

  // update the heading which displays user info
  var updatehead = function(html) {
    $('#head').html(html);
  };

  var updatestatus = function(html) {
    $('#statusupdate').html(html);
  };

  // update the queue sizes in the list of queue callgroups
  var updatequeuesize = function(size, id) {
    $('#size' + id).html(size);
  };

  var nouserdestinations = function() {
    $('#no').attr('checked', true);
    $('#no').attr('disabled', 'disabled');
    $('#yes').attr('disabled', 'disabled');
  };

  var enableuserdestinations = function() {
    $('#no').removeAttr('disabled');
    $('#yes').removeAttr('disabled');
  };

  // set 'no' as selected radio input and disable statusupdate select input
  var noselecteduserdestination = function() {
      $('#no').attr('checked', true);
      $('#statusupdate').attr('disabled', 'disabled');
  };

  var resetloginform = function() {
    $('#username').val('');
    $('#password').val('');
  };

  var errorcallback = function() {
    updatehead('Je gebruikersnaam en/of wachtwoord is onjuist.'); // 'Your username and/or password is incorrect.'
    resetloginform();
  };

  // update the list of queue callgroups
  var updatelist = function(html) {
    $('#queue').html(html);
  };

  var panel = {
    nouserdestinations: nouserdestinations,
    noselecteduserdestination: noselecteduserdestination,
    errorcallback: errorcallback,
    updatehead: updatehead,
    updatestatus: updatestatus,
    updatelist: updatelist,
    updatequeuesize: updatequeuesize,
    enableuserdestinations: enableuserdestinations,
  }

  // widget select a li
  $('.widget.queues').on('click', 'li', function() {
      if($(this).attr('attr_title') != undefined) {
          $(this).siblings().removeClass('selected');
          if($(this).attr('class') == 'selected') {
              $(this).removeClass('selected');
              background.setprimary(panel, '');
          }
          else {
              $(this).addClass('selected');
              background.setprimary(panel, $(this).attr('attr_title'));
          }
      }
  }); 

  // handle statusupdate inputs
  $('input[name=availability]').change(function() {
      if($(this).val() == 'yes') {
          $('#statusupdate').removeAttr('disabled');
          background.setuserdestination($('#statusupdate option:selected').val());
      }
      else {
          $('#statusupdate').attr('disabled', 'disabled');
          background.setuserdestination(null);
      }
  });

  $('#statusupdate').change(function() {
      background.selectuserdestination($('#statusupdate option:selected').val());
  });


  var donecallback = function() {
    $("#loginform").hide();
    $("#body").show();
    // TBD find a good size
    $('body').css('height', '200');
    $('body').css('width', '360');

    $('#close').attr('style', 'float:right;cursor:pointer;display:block');

    // Setup help button
    $("#help").on("click", function() {
      background.openHelp();
    })

    // Setup settings button
    $("#settings").on("click", function() {
      background.openSettings();
    })

    // Setup logout button
    $("#logout").on("click", function() {
      background.loggedOut(panel);
    })
  };

  panel.donecallback = donecallback;

  var showLogin = function() {
    $("#loginform").show();
    $("#body").hide();

    $('body').css('height', '200');
    $('body').css('width', '360');

    $('#close').attr('style', 'float:right;cursor:pointer;display:none');

    // Handler for the login button
    $("#login").on("click", function() {
      background.doLogin($('#username').val(), $('#password').val(), panel);
    });
  }

  panel.showLogin = showLogin;

  $("#close").on("click", function() {
    window.close();
  });

  if (background.logged) {
    $("#loginform").hide();
  } else {
    $("#body").hide();
  }

  background.buildPanel(panel);
});