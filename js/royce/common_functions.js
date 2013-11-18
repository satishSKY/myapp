// Some common javascript functions

/***** Global variable declaration starts *****/
var isDevice;

var mytime='';

var mycurrentTime='';

var firstTimelogin='';

var atvalue="";

var getPositionOfPunch=0;

var todaydt='';     //format yy-mm-dd

var user_latitude=22.7287;

var user_longitude=75.8654;
 

var serviceURLWS ='http://203.109.109.190:1469/royce3';




/***** Global variable declaration ends *****/



if(isDevice)
{// on device ready	
	document.addEventListener("deviceready",onDeviceReady, false);
	
}
else
{// on document ready
	$(document).ready(function(){
		onDeviceReady(); 
	});
}

/***********************************************************************

Function Name : onDeviceReady (call when devaice ready)

Parmeters 	  : none

return        : none

Author		  : 

************************************************************************/

function onDeviceReady()
{
	
	
	$('.showversion').html('Version: v1.7 dev');
	var Device_width=window.innerWidth;
	var Device_height=window.innerHeight;
	$('#menuPage').width(Device_width);
	$('#menuPage').height(Device_height);
	
	$('#Registrationpage').width(Device_width);
	$('#Registrationpage').height(Device_height);
	
	$('#Pin_Varificationpage').width(Device_width);
	$('#Pin_Varificationpage').height(Device_height);
	
	$('#loginPage').width(Device_width);
	$('#loginPage').height(Device_height);
	
	$('#punchPage').width(Device_width);
	$('#punchPage').height(Device_height);
	
	$('#menuPage_cme').width(Device_width);
	$('#menuPage_cme').height(Device_height);

	$('#listPage').width(Device_width);
	$('#listPage').height(Device_height);
	
	$('#editPage_doctor').width(Device_width);
	$('#editPage_doctor').height(Device_height);
	
	$('#editPage_chemist').width(Device_width);
	$('#editPage_chemist').height(Device_height);

	$('#editPage_pocket').width(Device_width);
	$('#editPage_pocket').height(Device_height);
	
	$('#editPage_paramedic').width(Device_width);
	$('#editPage_paramedic').height(Device_height);

//<------------------------------------------------------------------------------------->

							 // First patch WebSQL if necessary
        if (typeof window.openDatabase == 'undefined') {
            // Not defined, create an openDatabase function for all to use!
            window.openDatabase = storage.openDatabase;
        } else {
            // Defined, but some Android devices will throw a SECURITY_ERR -
            // so we wrap the whole thing in a try-catch and shim in our own
            // if the device has Android bug 16175.
            var originalOpenDatabase = window.openDatabase;
            window.openDatabase = function(name, version, desc, size) {
                var db = null;
                try {
                    db = originalOpenDatabase(name, version, desc, size);
                } 
                catch (ex) {
                    db = null;
                }

                if (db === null) {
                    return storage.openDatabase(name, version, desc, size);
                }
                else {
                    return db;
                }
            };
		
        }
//<------------------------------------------------------------------------------------->
	
	
	console.log("onDeviceReady");
	// check device having network or not
	
	StoreOnlyCurrectData_Drop();
	
	createDatabase();
	
	checkNetwork();
	
	// get current time
	
	setCurrentTimeOfUser();
	
	// to get the current latitude and longitude of user

	getlatitudelongitude();
	
	deviceInfo();
	
	checkUserAccount();//check only one user on device 
			
	//changePage('Registrationpage');
	//changePage('loginPage');
	// creating the database
	
	// This is an event that fires when a Cordova application is online
	//document.addEventListener("online", onOnline, false);
	if(deviceType == 'android')
	{
		// back button event listener
		document.addEventListener("backbutton", onBackKeyDown, false);
	}
}

