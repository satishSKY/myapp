// JavaScript Document
var flg=0;
var user_Id;
							
var session_ID=null;

var successinf;

var sessionId ='http://203.109.109.190:1469/royce3/roycerest/';

var linkData='http://203.109.109.190:1469/royce3';

/*function syncMenu(){
	//getAll();
	setCurrentTimeOfUser();
	 if(window.localStorage.getItem("dv_search")==1){
			//window.localStorage.removeItem("dv_search");			
			 SynchDataDoctor();
		}
	if(window.localStorage.getItem("cv_search")==2){
			//window.localStorage.removeItem("cv_search");				
			 SynchDataChemist();
	}
	if(window.localStorage.getItem("ps_search")==3){
			//window.localStorage.removeItem("ps_search");			
			SynchDataPocket();
	}
	if(window.localStorage.getItem("pe_search")==4){
			//window.localStorage.removeItem("pe_search");			
			SynchDataParamedic();
		
		}
	 
	 
}
*/

function SynchDataDoctor(){
try{	
	setCurrentTimeOfUser();
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
	access_Key = window.localStorage.getItem('accesskey');
				
	unm =window.localStorage.getItem('user_name');
var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {
	$.ajax({
		url:'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
		type:'GET',
    	dataType:'jsonp',
        jsonp:'callback',
		beforeSend: function(){
			//Your code goes here
			$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

			//loaderStart();
			},						
		complete: function(){
			//Your code goes here
			$.unblockUI();
			//loaderStop();
			},
        success: function(data)
			{
			var response=data.message;
				
			var success = response.success;
						
			var rs =response.result;
						
			var session_ID = rs.sessionName;
						
			var user_Id = rs.userId;
						 
			if(success){flg=1;
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM doctor where mark = "yes"',  [], SuccessInfSynch, errorSync);
				function SuccessInfSynch(tx, results){
					if(results.rows.length>0){	 
						
						for (var i = 0; i < results.rows.length; i++){
							
							if(jQuery.trim(results.rows.item(i).doctorvisitautono)==""){
							var mod="RS";
							}else{
								var mod="RU";
								}
							var l='[{"doctorvisitautono":"'+jQuery.trim(results.rows.item(i).doctorvisitautono)+'","mode":"'+mod+'","doctorvisitname":"'+jQuery.trim(results.rows.item(i).doctorvisitname)+'","vtiger_doctorvisit_location":"'+jQuery.trim(results.rows.item(i).doctorvisit_location)+'","vtiger_doctorvisit_enlistingcn":"'+jQuery.trim(results.rows.item(i).doctorvisit_enlistingcn)+'","vtiger_doctorvisit_enlistingif":"'+jQuery.trim(results.rows.item(i).doctorvisit_enlistingif)+'","remarks":"'+jQuery.trim(results.rows.item(i).remarks)+'","assigned_user_id":"'+jQuery.trim(results.rows.item(i).user_id)+'","CreatedTime":"'+jQuery.trim(results.rows.item(i).createdtime)+'","ModifiedTime":"'+jQuery.trim(results.rows.item(i).ModifiedTime)+'","cf_1063":"'+jQuery.trim(results.rows.item(i).cf_1063)+'","cf_1064":"'+jQuery.trim(results.rows.item(i).cf_1064)+'","cf_1127":"'+jQuery.trim(results.rows.item(i).cf_1127)+'","cf_1128":"'+jQuery.trim(results.rows.item(i).cf_1128)+'","cf_1129":"'+jQuery.trim(results.rows.item(i).cf_1129)+'","cf_1130":"'+jQuery.trim(results.rows.item(i).cf_1130)+'","id":"'+jQuery.trim(results.rows.item(i).id)+'","cf_1167":"'+jQuery.trim(results.rows.item(i).cf_1167)+'"}]';		 
							console.log(l);
				
							linkData='http:/203.109.109.190:1469/royce3/roycerest/syncmodel.php?sessid='+session_ID+'&module=DoctorVisit&data=[{"doctorvisitautono":"'+jQuery.trim(results.rows.item(i).doctorvisitautono)+'","mode":"'+mod+'","doctorvisitname":"'+jQuery.trim(results.rows.item(i).doctorvisitname)+'","vtiger_doctorvisit_location":"'+jQuery.trim(results.rows.item(i).doctorvisit_location)+'","vtiger_doctorvisit_enlistingcn":"'+jQuery.trim(results.rows.item(i).doctorvisit_enlistingcn)+'","vtiger_doctorvisit_enlistingif":"'+jQuery.trim(results.rows.item(i).doctorvisit_enlistingif)+'","remarks":"'+jQuery.trim(results.rows.item(i).remarks)+'","assigned_user_id":"'+jQuery.trim(results.rows.item(i).user_id)+'","CreatedTime":"'+jQuery.trim(results.rows.item(i).createdtime)+'","ModifiedTime":"'+jQuery.trim(results.rows.item(i).ModifiedTime)+'","cf_1063":"'+jQuery.trim(results.rows.item(i).cf_1063)+'","cf_1064":"'+jQuery.trim(results.rows.item(i).cf_1064)+'","cf_1127":"'+jQuery.trim(results.rows.item(i).cf_1128)+'","cf_1128":"'+jQuery.trim(results.rows.item(i).cf_1127)+'","cf_1129":"'+jQuery.trim(results.rows.item(i).cf_1129)+'","cf_1130":"'+jQuery.trim(results.rows.item(i).cf_1130)+'","id":"'+jQuery.trim(results.rows.item(i).id)+'","cf_1167":"'+jQuery.trim(results.rows.item(i).cf_1167)+'"}]';

					 		console.log(linkData);
					 		$.ajax({
								url:linkData,
				  				type:'POST',
    			  	  			dataType:'jsonp',
                    			jsonp:'callback',
								beforeSend: function(){
									//Your code goes here
									//loaderStart();
									},						
								complete: function(){
									//Your code goes here
									//loaderStop();
									},
                 		 		success: function(data)
				  					{
			 						var res = data.message;
									successinf = res.success;
									if(successinf){
										flg=1;
										console.log('send data'+data);
										toast("Sync Successful");
									}
								},error:function(e)
					 				{
		 							//alert('Error Check Connection'+e)
									 }
   							});//end ajax
						}//end for
					}else{//alert('There is no Updations');
					}
					updatedr();
				}//end fun
			
			}, errorSync, successSynch);
		}else{
			toast(' Session Expire Login Again ');
	 	}
	},error:function(e)
		 {
 		//alert('Error Check Connection');
 		 }
  });//end ajax
 }else{
	 toast("Check Network Connection");
	 }
}catch(e){console.log(e);}
}

