$(document).on('click', '#btn-sacn', function(){

});

var result = {
    tasks: [{
        title: 'AppleTVOS.platform',
        progress: 33,
        status: 'aa',
        size: '13.33 GB',
        path: '/Applications/Xcode.app/Contents/Developer/Frameworks/AppleTVOS.platform'
    }]
};
var html = template("other-task-tpl", result);
console.log(result);
$("#active-tasks-table").empty().append(html);

$("[data-toggle]").tooltip('hide');