/***********************************************************************

Function Name : getlatitudelongitude (to get the current latitude and longitude of user)

Parmeters 	  : none

return        : latitude and longitude when user share his location, error otherwise

Author		  : ajay singh pal


************************************************************************/
function setCurrentTimeOfUser(){

			today = new Date();

			var dd = today.getDate();

			var mm = today.getMonth()+1; //January is 0!

			var yyyy = today.getFullYear();
		
			if(dd<10){dd='0'+dd} 
			
			if(mm<10){mm='0'+mm}

	 		todaydt = yyyy+'-'+mm+'-'+dd;
			
			firstTimelogin=dd+''+mm+''+yyyy;
			
			console.log("Date firstTimelogin:!!!!:"+firstTimelogin);
			
			mycurrentTime=todaydt+' ';
			
			var H=today.getHours();
			var Minutes=today.getMinutes();
			var Second =today.getSeconds();
			
			var Hours = H % 12 || 12;
			
	 		if(Hours <= 9){Hours='0'+Hours;}
			if(Minutes <= 9){Minutes='0'+Minutes}
			if(Second <= 9){Second='0'+Second;}
			
			
			mycurrentTime+= Hours+':'+ Minutes+ ':'+Second;
			
			mytime= Hours+':'+ Minutes+ ':'+Second;

			//mycurrentTime+= today.getHours()+':'+ today.getMinutes()+ ':'+today.getSeconds();
			
			//mytime=today.getHours()+':'+ today.getMinutes()+ ':'+today.getSeconds();
			
			console.log(mycurrentTime+"Date Formate:!!!!:"+todaydt+":"+mytime);			

			
}	



function getlatitudelongitude()
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(onGetCurrentPositionSuccess, onGetCurrentPositionError);
	}
	else
	{
		alert('Geolocation is not supported by this browser. Please upgrade with the latest broswer.');
	}
}


// on success of getting current position of user 
function onGetCurrentPositionSuccess(position)
{
	user_latitude = position.coords.latitude;
	user_longitude = position.coords.longitude;
}

// on error of getting current position of user 
// onError Callback receives a PositionError object
function onGetCurrentPositionError(error) 
{
	
	// on error
	/*navigator.notification.alert(
		'Unable to get your current location',  // message
		alertDismissed,         // callback
		'Royce',            // title
		'Ok'                  // buttonName
	);*/
	
	/*alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');*/
}




/***********************************************************************

Function Name : checkNetwork (to check the network is available on device or not)

Parmeters 	  : none

return        : true for network is available or false for not available

Author		  : ajay singh pal

************************************************************************/



function checkNetwork()
{
	//Run this function, if it is being executed on device.

	if(isDevice == false)
	{
		//return true;
	}	

	var networkState = navigator.connection.type;

	var states = {};

	states[Connection.UNKNOWN]  = 'Unknown connection';

	states[Connection.ETHERNET] = 'Ethernet connection';

	states[Connection.WIFI]     = 'WiFi connection';

	states[Connection.CELL_2G]  = 'Cell 2G connection';

	states[Connection.CELL_3G]  = 'Cell 3G connection';

	states[Connection.CELL_4G]  = 'Cell 4G connection';

	states[Connection.NONE]     = 'No network connection';

	var statusValue = (networkState + '').toLowerCase();
	
	console.log(statusValue);

	if(statusValue == 'none' || statusValue == 'null')
	{
		/*if( ($.mobile.activePage.attr('id') == 'responsecodePage1_1_1') || ($.mobile.activePage.attr('id') == 'responsecodePage1_2') || ($.mobile.activePage.attr('id') == 'responsecodePage1_2_2') )
		{// do nothing
		}
		else
		{// give a alert to user that connection is lost.

			navigator.notification.alert(

				'You have lost your internet connection. Please connect to internet!',  // message

				alertDismissed,         	// callback

				'Network Status',           // title

				'Ok'                  		// buttonName

			);*/return false;

		}
		
	else{
		return true;
	}
}





/***********************************************************************

Function Name : alertDismissed (a simple callback function)

Parmeters 	  : none

return        : none

Author		  : ajay singh pal

************************************************************************/



function alertDismissed() 

{

    // do nothing

	return false;

}





/***********************************************************************

Function Name : onBackKeyDown (for back button handler)

Parmeters 	  : none

return        : none

Author		  : ajay singh pal

************************************************************************/