//<--------------------comman-------------------------->
function errorSync(e){
		
			//alert('Error' +e);	
		}
function successSynch1(){}		
		
function successSynch(){
				
				//alert('success ');
		}

//<--------------------comman-------------------------->

	
function SynchDataChemist(){
try{	
	setCurrentTimeOfUser();
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
	access_Key = window.localStorage.getItem('accesskey');
				
	unm =window.localStorage.getItem('user_name');
var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {			 	
	$.ajax({
		url: 'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
		type:'GET',
    	dataType:'jsonp',
        jsonp:'callback',
		beforeSend: function(){
			//Your code goes here
			$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

			//loaderStart();
			},						
		complete: function(){
			//Your code goes here
			$.unblockUI();
			//loaderStop();
			},
        success: function(data)
		  {
			var response=data.message;
			  		
			var success = response.success;
						
			var rs =response.result;
						
			var session_ID = rs.sessionName;
						
			//var user_Id = rs.userId;
										 
			 if(success){flg=1;
				db.transaction(function(tx){
								
				tx.executeSql('SELECT * FROM chemist where mark="yes"',  [], function(tx,results){	
	
				if(results.rows.length >0){
					
					for (var i = 0; i < results.rows.length; i++){	
						if(jQuery.trim(results.rows.item(i).chemistvisitautono)==""){
						var mod="RS";
						}
						else{
							var mod="RU";
							}
						var str='[{"chemistvisitautono":"'+jQuery.trim(results.rows.item(i).chemistvisitautono)+'","mode":"'+mod+'","vtiger_chemistvisit_chemistvisitname":"'+jQuery.trim(results.rows.item(i).chemistvisit_chemistvisitname)+'",   "vtiger_chemistvisit_availabilityofcn":"'+jQuery.trim(results.rows.item(i).chemistvisit_availabilityofcn)+'","vtiger_chemistvisit_availabilityofif":"'+jQuery.trim(results.rows.item(i).chemistvisit_availabilityofif)+'","obqtycn":"'+jQuery.trim(results.rows.item(i).obqtycn)+'","obqtyif":"'+jQuery.trim(results.rows.item(i).obqtyif)+'","assigned_user_id":"'+jQuery.trim(results.rows.item(i).user_id)+'","CreatedTime": "'+jQuery.trim(results.rows.item(i).createdtime)+'","ModifiedTime":"'+jQuery.trim(results.rows.item(i).ModifiedTime)+'","cf_1060":"'+jQuery.trim(results.rows.item(i).cf_1060)+'","cf_1061":"'+jQuery.trim(results.rows.item(i).cf_1061)+'","cf_1062":"'+jQuery.trim(results.rows.item(i).cf_1062)+'","cf_1125":"'+jQuery.trim(results.rows.item(i).cf_1125)+'","cf_1126":"'+jQuery.trim(results.rows.item(i).cf_1126)+'","id":"'+jQuery.trim(results.rows.item(i).id)+'","cf_1166":"'+jQuery.trim(results.rows.item(i).cf_1166)+'"}]';
						console.log(str);
																					  
linkData='http:/203.109.109.190:1469/royce3/roycerest/syncmodel.php?sessid='+session_ID+'&module=ChemistVisit&data=[{"chemistvisitautono":"'+jQuery.trim(results.rows.item(i).chemistvisitautono)+'","mode":"'+mod+'","vtiger_chemistvisit_chemistvisitname":"'+jQuery.trim(results.rows.item(i).chemistvisit_chemistvisitname)+'",   "vtiger_chemistvisit_availabilityofcn":"'+jQuery.trim(results.rows.item(i).chemistvisit_availabilityofcn)+'","vtiger_chemistvisit_availabilityofif":"'+jQuery.trim(results.rows.item(i).chemistvisit_availabilityofif)+'","obqtycn":"'+jQuery.trim(results.rows.item(i).obqtycn)+'","obqtyif":"'+jQuery.trim(results.rows.item(i).obqtyif)+'","assigned_user_id":"'+jQuery.trim(results.rows.item(i).user_id)+'","CreatedTime": "'+jQuery.trim(results.rows.item(i).createdtime)+'","ModifiedTime":"'+jQuery.trim(results.rows.item(i).ModifiedTime)+'","cf_1060":"'+jQuery.trim(results.rows.item(i).cf_1060)+'","cf_1061":"'+jQuery.trim(results.rows.item(i).cf_1061)+'","cf_1062":"'+jQuery.trim(results.rows.item(i).cf_1062)+'","cf_1125":"'+jQuery.trim(results.rows.item(i).cf_1125)+'","cf_1126":"'+jQuery.trim(results.rows.item(i).cf_1126)+'","id":"'+jQuery.trim(results.rows.item(i).id)+'","cf_1166":"'+jQuery.trim(results.rows.item(i).cf_1166)+'"}]';	

						console.log(linkData);
						$.ajax({
							url:linkData,
				  			type:'POST',
    			  	  		dataType:'jsonp',
                    		jsonp:'callback',
							beforeSend: function(){
								//Your code goes here
								//loaderStart();
								},						
							complete: function(){
								//Your code goes here
								//loaderStop();
								},
                 		 	success: function(data)
				  			{
			 					var res = data.message;
								successinf = res.success;
								if(successinf){
									flg=1;
									console.log('send data'+data);
									toast("Sync Successful");
								}
							} ,error:function(e)
					 			{
		 							//alert('Error Check Connection'+e)
								 }
   						 });//end ajax
						}//end for
					}else{//alert('There is no Updations');
					}
					updatecv();
				}, errorSync);
			}, errorSync, successSynch);
		}else{
			toast(' Session Expire Login Again ');
		    }
	},error:function(e)
	 {
		//alert('Error Check Connection');
	 }
  });///end ajax
}else{
	toast("Check network connetion")
	
	}
}catch(e){console.log(e);}
}

