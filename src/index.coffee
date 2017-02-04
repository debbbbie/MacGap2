CONFIGS = 
  dir:
    platforms: "/Applications/Xcode.app/Contents/Developer/Platforms/"
    runtimes:  "/Library/Developer/CoreSimulator/Profiles/Runtimes/"
  sample: 
    platforms: ['AppleTVOS.platform','AppleTVSimulator.platform','iPhoneOS.platform','iPhoneSimulator.platform','MacOSX.platform','WatchOS.platform','WatchSimulator.platform']
    runtimes:  ['iOS 7.1.simrutime', 'iOS 8.1.simrutime', 'iOS 8.2.simrutime']


get_rand = (max, min = 0) ->
  Math.floor(Math.random() * (max - min + 1)) + min

list_dirs = (type, fn) ->
  if MacGap?
    task = MacGap.Task.create "ls -m #{CONFIGS.dir[type]}", (ret) ->
      fn $.map( ret.split(','), (n -> $.trim(n) ) )
    task.pipeOutput = true 
    task.launch()
  else 
    fn CONFIGS.sample[type]

dir_size = (path, fn) ->
  if MacGap?
    task = MacGap.Task.create "du -sh #{path}", (ret) ->
      fn(ret)
    task.pipeOutput = true 
    task.launch()
  else 
    setTimeout (-> fn("#{get_rand(1000, 20)} MB") ), get_rand(5000)

scan_type = (type) ->
  list_dirs type, (ret) ->
    result =
      tasks: $.map(ret, (r) -> { title: r, size: '', path: "#{CONFIGS.dir[type]}#{r}" } )
    $(".tasks-table.#{type}").empty().append(template("task-tpl", result))
    $("[data-toggle]").tooltip('hide')

    $.each ret, (i, dir_name) ->
      dir_size "#{CONFIGS.dir[type]}#{dir_name}", (size) ->
        $(".tasks-table.#{type}>li[data-dirname='#{dir_name}'] span.size_display").html(size)

do_scan = ->
  scan_type('platforms')
  scan_type('runtimes')
      
$(document).on 'click', '#btn-scan', ->
  $('.div-init').fadeOut ->
    $('.div-result').slideDown() 
  do_scan()

select_box_change_fn = ->
  $(this).toggleClass('glyphicon-ok')
  selected_count = $('.select-box.glyphicon-ok').length
  if selected_count > 0
    $(".select-status").html(" <span style='color:#2d6ca2'>#{selected_count}</span> 个文件夹")
    $(".op-clear").show()
  else
    $(".op-clear").hide()
$(document).on 'click', '.select-box', select_box_change_fn

clear_click = ->
  $(document).off 'click', '.select-box', select_box_change_fn
  $(document).off 'click', '#btn-clear', clear_click
  $(this).prop('disabled', false).find("span").html("&nbsp;正在清理")
  $(this).find("i").toggleClass("glyphicon-refresh", true).toggleClass("glyphicon-spin", true).toggleClass("glyphicon-play-circle", false)
  setTimeout ->
    $(document). on 'click', '.select-box', select_box_change_fn
    $(this).prop('disabled', false).find("span").html("&nbsp;开始清理")
    $(this).find("i").toggleClass("glyphicon-refresh", false).toggleClass("glyphicon-spin", false).toggleClass("glyphicon-play-circle", true)
    $(document).on 'click', '#btn-clear', clear_click
  , 1000
$(document).on 'click', '#btn-clear', clear_click


# test 
setTimeout ->
  $("#btn-scan").click()
, 1000

# $("header.main-head").affix()