function onBackKeyDown()
{
	//alert($.mobile.activePage.attr('id'));
	
	var ActtivPage=$.mobile.activePage.attr('id');
			

	if(ActtivPage=="loginPage" || ActtivPage=="Registrationpage"){
			
		
			navigator.app.exitApp();
			//exitConfirmation(1);
				
			return false;
	}
		
	
	if(ActtivPage=="menuPage"){
	
			return false;
	}
	
						
	if(ActtivPage=="menuPage_cme"){
		
		changePage("menuPage","slide",true);
		
	}/*else{
			//changePage("menuPage","slide",true);
			navigator.app.backHistory();
			}
	*/
	//if($('#header_ps')=="Edit Paramedic" || $('#header_ps')=="Add paramedic" && ActtivPage=="listPage"){
	if(($('#tableheader').text()=="Paramedic List" || $('#tableheader').text()=="Pocket List") && ActtivPage=="listPage"){	
		console.log($('#tableheader').text());
		changePage("menuPage_cme","slide",true);
		
		}
		
	if(ActtivPage=="listPage" && ($('#tableheader').text()=="Doctor List" || $('#tableheader').text()=="Chemist Visit List")){
			console.log($('#tableheader').text());
			changePage("menuPage","slide",true);
		
		}
		
	if(ActtivPage=="editPage_doctor" || ActtivPage=="editPage_chemist" || ActtivPage=="editPage_pocket" || ActtivPage=="editPage_paramedic" ){
		
			navigator.app.backHistory();
		
		}	
	
}





/***********************************************************************

Function Name : exitConfirmation (function to exit from application)

Parmeters 	  : button 

return 		  : none

Author		  : Ajay Singh Pal

************************************************************************/



function exitConfirmation(button)

{

	if(button == 1)

	{

		navigator.app.exitApp();

		//return false;

	}

}

/*function onConfirm(buttonIndex ) {
	//alert(buttonIndex );
	
	
    if(buttonIndex ==1){
		//navigator.notification.vibrate(1000);
		exitConfirmation(1);
	}else{
		
		changePage('loginPage');
		
		}
	//alert('You selected button ' + buttonIndex);
}*/

// Show a custom confirmation dialog
/*
function showConfirm() {
    navigator.notification.confirm(
        'Are you sure want to exit', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Royce',           // title
        ['Yes','No']         // buttonLabels
    );
}*/



/***********************************************************************

Function Name : changePage (to change the page)

Parmeters 	  : divId (which div we want to go when change the page)

Parmeters 	  : pageTransition (this param is to set the page transition

				default "slide")

Parmeters 	  : reverseTransition (reverse transition is allowed or not

				true for reverse transition

				false for forward transition

				default false)

Parmeters 	  : changeHash (change hash allowed or not

				true for changing the hash value

				false for no changing the hash value

				default true)

return 		  : none

Author		  : ajay singh pal

************************************************************************/



function changePage(divId, pageTransition, reverseTransition, changeHash)
{
	document.getElementById('curentPageId').value = divId;
	var pageTransition1 = typeof(pageTransition) != 'undefined' ? pageTransition : 'none';
	var reverseTransition1 = typeof(reverseTransition) != 'undefined' ? reverseTransition : false;
	var changeHash1 = typeof(changeHash) != 'undefined' ? changeHash : true;
	
	$.mobile.changePage( '#'+divId, {
		transition: pageTransition1,
		reverse: reverseTransition1,
		changeHash: changeHash1
	});
}


/***********************************************************************

Function Name : validEmail (to check provided email is valid or not)

Parmeters 	  : email (email address)

return 		  : true for valid email or false for invalid email

Author		  : ajay singh pal

************************************************************************/



/*function validEmail(email)
{
	var email = email;
	var matcharray = email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z]+)*\.[A-Za-z]+$/) 
	if(matcharray==null)
	{	
		return false;
	}
	else
	{
		return true;
	}
}*/

/***********************************************************************

Function Name : wip (function for showing working status)

Parmeters 	  : none

return        : none

Author		  : ajay singh pal

************************************************************************/



function wip()

{

	//showToastMessage('Work in progress.', false, 'middle-center', 'warning', '');
	//navigator.notification.beep(2);
	toast('Work in progress.');

	return false;

}