/*<--------------------------------pocket------------------------>*/

function SynchDataPocket(){
try{	
	setCurrentTimeOfUser();
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
	access_Key = window.localStorage.getItem('accesskey');
				
	unm =window.localStorage.getItem('user_name');
var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {	
	$.ajax({
		url: 'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
		type:'GET',
    	dataType:'jsonp',
        jsonp:'callback',
		beforeSend: function(){
			//Your code goes here
			$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

			//loaderStart();
			},						
		complete: function(){
			//Your code goes here
			$.unblockUI();
			//loaderStop();
			},
        success: function(data)
		{
			var response=data.message;
				  		
			var success = response.success;
						
			var rs =response.result;
						
			var session_ID = rs.sessionName;
			
			//var user_Id = rs.userId;
			if(success){flg=1;
				db.transaction(function(tx){
									
				tx.executeSql('SELECT * FROM pocket where mark="yes"',  [], function(tx,results){	
					if(results.rows.length>0){		
						for (var i = 0; i < results.rows.length; i++){	
							if(jQuery.trim(results.rows.item(i).pocketsessionautono)==""){
								var mod="RS";
							}
							else{
								var mod="RU";
							}
							var str='[{"pocketsessionautono": "'+jQuery.trim(results.rows.item(i).pocketsessionautono)+'","mode": "'+mod+'","pocketsessionname": "'+jQuery.trim(results.rows.item(i).pocketsessionname)+'","date": "'+jQuery.trim(results.rows.item(i).date)+'","totalhcpparticipants": "'+jQuery.trim(results.rows.item(i).totalhcpparticipants)+'","totalenlistedhcpparticipants": "'+jQuery.trim(results.rows.item(i). totalenlistedhcpparticipants)+'","costoftheevent": "'+jQuery.trim(results.rows.item(i).costoftheevent)+'",   "assigned_user_id": "'+jQuery.trim(results.rows.item(i).user_id)+'","CreatedTime": "'+jQuery.trim(results.rows.item(i).createdtime)+'","ModifiedTime": "'+jQuery.trim(results.rows.item(i). ModifiedTime)+'","cf_1090": "'+jQuery.trim(results.rows.item(i).cf_1090)+'","cf_1135": "'+jQuery.trim(results.rows.item(i).cf_1135)+'","cf_1136": "'+jQuery.trim(results.rows.item(i).cf_1136)+'","cf_1137": "'+jQuery.trim(results.rows.item(i).cf_1137)+'","cf_1138": "'+jQuery.trim(results.rows.item(i).cf_1138)+'","id":"'+jQuery.trim(results.rows.item(i).id )+'","cf_1165":"'+jQuery.trim(results.rows.item(i).cf_1165)+'"}]';
							
							console.log(str);
							
linkData='http://203.109.109.190:1469/royce3/roycerest/syncmodel.php?sessid='+session_ID+'&module=PocketSession&data=[{"pocketsessionautono": "'+jQuery.trim(results.rows.item(i).pocketsessionautono)+'","mode": "'+mod+'","pocketsessionname": "'+jQuery.trim(results.rows.item(i).pocketsessionname)+'","date": "'+jQuery.trim(results.rows.item(i).date)+'","totalhcpparticipants": "'+jQuery.trim(results.rows.item(i).totalhcpparticipants)+'","totalenlistedhcpparticipants": "'+jQuery.trim(results.rows.item(i). totalenlistedhcpparticipants)+'","costoftheevent": "'+jQuery.trim(results.rows.item(i).costoftheevent)+'",   "assigned_user_id": "'+jQuery.trim(results.rows.item(i).user_id)+'","CreatedTime": "'+jQuery.trim(results.rows.item(i).createdtime)+'","ModifiedTime": "'+jQuery.trim(results.rows.item(i). ModifiedTime)+'","cf_1090": "'+jQuery.trim(results.rows.item(i).cf_1090)+'","cf_1135": "'+jQuery.trim(results.rows.item(i).cf_1136)+'","cf_1136": "'+jQuery.trim(results.rows.item(i).cf_1135)+'","cf_1137": "'+jQuery.trim(results.rows.item(i).cf_1137)+'","cf_1138": "'+jQuery.trim(results.rows.item(i).cf_1138)+'","id":"'+jQuery.trim(results.rows.item(i).id )+'","cf_1156":"'+jQuery.trim(results.rows.item(i).cf_1156)+'","cf_1165":"'+jQuery.trim(results.rows.item(i).cf_1165)+'"}]';

							console.log(linkData);
							$.ajax({
								url:linkData,
				  				type:'POST',
    			  	  			dataType:'jsonp',
                    			jsonp:'callback',
								beforeSend: function(){
									//Your code goes here
									//loaderStart();
								},						
								complete: function(){
									//Your code goes here
									//loaderStop();
								},
                 		 		success: function(data)
				  				{
			 						var res = data.message;
									successinf = res.success;
									if(successinf){
										//alert('yes');
										flg=1;
										console.log('send data'+data);
										toast("Sync Successful");
									}
								} ,error:function(e)
					 				{
		 								//alert('Error Check Connection'+e)
									 }
   							});//end ajax
						}//end for
					}else{//alert('There is no Updation');
					}
					updatepv();
				}, errorSync);
			}, errorSync, successSynch);
		 }else{
			toast(' Session Expire Login Again ');
		    }
		},error:function(e)
		 {
			//alert('Error Check Connection');
		 }
   	});	
   }else{toast('Check network connection');}
}catch(e){console.log(e);}
}

