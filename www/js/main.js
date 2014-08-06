var app = {
 
    initialize: function() {
        this.bind();
    },
 
    bind: function() {
        document.addEventListener("deviceready", this.deviceready, false);
        document.addEventListener("backbutton", closeScan, false);
        $('#normal_bt_employee').on("tap", bc_pressed);
        $('#normal_bt_bulk').on("tap", bc_pressed);
        $('#normal_bt_operation').on("tap", bc_pressed);
        $('#normal_bt_submit').on("tap", normal_submit);
        $('#flagno_bt_employee').on("tap", bc_pressed);
        $('#flagno_bt_bulk').on("tap", bc_pressed);
        $('#flagno_bt_submit').on("tap", flagno_submit);
        $('#flagno_hours_container').on("slidestop", '#flagno_hours', hours_flagno_select);
        $('#flagno_minutes_container').on("slidestop", '#flagno_minutes', minutes_flagno_select);
    },
 
    deviceready: function() {
        app.start();
    },
 
    start: function() {
        //alert('application started...');
    }
};

var normal_data = {};
var flagno_data = {};
var scan_in_progress = false;
var post_url = 'http://matteomattei.tk/test.php';

function bc_pressed(){
    var elem_id = $(this).attr('id');
    if(elem_id == 'normal_bt_employee' || elem_id == 'normal_bt_bulk' || elem_id == 'normal_bt_operation'){
        startScan(elem_id.split('_')[2],'normal');
    } else if(elem_id == 'flagno_bt_employee' || elem_id == 'flagno_bt_bulk'){
        startScan(elem_id.split('_')[2],'flagno');
    }
}

function date_select(page){
    /* callback for date select event */
    if(page == 'normal'){
        normal_data['date']=$('#normal_scan_date').val();
    } else if(page == 'flagno'){
        flagno_data['date']=$('#flagno_scan_date').val();
    }
    check_params();
}

function hours_flagno_select(){
    /* callback for onchange on flagno hours */
    flagno_data['hours'] = $('#flagno_hours').val();
    check_params();
}

function minutes_flagno_select(){
    /* callback for onchange on flagno minutes */
    flagno_data['minutes'] = $('#flagno_minutes').val();
    check_params();
}

function operation_flagno_select(elem){
    /* callback for onchange on flagno operation field */
    flagno_data['operation'] = elem.value;
    check_params();
}

function closeScan(){
    /* this is an hack to prevent exiting from the application when
       someone clicks on back button during when the scanner is active */
    if(scan_in_progress){
        alert('Scan cancelled');
    }
}

function check_params(){
    /* Check if all params are correctly set and enable the submit button*/
    /* normal page */
    if(normal_data['date']!='' && normal_data['bulk']!='' && normal_data['operation']!='' && normal_data['employee']!=''){
        $('#normal_bt_submit').removeClass('ui-disabled');
    } else {
        $('#normal_bt_submit').addClass('ui-disabled');
    }
    
    /* flagno page */
    if(flagno_data['date']!='' && flagno_data['employee']!='' && flagno_data['bulk']!='' && flagno_data['operation']!='' && !(flagno_data['hours']=='0' && flagno_data['minutes']=='0'))
    {
        $('#flagno_bt_submit').removeClass('ui-disabled');
    } else {
        $('#flagno_bt_submit').addClass('ui-disabled');
    }
}

function reset_fields(){
    /* reset all fields at app startup and after every submit */
    var d = new Date();
    normal_data = {};
    flagno_data = {};

    /* normal page */
    $('#normal_bt_submit').addClass('ui-disabled');
    $('#normal_bc_employee').val('');
    $('#normal_bc_bulk').val('');
    $('#normal_bc_operation').val('');
    $('#normal_scan_date').val(d.toISOString().split('T')[0]);
    normal_data['date']=$('#normal_scan_date').val();
    normal_data['employee']='';
    normal_data['bulk']='';
    normal_data['operation']='';

    /* flag no page */
    $('#flagno_bt_submit').addClass('ui-disabled');
    $('#flagno_bc_employee').val('');
    $('#flagno_bc_bulk').val('');
    $('#flagno_operation').val('');
    $('#flagno_scan_date').val(d.toISOString().split('T')[0]);
    $('#flagno_hours').val('0');
    $('#flagno_minutes').val('0');
    flagno_data['date']=$('#flagno_scan_date').val();
    flagno_data['employee']='';
    flagno_data['bulk']='';
    flagno_data['operation']='';
    flagno_data['hours']='0';
    flagno_data['minutes']='0';
}

function normal_submit(){
    /* here we have to subm it the data to the server */
    $.mobile.loading('show');
    $.post(post_url,normal_data,function(data){
        //$('#result').html(data);
        alert(data);
        $.mobile.loading('hide');
        /* reset all fields */
        reset_fields();
    });
}

function flagno_submit(){
    /* here we have to subm it the data to the server */
    $.mobile.loading('show');
    $.post(post_url,flagno_data,function(data){
        //$('#result').html(data);
        alert(data);
        $.mobile.loading('hide');
        /* reset all fields */
        reset_fields();
    });
}

function quit(){
    navigator.app.exitApp();
}

function startScan(elem, page) {
    scan_in_progress = true;
    $.mobile.loading('show');
    cordova.plugins.barcodeScanner.scan(
    function (result) {
        var s = "Result: " + result.text + "<br/>" +
            "Format: " + result.format + "<br/>" +
            "Cancelled: " + result.cancelled;
        if(!result.cancelled){
            if(page == 'normal'){
                normal_data[elem] = result.text;
                $('#normal_bc_'+elem).val(result.text);
            } else if(page == 'flagno'){
                flagno_data[elem] = result.text;
                $('#flagno_bc_'+elem).val(result.text);
            }
            scan_in_progress = false;
        }
        check_params();
        $.mobile.loading('hide');
    }, 
    function (error) {
        alert("Scanning failed: " + error);
        scan_in_progress = false;
        $.mobile.loading('hide');
    });
}

//$(document).ready(function() {
//    $('.ui-input-text').removeClass('ui-state-disabled'); /* this is needed only to have a better graphic for input text fields */
//    reset_fields();
//    app.initialize();
//});

$(document).on('pageinit','#normal',function(){
    /* this is needed only to have a better graphic for input text fields */
    $('.ui-input-text').removeClass('ui-state-disabled');
    reset_fields();
    app.initialize();
});

$(document).on('pageinit','#flag_no',function(){
    /* this is needed only to have a better graphic for input text fields */
    $('.ui-input-text').removeClass('ui-state-disabled');
});