/***********************************************************************

Function Name : timeOut (call when any error occurred)

Parmeters 	  : jqXHR, textStatus, errorThrown

return 		  : none

Author		  : ajay singh pal

************************************************************************/



function timeOut(jqXHR, textStatus, errorThrown)

{

	/*alert('status: '+ jqXHR.status);

	alert('textStatus: '+ textStatus);

	alert('errorThrown: '+ errorThrown);*/

	toast('Unknown error occurred.');

	return;

}





/***********************************************************************

Function Name : loaderStart (function will display wating loader to user)

Parmeters 	  : message

return 		  : none

Author		  : ajay singh pal

************************************************************************/



function loaderStart(message_title, message_text)

{

   	if(deviceType == 'android')

	{

		if(typeof(message_title)=='undefined')message_title = 'Loading';

		if(typeof(message_text)=='undefined')message_text = 'Please wait...';

		

		if(isDevice == false) //Run this function, if is being executed on device. 

		{

			$.mobile.showPageLoadingMsg();		

			return true;

		}

		navigator.notification.activityStart(message_title, message_text);	

	}

	else if(deviceType == 'ios')

	{

		$.mobile.showPageLoadingMsg();		

		return true;

	}

}





/***********************************************************************

Function Name : loaderStart (function will hide wating loader to user)

Parmeters 	  : none

return 		  : none

Author		  : ajay singh pal

************************************************************************/



function loaderStop()

{

    if(deviceType == 'android')

	{

		if(isDevice == false)//Run this function, if is being executed on device. 

		{

			$.mobile.hidePageLoadingMsg();

			return true;

		}

		navigator.notification.activityStop();

	}

	else if(deviceType == 'ios')

	{

		$.mobile.hidePageLoadingMsg();

		return true;

	}

}





/***********************************************************************

Function Name : dummy (how to define a ajax call - copy this code to fire ajax and do code yourself whatever you want in success method)

Parmeters 	  : none

return 		  : none

Author		  : ajay singh pal

************************************************************************/



function dummy()

{

	// check network connection before fireing ajax every time

	var checkNetConnection = checkNetwork();

	if(checkNetConnection == true)

    {

		// data string (if requierd)

		var dataString = '';

	

		$.ajax({

			type: 'POST',

			url: serviceURL,

			contentType: "text/xml",

			data: dataString,

			dataType: 'xml',

			beforeSend: function(){

				// Your code goes here

				loaderStart();

			},						

			complete: function(){

				// Your code goes here

				loaderStop();

			},

			success: function(xml){

				

			},

			error:function(jqXHR, textStatus, errorThrown){

				loaderStop();

				// when some error occurred

				timeOut(jqXHR, textStatus, errorThrown);			

			}

		}); // ajax end

	}

	else

	{

		// do nothing

		return false;

	}

}

/***********************************************************************

Function Name : goBack (to go back to history(javascript) page)

Parmeters 	  : none

return 		  : none

Author		  : ajay singh pal

************************************************************************/



function goBack()

{

	if( ($.mobile.activePage.attr('id') == 'pollerPetitionerPage') )

	{

		$("#pollar_button_image_id").removeClass('pollar_wp_hover');

		$("#pollar_button_image_id").addClass('pollar_wp');

		

	}

	history.back();

}





/***********************************************************************

Function Name : backToPage (to go back page)

Parmeters 	  : divId (on which div we want to go)

return 		  : none

Author		  : ajay singh pal

************************************************************************/



// back to history(javascript) page

function backToPage(divId)
{
	if( ($.mobile.activePage.attr('id') == 'residentAddressesListPage') || ($.mobile.activePage.attr('id') == 'pollerPetitionerPage') )
	{
		$("#voter_responce_button_image_id").removeClass('voter_responce_wp_hover');
		$("#voter_responce_button_image_id").addClass('voter_responce_wp');

		$("#pollar_button_image_id").removeClass('pollar_wp_hover');
		$("#pollar_button_image_id").addClass('pollar_wp');
	}

	

	changePage(divId);
	return false;
}





