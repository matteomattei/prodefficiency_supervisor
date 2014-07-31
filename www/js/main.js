var app = {
 
    initialize: function() {
        this.bind();
    },
 
    bind: function() {
        document.addEventListener("deviceready", this.deviceready, false);
        document.addEventListener("backbutton", closeScan, false);
    },
 
    deviceready: function() {
        app.start();
    },
 
    start: function() {
        //alert('application started...');
    }
};

var barcodes = {};
var d = new Date();
var scan_in_progress = false;

function bc1(){
	startScan('bc1');
}

function bc2(){
	startScan('bc2');
}

function bc3(){
	startScan('bc3');
}

function closeScan(){
    /* this is an hack to prevent exiting from the application when
       someone clicks on back button during when the scanner is active */
    if(scan_in_progress){
        alert('Scan cancelled');
    }
}

function submit_to_server(){
    alert('You scanned: '+barcodes['bc1']+' '+barcodes['bc2']+' '+barcodes['bc3']);
    /* here we have to subm it the data to the server */
    $.mobile.loading('show');
    barcodes['date']=$('#scan_date').val();
    $.post('http://matteomattei.tk/test.php',barcodes,function(data){
        $('#result').html(data);
        $.mobile.loading('hide');
    });
    /* reset all fields */
    $('#bt_submit').addClass('ui-disabled');
    barcodes = {};
    $('#bc1_txt').val('');
    $('#bc2_txt').val('');
    $('#bc3_txt').val('');
    $('#scan_date').val(d.toISOString().split('T')[0]);
}

function quit(){
	navigator.app.exitApp();
}

function startScan(barcode) {
	scan_in_progress = true;
        $.mobile.loading('show');
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			var s = "Result: " + result.text + "<br/>" +
			"Format: " + result.format + "<br/>" +
			"Cancelled: " + result.cancelled;
			if(!result.cancelled){
				barcodes[barcode] = result.text;
				$('#'+barcode+'_txt').val(result.text);
				scan_in_progress = false;
				//$('#result').html(s);
			}
			/* if we have all barcodes */
			if(Object.keys(barcodes).length==3){
				$('#bt_submit').removeClass('ui-disabled');
			}
                        $.mobile.loading('hide');
		}, 
		function (error) {
			alert("Scanning failed: " + error);
                        scan_in_progress = false;
                        $.mobile.loading('hide');
		}
	);
}

$(document).ready(function() {
    $('#bt_submit').addClass('ui-disabled');
    $('.ui-input-text').removeClass('ui-state-disabled'); /* this is needed only to have a better graphic for input text fields */
    $('#scan_date').val(d.toISOString().split('T')[0]);
    app.initialize();
});