/*<-------------paramedic------------------------------------------------------->*/

function SynchDataParamedic(){
try{	
	setCurrentTimeOfUser();
	
	console.log("synch");
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
	access_Key = window.localStorage.getItem('accesskey');
				
	unm =window.localStorage.getItem('user_name');
var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {	
	$.ajax({
	url: 'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
	type:'GET',
    dataType:'jsonp',
    jsonp:'callback',
	beforeSend: function(){
		//Your code goes here
		$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

		//loaderStart();
		},						
	complete: function(){
		//Your code goes here
		$.unblockUI();
		//loaderStop();
		},
    success: function(data)
	  {
		var response=data.message;
				  		
		var success = response.success;
						
		var rs =response.result;
						
		var session_ID = rs.sessionName;
						
		//var user_Id = rs.userId;
		if(success){flg=1;
			db.transaction(function(tx){
			tx.executeSql('SELECT * FROM paramedic where mark = "yes"',  [], function(tx,results){	
	
			if(results.rows.length>0){		
				for (var i = 0; i < results.rows.length; i++){	
					if(jQuery.trim(results.rows.item(i).pocketsessionautono)==""){
							var mod="RS";
						}
					else{
							var mod="RU";
						}									 
					var str='[{"paramedicsessionautono": "'+jQuery.trim(results.rows.item(i). paramedicsessionautono)+'","mode":"'+mod+'","paramedicsessionname": "'+jQuery.trim(results.rows.item(i).paramedicsessionname )+'","date": "'+jQuery.trim(results.rows.item(i).date )+'",  "vtiger_paramedicsession_location": "'+jQuery.trim(results.rows.item(i).paramedicsession_location )+'","vtiger_paramedicsession_institutename": "'+jQuery.trim(results.rows.item(i).paramedicsession_institutename)+'","totalparamedicparticipants": "'+jQuery.trim(results.rows.item(i).totalparamedicparticipants)+'","costofevent": "'+jQuery.trim(results.rows.item(i).costofevent)+'","assigned_user_id": "'+jQuery.trim(results.rows.item(i).user_id )+'","CreatedTime": "'+jQuery.trim(results.rows.item(i).createdtime)+'", "ModifiedTime": "'+jQuery.trim(results.rows.item(i). ModifiedTime )+'","cf_1091": "'+jQuery.trim(results.rows.item(i).cf_1091 )+'","cf_1139": "'+jQuery.trim(results.rows.item(i).cf_1139 )+'","cf_1140": "'+jQuery.trim(results.rows.item(i).cf_1140 )+'","cf_1141": "'+jQuery.trim(results.rows.item(i).cf_1141 )+'","cf_1142": "'+jQuery.trim(results.rows.item(i).cf_1142 )+'","id": "'+jQuery.trim(results.rows.item(i).id )+'","cf_1164":"'+jQuery.trim(results.rows.item(i).cf_1164)+'"}]';
					console.log(str);

linkData='http://203.109.109.190:1469/royce3/roycerest/syncmodel.php?sessid='+session_ID+'&module=ParamedicSession&data=[{"paramedicsessionautono": "'+jQuery.trim(results.rows.item(i). paramedicsessionautono)+'","mode":"'+mod+'","paramedicsessionname": "'+jQuery.trim(results.rows.item(i).paramedicsessionname )+'","date": "'+jQuery.trim(results.rows.item(i).date )+'",  "vtiger_paramedicsession_location": "'+jQuery.trim(results.rows.item(i).paramedicsession_location )+'","vtiger_paramedicsession_institutename": "'+jQuery.trim(results.rows.item(i).paramedicsession_institutename)+'","totalparamedicparticipants": "'+jQuery.trim(results.rows.item(i).totalparamedicparticipants)+'","costofevent": "'+jQuery.trim(results.rows.item(i).costofevent)+'","assigned_user_id": "'+jQuery.trim(results.rows.item(i).user_id )+'","CreatedTime": "'+jQuery.trim(results.rows.item(i).createdtime)+'", "ModifiedTime": "'+jQuery.trim(results.rows.item(i). ModifiedTime )+'","cf_1091": "'+jQuery.trim(results.rows.item(i).cf_1091 )+'","cf_1139": "'+jQuery.trim(results.rows.item(i).cf_1140 )+'","cf_1140": "'+jQuery.trim(results.rows.item(i).cf_1139 )+'","cf_1141": "'+jQuery.trim(results.rows.item(i).cf_1141 )+'","cf_1142": "'+jQuery.trim(results.rows.item(i).cf_1142 )+'","id": "'+jQuery.trim(results.rows.item(i).id )+'","cf_1164":"'+jQuery.trim(results.rows.item(i).cf_1164)+'"}]';

					console.log(linkData);
				  	$.ajax({
						url:linkData,
				  		type:'POST',
    			  	  	dataType:'jsonp',
                    	jsonp:'callback',
						beforeSend: function(){
							//Your code goes here
							//loaderStart();
							},						
					  	complete: function(){
							//Your code goes here
							//loaderStop();
							},
                 		success: function(data)
				  		{
			 				var res = data.message;
							successinf = res.success;
							if(successinf){
								//alert('yes');
								flg=1;
								console.log('send data'+data);
								toast("Sync Successful");
							}
						} ,error:function(e)
					 		{
		 						//alert('Error Check Connection'+e)
							}
   						});//end ajax
					}//end for
				}else{//alert('There is no Updation');
				}
				updateps();
			}, errorSync);
		}, errorSync, successSynch);
	}else{
		toast(' Session Expire Login Again ');
		}
	  },error:function(e)
		 {
			//alert('Error Check Connection');
		 }
  });//end ajax	
 }else{toast('Check network connection');}
}catch(e){console.log(e);}
}

			 
//<--------------------------------------------------end Synch-------------------------------------------------->