/***********************************************************************

Function Name : createDatabase (to create database)

Parmeters 	  : none

return        : none

Author		  : ajay singh pal

************************************************************************/



function createDatabase()

{
	
	if(isDevice == true)

	{		

		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);	
	

		db.transaction(createTable, error, success);

	}

}





/***********************************************************************

Function Name : createTable (to create table)

Parmeters 	  : none

return        : none

Author		  : ajay singh pal

************************************************************************/



function createTable(tx)
{ try{
	console.log("create");
//	tx.executeSql('DROP TABLE IF EXISTS login');
	
	tx.executeSql('CREATE TABLE IF NOT EXISTS login (login_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NULL, password TEXT NULL, accesskey TEXT NULL,pin TEXT,status TEXT,pinvalid TEXT,iemi TEXT)');		

console.log("Doctor");
//tx.executeSql('DROP TABLE IF EXISTS doctor');//nxt represent the Extra Field That create Dynamically

	tx.executeSql('CREATE TABLE IF NOT EXISTS doctor (accesskey TEXT, doctorvisitautono TEXT, doctorvisitname TEXT , doctorvisit_location TEXT NULL, doctorvisit_enlistingcn TEXT NULL, doctorvisit_enlistingif TEXT , remarks TEXT NULL, doctorvisit_inputstodoctor TEXT NULL, user_id TEXT NULL, doc_id INTEGER PRIMARY KEY AUTOINCREMENT, createdtime TEXT NULL, ModifiedTime TEXT NULL, cf_1063 TEXT NULL, cf_1064 TEXT NULL, cf_1127 TEXT NULL, cf_1128 TEXT NULL,cf_1129 TEXT NULL, cf_1130 TEXT NULL, mark TEXT DEFAULT "not", id TEXT NULL,nxt1 TEXT NULL,nxt2 TEXT NULL,nxt3 TEXT NULL,nxt4 TEXT NULL,cf_1167 TEXT)');

console.log("chemist");
//tx.executeSql('DROP TABLE IF EXISTS chemist');

	tx.executeSql('CREATE TABLE IF NOT EXISTS chemist (accesskey TEXT, chemistvisitautono TEXT, chemistvisit_chemistvisitname TEXT,chemistvisit_availabilityofcn TEXT, chemistvisit_availabilityofif TEXT, obqtycn TEXT, obqtyif TEXT,user_id TEXT, createdtime TEXT, ModifiedTime TEXT , cf_1060 TEXT, cf_1061 TEXT, cf_1062 TEXT, cf_1125 TEXT, cf_1126 TEXT,id TEXT, chemist_id INTEGER PRIMARY KEY AUTOINCREMENT, mark TEXT DEFAULT "not",nxt1 TEXT NULL,nxt2 TEXT NULL,nxt3 TEXT NULL,nxt4 TEXT NULL,cf_1166 TEXT)');
	
console.log("pocket");
//tx.executeSql('DROP TABLE IF EXISTS pocket');

tx.executeSql('CREATE TABLE IF NOT EXISTS pocket (accesskey TEXT, pocketsessionautono TEXT NULL, pocketsessionname TEXT, date TEXT, totalhcpparticipants TEXT, totalenlistedhcpparticipants TEXT, costoftheevent TEXT, user_id TEXT, createdtime TEXT, ModifiedTime TEXT , cf_1090 TEXT NULL, cf_1135 TEXT NULL, cf_1136 TEXT NULL, cf_1137 TEXT NULL, cf_1138 TEXT NULL, id TEXT NULL, pocket_id INTEGER PRIMARY KEY AUTOINCREMENT, mark TEXT DEFAULT "not",nxt1 TEXT NULL,nxt2 TEXT NULL,nxt3 TEXT NULL,nxt4 TEXT NULL,cf_1156 TEXT,cf_1165 TEXT)');	

console.log("paramedic");
//tx.executeSql('DROP TABLE IF EXISTS paramedic');

tx.executeSql('CREATE TABLE IF NOT EXISTS paramedic (accesskey TEXT,  paramedicsessionautono TEXT NULL, paramedicsessionname TEXT, date TEXT, paramedicsession_location TEXT, paramedicsession_institutename TEXT,  totalparamedicparticipants TEXT, costofevent TEXT, user_id TEXT, createdtime TEXT, ModifiedTime TEXT , cf_1091 TEXT NULL, cf_1139 TEXT NULL, cf_1140 TEXT NULL, cf_1141 TEXT NULL, cf_1142 TEXT NULL, id TEXT NULL, paramedic_id INTEGER PRIMARY KEY AUTOINCREMENT, mark TEXT DEFAULT "not",nxt1 TEXT NULL,nxt2 TEXT NULL,nxt3 TEXT NULL,nxt4 TEXT NULL,cf_1164 TEXT)');		

//tx.executeSql('DROP TABLE IF EXISTS royce_chemist');
	
tx.executeSql('CREATE TABLE IF NOT EXISTS royce_chemist(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, chem_name TEXT NULL, chem_location TEXT NULL)');		

//tx.executeSql('DROP TABLE IF EXISTS royce_doctor');
tx.executeSql('CREATE TABLE IF NOT EXISTS royce_doctor(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, doc_name TEXT NULL, doc_location TEXT NULL)');		

//tx.executeSql('DROP TABLE IF EXISTS royce_pocket');
tx.executeSql('CREATE TABLE IF NOT EXISTS royce_pocket(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, field_name TEXT NULL, feild_value TEXT NULL)');

tx.executeSql('CREATE TABLE IF NOT EXISTS offlineAttendance(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, field_date TEXT NULL, user_att TEXT NULL ,leaveDay TEXT NULL,endDay TEXT NULL,curr_date TEXT NULL )');

}catch (e){
	console.log(e);
	}
pinverification();
}

	



