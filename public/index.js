// Generated by CoffeeScript 1.12.2
(function() {
  var CONFIGS, clear_click, dir_size, do_scan, get_rand, list_dirs, scan_type, select_box_change_fn;

  CONFIGS = {
    dir: {
      platforms: "/Applications/Xcode.app/Contents/Developer/Platforms/",
      runtimes: "/Library/Developer/CoreSimulator/Profiles/Runtimes/"
    },
    sample: {
      platforms: ['AppleTVOS.platform', 'AppleTVSimulator.platform', 'iPhoneOS.platform', 'iPhoneSimulator.platform', 'MacOSX.platform', 'WatchOS.platform', 'WatchSimulator.platform'],
      runtimes: ['iOS 7.1.simrutime', 'iOS 8.1.simrutime', 'iOS 8.2.simrutime']
    }
  };

  get_rand = function(max, min) {
    if (min == null) {
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  list_dirs = function(type, fn) {
    var task;
    if (typeof MacGap !== "undefined" && MacGap !== null) {
      task = MacGap.Task.create("ls -m " + CONFIGS.dir[type], function(ret) {
        return fn($.map(ret.split(','), n(function() {
          return $.trim(n);
        })));
      });
      task.pipeOutput = true;
      return task.launch();
    } else {
      return fn(CONFIGS.sample[type]);
    }
  };

  dir_size = function(path, fn) {
    var task;
    if (typeof MacGap !== "undefined" && MacGap !== null) {
      task = MacGap.Task.create("du -sh " + path, function(ret) {
        return fn(ret);
      });
      task.pipeOutput = true;
      return task.launch();
    } else {
      return setTimeout((function() {
        return fn((get_rand(1000, 20)) + " MB");
      }), get_rand(5000));
    }
  };

  scan_type = function(type) {
    return list_dirs(type, function(ret) {
      var result;
      result = {
        tasks: $.map(ret, function(r) {
          return {
            title: r,
            size: '',
            path: "" + CONFIGS.dir[type] + r
          };
        })
      };
      $(".tasks-table." + type).empty().append(template("task-tpl", result));
      $("[data-toggle]").tooltip('hide');
      return $.each(ret, function(i, dir_name) {
        return dir_size("" + CONFIGS.dir[type] + dir_name, function(size) {
          return $(".tasks-table." + type + ">li[data-dirname='" + dir_name + "'] span.size_display").html(size);
        });
      });
    });
  };

  do_scan = function() {
    scan_type('platforms');
    return scan_type('runtimes');
  };

  $(document).on('click', '#btn-scan', function() {
    $('.div-init').fadeOut(function() {
      return $('.div-result').slideDown();
    });
    return do_scan();
  });

  select_box_change_fn = function() {
    var selected_count;
    $(this).toggleClass('glyphicon-ok');
    selected_count = $('.select-box.glyphicon-ok').length;
    if (selected_count > 0) {
      $(".select-status").html(" <span style='color:#2d6ca2'>" + selected_count + "</span> 个文件夹");
      return $(".op-clear").show();
    } else {
      return $(".op-clear").hide();
    }
  };

  $(document).on('click', '.select-box', select_box_change_fn);

  clear_click = function() {
    $(document).off('click', '.select-box', select_box_change_fn);
    $(document).off('click', '#btn-clear', clear_click);
    $(this).prop('disabled', false).find("span").html("&nbsp;正在清理");
    $(this).find("i").toggleClass("glyphicon-refresh", true).toggleClass("glyphicon-spin", true).toggleClass("glyphicon-play-circle", false);
    return setTimeout(function() {
      $(document).on('click', '.select-box', select_box_change_fn);
      $(this).prop('disabled', false).find("span").html("&nbsp;开始清理");
      $(this).find("i").toggleClass("glyphicon-refresh", false).toggleClass("glyphicon-spin", false).toggleClass("glyphicon-play-circle", true);
      return $(document).on('click', '#btn-clear', clear_click);
    }, 1000);
  };

  $(document).on('click', '#btn-clear', clear_click);

  setTimeout(function() {
    return $("#btn-scan").click();
  }, 1000);

}).call(this);