//<------------------------punch Attendance----------------------------->


var sessionId ='http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?';

var attend='http://203.109.109.190:1469/royce3/roycerest/view_PunchAttend.php?';

var postatt='http://203.109.109.190:1469/royce3/roycerest/syncmodel.php?';


function punchAttendance(){
	try{
		$('#leaveDay').hide();	
	
		access_Key = window.localStorage.getItem('accesskey');
				
		usernm =window.localStorage.getItem('user_name');

		var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {			 	
		$.ajax({
			url:sessionId+'user='+usernm+'&akey='+access_Key,
			type:'GET',
    		dataType:'jsonp',
            jsonp:'callback',
			beforeSend: function(){
		//Your code goes here
		//loaderStart();
		},						
	complete: function(){
		//Your code goes here
		$.unblockUI();
		loaderStop();
		//setTimeout(loaderStop(),10000);
		},
            success: function(data)
			{
				var response=data.message;
				
				var success = response.success;
					
				var rs =response.result;
				
				var session_ID = rs.sessionName;
						
				user_Id = rs.userId;
				window.localStorage.setItem('userid_store',user_Id);	
				//alert(window.localStorage.getItem('userid_store')+":"+user_Id);
				$.ajax({
					url:attend+'sessid='+session_ID,
					type:'GET',
					dataType:'jsonp',
					jsonp:'callback',
					success: function(data)
					{
														
						var response=data.message
						var strdoc = new Array();
						var d = new Array();
					   	for(var i=0;i<response.result.length;i++){
								
					   		resp=response.result[i].CreatedTime;
							
							var strdoc =resp.split(" ");
							
							var dd=strdoc[0].split(" ");
							var presentFlag='';
							var diff =matchDate(dd);
							if (diff == 0) {
								getPositionOfPunch=i;
								presentFlag = true;
								break;
							} else {
								presentFlag = false;
							}
						}//end for
						
						if (presentFlag) {
							
							toast("You have already punched attendence");
							
							changePage("menuPage","slide");
							
	
						} else {
								changePage("punchPage","slide");
								}//toast("You have not punched attendence");
 					},error:function()
					 {
						//alert('Error Check Connection');
					  }
				});//end ajax */
			},error:function()
				 {
					//alert('Error Check Connection');
				 }
		});//end ajax
   }else{toast('Check network connection');}
}catch(e){console.log(e);}
}	


//<************************************************************************************>
$(document).ready(function(){
	$("input:radio[name=pl]").click(function() {
	 
		 atvalue=$(this).val();
		 console.log(atvalue);
		 if($(this).val()=="PL"){
	 		$('#leaveDay').show();
		}else{
			$('#leaveDay').hide();
			}
      });
});