/***********************************************************************

Function Name : success (on success)

Parmeters 	  : none

return        : none

Author		  : ajay singh pal

************************************************************************/



function success() 

{

	if(isDevice == true)

	{

        //navigator.notification.alert("success DB created!");
		console.log("success DB created!");

	}

	else

	{

		//alert("success!");

	}

}





/***********************************************************************

Function Name : error (on error)

Parmeters 	  : none

return        : none

Author		  : ajay singh pal

************************************************************************/



function error(tx, err)

{

	if(isDevice == true)

	{

       // navigator.notification.alert("Error processing SQL: "+err);

	}

		else

	{

		//alert("Error processing SQL: "+err);

	}

}

function ChangePage_pv_ps(){
	
	changePage("menuPage_cme","slide");	
	
	}
	
/*************************************************************************************************************
device information like imei no.
***************************************************************************************************************/
function deviceInfo(){	

 Device_Name = device.name;
                  var Device_Cordova = device.cordova;
                  var Device_Platform = device.platform;
                  var Device_UUID = device.uuid;
		   
		   imei = device.uuid;
                 var Device_Version = device.version;
                  
		  console.log("Device_Name"+Device_Name+"Device_Cordova"+Device_Cordova+"Device_Platform"+Device_Platform+"Device_UUID"+Device_UUID);
		  
/*
 window.plugins.imei.get(function(imei) {

	console.log("device id :"+imei);							  
	return imei;	   
 
 }, function(e) {
            console.log("fail"+e);
	  });
    	*/

}

function randomNumber(){
	
	var min = 1000;
	var max = 9999;
	var num = Math.floor(Math.random() * (max - min + 1)) + min;
	console.log("random no :"+num);
	return num;
}
 

function pinPage(){
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);	
		
	db.transaction(function(tx){
	
		tx.executeSql('SELECT * FROM login ',[], function(tx,results){
			if(results.rows.length > 0){
				
				//alert('your pin :'+results.rows.item(0).pin);
				alert("You have already Registration Successfully");
			}else{toast('Please Register');}
		 });
	});
	
	
	changePage("Pin_Varificationpage","slide");
	}

function pinPageRg(){
	
	$('#login_rg').val("");
	$('#pass_rg').val("");

	changePage("Registrationpage","slide");
}	

/*function homeidback(){
							   
	changePage('menuPage');							   
							   
}*/