function punchAttendance_by_Btn(){
try{	
	var r=confirm("Please confirm to Punch the Attendance");
	
if (r==true){
  
	var leaveDay="";
	
	leaveDay = $('#leaveDay').val();
	
	console.log(leaveDay);
	
	var flage=0;
	
	if(atvalue=="PL" && leaveDay==""){
		flage=0;
		toast("Please enter the number of Leave Day");
		
	}else{flage=1;}	
		
	if(atvalue!="" && flage==1){
		
		access_Key = window.localStorage.getItem('accesskey');
				
		usernm =window.localStorage.getItem('user_name');
		
		var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {			 	
		$.ajax({
			url:sessionId+'user='+usernm+'&akey='+access_Key,
			type:'GET',
    		dataType:'jsonp',
            jsonp:'callback',
            success: function(data)
			{
				var response=data.message;
				
				var success = response.success;
					
				var rs =response.result;
				
				var session_ID = rs.sessionName;
						
				var user_Id = rs.userId;
									
				/*$.ajax({
					url:attend+'sessid='+session_ID,
					type:'GET',
					dataType:'jsonp',
					jsonp:'callback',
					success: function(data)
					{
														
						var response=data.message
						var strdoc = new Array();
						var d = new Array();
					   	for(var i=0;i<response.result.length;i++){
								
					   		resp=response.result[i].CreatedTime;
							
							var strdoc =resp.split(" ");
							
							var dd=strdoc[0].split(" ");
							
							var diff =matchDate(dd);
							if (diff == 0) {
								getPositionOfPunch=i;
								presentFlag = true;
								break;
							} else {
								presentFlag = false;
							}
						}//end for
						
					if (presentFlag) {
							toast("You have already punched attendence");
							changePage('menuPage');
			
						} else {
								changePage('punchPage');
								}//toast("You have not punched attendence");*/
var prsnt="Present";

if(atvalue=="PL"){
	prsnt="Absent";
	}
else if(atvalue=="PRESENT"){
	prsnt="Present"
	atvalue="None"
	}	
	
postatt=postatt+'sessid='+session_ID+'&module=PunchAttendance&data=[{"punchattendanceid": "631","mode":"RS","punchattendanceautono": "PA10020","vtiger_punchattendance_punchattendancename": "'+prsnt+'","punchdate": "'+todaydt+'","punchtime": "'+mycurrentTime+'","noofpunches": "0","longitude": "'+user_longitude+'","latitude": "'+user_latitude+'","smspunchingdatetime": "","mcc": "0","mnc": "0","cellid": "0","areacode": "0","salesorder": null,"cf_1069": "","cf_1095": "","cf_1096": "","crmid": "631","smcreatorid": "1","smownerid": "1","modifiedby": "1","setype": "PunchAttendance","createdtime": "2013-06-04 13:25:01",  "modifiedtime": "'+mycurrentTime+'","viewedtime": "2013-06-04 13:25:02","status": null,"version": "0","presence": "1","deleted": "0","id": "55x631","assigned_user_id": "'+user_Id+'","cf_1092":"'+atvalue+'","cf_1143":"00:00:00","cf_1144":"00:00:00","cf_1159":"'+leaveDay+'"}]';	
console.log(postatt);				
																		
								$.ajax({
									url:postatt,
									type:'POST',
									dataType:'jsonp',
									jsonp:'callback',
									success: function(data)
									{
										
										var res = data.message;
										
										var succ= res.success;
										
										toast('Punch Attendance Successfully');
										
										changePage("menuPage","slide");
										//changePage('Pin_Varificationpage');
										
										
									} ,error:function(e)
										{
											//alert('Error Check Connection =: '+e)
										 }
								});//end ajax
							/*}//end else
						 },error:function()
							 {
								alert('Error Check Connection');
							 }
					});//end ajax */
				},error:function()
				 {
					//alert('Error Check Connection');
				 }
		});//end ajax
	}else{
			
			toast('Check network connection');
			console.log(atvalue+" : "+leaveDay);
			OfflineAttendance(atvalue,leaveDay);
		}
	}//end if
 }
else{
  		toast("you are not puched Attendance");
  }

}catch(e){console.log(e);}
}	
							
function matchDate(dd){
try{			
	var d=String(dd).split("-");
					
	//alert(d[0]+":"+d[1]+":"+d[2]);
					
	today = new Date();

	var mydd =(today.getDate())-d[2];
	var my_mm = today.getMonth()+1-d[1]; 
	var yyyy = today.getFullYear()-d[0];
	//alert(mydd+":"+my_mm+":"+yyyy)
	if(mydd==0 && my_mm==0 && yyyy==0){
		
		return 0;
	}else{
		return 1;
	}
								
}catch(e){console.log(e);}
}

function EndOfDay(){
try{		
		access_Key = window.localStorage.getItem('accesskey');
				
		usernm =window.localStorage.getItem('user_name');
		
		var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {			 	
		$.ajax({
			url:sessionId+'user='+usernm+'&akey='+access_Key,
			type:'GET',
    		dataType:'jsonp',
            jsonp:'callback',
            success: function(data)
			{
				var response=data.message;
				
				var success = response.success;
					
				var rs =response.result;
				
				var session_ID = rs.sessionName;
						
				var user_Id = rs.userId;
									
				$.ajax({
					url:attend+'sessid='+session_ID,
					type:'GET',
					dataType:'jsonp',
					jsonp:'callback',
					success: function(data)
					{	 
											
						var response=data.message
						var strdoc = new Array();
						var j=0;
						for(var i=0;i<response.result.length;i++){			
					   	
							resp=response.result[i].CreatedTime;
							
							var strdoc =resp.split(" ");
						
							var dd=strdoc[0].split(" ");
							
							var diff =matchDate(dd);
							
							if (diff == 0) {
									j=i;
									break;
								}

						}//alert(j+" : "+response.result[j].CreatedTime);
						
endday='http://203.109.109.190:1469/royce3/roycerest/syncmodel.php?sessid='+session_ID+'&module=PunchAttendance&data=[{"mode":"RU","areacode":"'+jQuery.trim(response.result[j].areacode)+'","cellid":"'+jQuery.trim(response.result[j].cellid)+'","cf_1092":"'+jQuery.trim(response.result[j].cf_1092)+'","cf_1143":"'+mycurrentTime+'","cf_1159":"'+jQuery.trim(response.result[j].cf_1159)+'","createdtime":"'+jQuery.trim(response.result[j].CreatedTime)+'","latitude":"'+jQuery.trim(response.result[j].latitude)+'","longitude":"'+jQuery.trim(response.result[j].longitude)+'","mcc":"'+jQuery.trim(response.result[j].mcc)+'","mnc":"'+jQuery.trim(response.result[j].mnc)+'","modifiedtime":"'+mycurrentTime+'","punchattendanceautono":"'+jQuery.trim(response.result[j].punchattendanceautono)+'","punchdate":"'+jQuery.trim(response.result[j].punchdate)+'","punchtime":"'+jQuery.trim(response.result[j].punchtime)+'","assigned_user_id":"'+jQuery.trim(response.result[j].assigned_user_id)+'","vtiger_punchattendance_punchattendancename":"'+jQuery.trim(response.result[j].vtiger_punchattendance_punchattendancename)+'","id":"'+jQuery.trim(response.result[j].id)+'"}]';	
							
						endDayAtt(endday);
						 },error:function()
							 {
								//alert('Error Check Connection');
							 }
					});//end ajax 
				},error:function()
				 {
					//alert('Error Check Connection');
				 }
		});//end ajax
   }else{toast('Check network connection');}


function endDayAtt(endday){
	var Flg=0;
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	db.transaction(function(tx){
		tx.executeSql('select endDay FROM offlineAttendance', [], function(tx, results){
			if(results.rows.length>0){
				if((results.rows.item(0).endDay).toLowerCase()=="yes"){
					
					toast("You Already Closed for the Day");
					return false;
				}else{Flg=1;}
			}else{Flg=1;}
		});
	
	if(Flg==1){
						try{															
								$.ajax({
									url:endday,
									type:'POST',
									dataType:'jsonp',
									jsonp:'callback',
									beforeSend: function(){
									//Your code goes here
										console.log(endday);
										$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

										//loaderStart();
										console.log("start");
									},						
							  		complete: function(){
									//Your code goes here
									$.unblockUI();
										//loaderStop();
										console.log("complete");
									},
									success: function(data)
									{
										
										
										var res = data.message;
										
										var succ= res.success;
										
										toast('Successfully');
										
										db.transaction(function(tx){
											//tx.executeSql('UPDATE offlineAttendance  SET  endDay="yes" ');
											tx.executeSql('insert into offlineAttendance(endDay) VALUES("yes")');
										
										})//changePage('menuPage');
										
									} ,error:function(e,Status,errorThrown)
										{
											//alert(Status+'Error Check Connection =:'+e+" : "+errorThrown);
											console.log(errorThrown);
										 }
								});//end ajax
							}catch(e){console.log(e);}
			}
		});
						
	}
}catch(e){console.log(e);}	
}
//<------------------------end punch Attendance----------------------------->
	
	
function synchData(){
try{	
	
	
	if(window.localStorage.getItem("synch_dr")==1){
			//window.localStorage.removeItem("synch_dr");			
		setCurrentTimeOfUser(); 
		SynchDataDoctor();
		syncOfflineAttandance();
		addExtra_doc_Spinner();	
	} 			
	
	if(window.localStorage.getItem("synch_cv")==2){
			//window.localStorage.removeItem("synch_cv");	
			setCurrentTimeOfUser();
			SynchDataChemist();
			//addExtra_doc_Spinner();
			
	}
	if(window.localStorage.getItem("synch_pv")==3){
			//window.localStorage.removeItem("synch_pv");			
			setCurrentTimeOfUser();
			SynchDataPocket();
			//updtpocket();
			getdataPocket();
			addExtra_doc_Spinner();
			//changePage('listPage');
			//updatePocketDetail();
	}
	if(window.localStorage.getItem("synch_pe")==4){
			//window.localStorage.removeItem("synch_pe");	
			setCurrentTimeOfUser();
			SynchDataParamedic();
			//updtps();
			getdataParamedic();
			addExtra_doc_Spinner();
			//changePage('listPage');
			
			//upadteParamedicDetail();
		
		}
	
	}catch(e){console.log(e);}
}

function updatedr(){	
	addExtra_doc_Spinner();	
	var checkNetConnection = checkNetwork();
	
try{		
	console.log(checkNetConnection);

	if(checkNetConnection == true)
	{		
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
		if(flg==1){
			getdataDoctor();	
			db.transaction(function(tx){
					tx.executeSql('select * FROM doctor', [], function(tx, results){
						
						tx.executeSql('DELETE FROM doctor where mark="yes"', []);	
						flg=0;
						
						//UpdateDoctorInfo();
						//$("#listPage").load("index.html")
							
						
					});
				});
		}
	}else{toast("Check Network");}
}catch(e){console.log(e);}
}
function updatecv(){
try{	
	var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);

	if(checkNetConnection == true)
	{		
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
		getdataChemist();	
		if(flg==1){
			
		db.transaction(function(tx){
				//alert("d");
				tx.executeSql('select * FROM chemist', [], function(tx, results){
					
					tx.executeSql('DELETE FROM chemist where mark="yes"', []);	
					flg=0;
					
						//UpdateChemistInfo();
						
						//$("#listPage").load("index.html");
			
				});
			});
		}
	}else{
			toast("check Network");
		}
}catch(e){console.log(e);}
}
function updatepv(){//pocket
try{addExtra_doc_Spinner();	
	var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);

	if(checkNetConnection == true)
	{	
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
		getdataPocket();	
		
		if(flg==1){
			
		db.transaction(function(tx){
				//alert("d");
				tx.executeSql('select * FROM pocket', [], function(tx, results){
					
					tx.executeSql('DELETE FROM pocket where mark="yes"', []);	
					flg=0;
					
						//updatePocketDetail();
						
						//$("#listPage").load("index.html");
			
				});
			});
		}
	}else{
			toast("Check Network");
		}
}catch(e){console.log(e);}
}
function updateps(){//paramedic
try{addExtra_doc_Spinner();	
var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);

if(checkNetConnection == true)
	{	
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
		
		getdataParamedic();	
		
		if(flg==1){
			
			db.transaction(function(tx){
					//alert("d");
					tx.executeSql('select * FROM paramedic', [], function(tx, results){
						
						tx.executeSql('DELETE FROM paramedic where mark="yes"', []);	
						flg=0;
						
							upadteParamedicDetail();
							
							//$("#listPage").load("index.html");
				
					});
				});
		}
	}else{
		toast("Check Network");
		}
}catch(e){console.log(e);}
}

function OfflineAttendance(att,leaveDays){
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);

	if(leaveDays=="" && att=="PL"){
		toast("Please enter the leave Day ");
		}
	else{	
		
		db.transaction(function(tx){
								
			tx.executeSql('INSERT INTO offlineAttendance(field_date,user_att,leaveDay,curr_date) VALUES(" '+mycurrentTime+' ", " '+att+' ","'+leaveDays+'","'+todaydt+'")');							
								
		});
	}
}

function syncOfflineAttandance(){
var daneAtt=0;	
var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
var checkNetConnection = checkNetwork();
	if(checkNetConnection == true)
   {			 	
		$.ajax({
			url:sessionId+'user='+usernm+'&akey='+access_Key,
			type:'GET',
    		dataType:'jsonp',
            jsonp:'callback',
            success: function(data)
			{
				var response=data.message;
				
				var success = response.success;
					
				var rs =response.result;
				
				var session_ID = rs.sessionName;
						
				var user_Id = rs.userId;
				
				db.transaction(function(tx){
					tx.executeSql('select * FROM offlineAttendance', [], function(tx, results){					
						for(var i=0;i<results.rows.length;i++){					
						
						var prsnt="Present";
		
						if((results.rows.item(i).user_att).toUpperCase()=="PL"){
							prsnt="Absent";
							}
						else if((results.rows.item(i).user_att).toUpperCase()=="PRESENT"){
							prsnt="Present"
							atvalue="None"
							}	
	
postatt=postatt+'sessid='+session_ID+'&module=PunchAttendance&data=[{"punchattendanceid": "631","mode":"RS","punchattendanceautono": "PA10020","vtiger_punchattendance_punchattendancename": "'+prsnt+'","punchdate": "'+jQuery.trim(results.rows.item(i).curr_date)+'","punchtime": "'+jQuery.trim(results.rows.item(i).field_date)+'","noofpunches": "0","longitude": "'+user_longitude+'","latitude": "'+user_latitude+'","smspunchingdatetime": "","mcc": "0","mnc": "0","cellid": "0","areacode": "0","salesorder": null,"cf_1069": "","cf_1095": "","cf_1096": "","crmid": "631","smcreatorid": "1","smownerid": "1","modifiedby": "1","setype": "PunchAttendance","createdtime": "2013-06-04 13:25:01",  "modifiedtime": "'+mycurrentTime+'","viewedtime": "2013-06-04 13:25:02","status": null,"version": "0","presence": "1","deleted": "0","id": "55x631","assigned_user_id": "'+user_Id+'","cf_1092":"'+atvalue+'","cf_1143":"00:00:00","cf_1144":"00:00:00","cf_1159":"'+jQuery.trim(results.rows.item(i).leaveDay)+'"}]';	
console.log(postatt);				
																		
								$.ajax({
									url:postatt,
									type:'POST',
									dataType:'jsonp',
									jsonp:'callback',
									success: function(data)
									{
										
										var res = data.message;
										
										var succ= res.success;
										
										toast('Punch Attendance Successfully');
										daneAtt=1;
										//changePage("menuPage","slide");
										//changePage('Pin_Varificationpage');
										
										
									} ,error:function(e)
										{
											//alert('Error Check Connection =: '+e)
										 }
								});//end ajax
								}//for 
							});
							
								if(daneAtt==1){
									
									tx.executeSql('select * FROM offlineAttendance', [], function(tx, results){
										for(var i=0;i<results.rows.length;i++){														  
											tx.executeSql('DELETE FROM offlineAttendance where tbl_id="'+i+'" ', []);
										}
									});
								}
							});
							
							/*}//end else
						 },error:function()
							 {
								alert('Error Check Connection');
							 }
					});//end ajax */
				},error:function()
				 {
					//alert('Error Check Connection');
				 }
		});//end ajax
	}else{
			
			toast('Check network connection');
			console.log(atvalue+" : "+leaveDay);
			//OfflineAttendance(atvalue,leaveDay);
		}

	}

