// javascript functions

/***********************************************************************

Function Name : doLogin (for login user into the system)

Parmeters 	  : none

return        : true login successful otherwise false with error

Author		  : ajay singh pal

************************************************************************/
var user_name='';
var password='';
var access_Key;

function doLogin()
{					
	console.log('authonticated');
	// user's email check
	var user_name = jQuery.trim($('#login').val());
	
	if(user_name == '')
	{
		toast('Please enter your user name.');
		return false;
	}

	// user's password check
	var password = jQuery.trim($('#pass').val());
	if(password == '')
	{
		toast('Please enter your password.');
		return false;
	}	

	//jQuery.support.cors = true;
	var checkNetConnection = checkNetwork();
	
	console.log(checkNetConnection+":"+user_name+":"+password);
	window.localStorage.setItem('user_name',user_name);
	window.localStorage.setItem('pass',password);
	if(checkNetConnection == true)
    {
		// service url
		var serviceURL ='http://203.109.109.190:1469/royce3/roycerest/index.php?login='+user_name+'&pass='+password;
	
		// data string (if requierd)
		var dataString = '';

		$.ajax({
			
			type: 'POST',

			url: serviceURL,

			data: dataString,

			dataType: 'jsonp',
			
			jsonp: 'callback',

			beforeSend: function(){
				
				//alert("before");
				 $.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });
 
				//loaderStart();
			},						

			complete: function(){
				//alert("complete");
				//loaderStop();
			},

			success: function(data){
				
  	
				if(data.message.success == true){
					
					
					var response=data.message;
   		
					var acc = response.result;
			
					access_Key = acc.accesskey;
					
					window.localStorage.setItem('accesskey',access_Key);
					
					
					console.log(access_Key);
			
					var role_Id = acc.roleid;
					
					window.localStorage.setItem('role_Id',role_Id);
					
					getLoginFromDB();
																							
					//getUserDB();
														
					//changePage('menuPage');
					//changePage('punchPage');
			
					}else{
						console.log("Failed to Login");
						toast('Check user or Password');
						$.unblockUI();
						loaderStop();
						return false;
					}
	
					
			},error:function(jqXHR, textStatus, errorThrown){
				// when restaurant/user session false or some error comes
				timeOut(jqXHR, textStatus, errorThrown);			
			}
		}); // ajax end
	}
	else
	{
		// do nothing
		getLoginFromDB();
		
		//return false;
	}
}

//<--------------------Login-using--DB-------------->

function getLoginFromDB(){
	
	var tlg="";

	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);	
		
	db.transaction(function(tx){

		console.log("DB Login");	
		
		var unm=window.localStorage.getItem("user_name");
		
		var pass=window.localStorage.getItem("pass");
		
		//var pin=window.localStorage.getItem("pin");		
		
		tx.executeSql('SELECT * FROM login ',[], function(tx,results){
			
			if(results.rows.length > 0){
				console.log("user");
				console.log(unm+":"+pass+":"+results.rows.item(0).username+":"+results.rows.item(0).password);
				
				//for(var i=0;i<results.rows.length;i++){	
				if(jQuery.trim(results.rows.item(0).pinvalid).toLowerCase()==="yes"){
					
					if(jQuery.trim(results.rows.item(0).username).toLowerCase()===jQuery.trim(unm).toLowerCase() ){console.log("ture usernm");
						if( jQuery.trim(results.rows.item(0).password).toLowerCase()===jQuery.trim(pass).toLowerCase() ){
					
							tlg=1;
							var checkNetConnection = checkNetwork();
							if(checkNetConnection == true)
  							  {
								getUserDB();
								
								addExtra_doc_Spinner();
								
								addExtraFieldSpinner();
								
								punchAttendance();
								
							  }else{
								 	if( jQuery.trim(results.rows.item(0).status).toLowerCase()=== jQuery.trim(firstTimelogin)){ 
										changePage("menuPage","slide");
									}else{
										tx.executeSql('UPDATE offlineAttendance  SET  endDay="no" ');
										changePage("punchPage","slide");
										}
									
								  }
								
							//return true;
							//break;
						}else{
							tlg=0;
							
							toast("check user or password");

							//return false;
							}
					}
				}else{changePage("Pin_Varificationpage","slide");}
				
				
			}
														  
		});
					
	});
	return tlg;
	/*console.log("flg value"+tlg);
	
	if(tlg == 1){console.log("flg value"+tlg);
		//getUserDB();
		//changePage('punchPage');
		return true;
					
	}else{console.log("flg value"+tlg);
							
		return false;
	}*/

}//where username="'+unm+'" AND password="'+pass+'"


//<--------------------end Login-------------->*/	
	
//<------------store user------------>

function getUserDB(){
			
		 var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);	

		 db.transaction(queryLoginDB,errorlogin);
	
	
	}

function queryLoginDB(tx)

{	var unm=window.localStorage.getItem("user_name");
	
	var pass=window.localStorage.getItem("pass");
	
	var pin=window.localStorage.getItem("pin");	

	console.log(pass);
	
	var iemi_no= window.localStorage.getItem("iemi");
	
	var access_Key = window.localStorage.getItem('accesskey');

		tx.executeSql('select * FROM login WHERE accesskey=" '+access_Key+' "', [], successuser,errorlogin);
		

	function successuser(tx, results){
				
		if(results.rows.length > 0){
						
		//tx.executeSql('UPDATE login  SET  username="'+unm+'",password=" '+pass+' ",pin="'+pin+'",status="'+firstTimelogin+'" ');   		
		tx.executeSql('UPDATE login  SET  status="'+firstTimelogin+'" ');
		}
		else{
			
			tx.executeSql('INSERT INTO login (username, password, accesskey,pin,status,pinvalid,iemi) VALUES (" '+unm+' "," '+pass+' " , " '+access_Key+' ","'+pin+'","'+firstTimelogin+'","no","'+iemi_no+'")');
	
			}
	}
}
	
function errorlogin(e)
{
  // alert("An Error Occured,Please check the login details"+e);
	
}

//<------------end store user-------------------------------------------------->
//<-----------------------------------Login End-------------------------------->

//<------------------Get Data Server all user----------------------------------->


var linkData='http://203.109.109.190:1469/royce3/roycerest/';

//http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user=admin&akey=yDdrYfQJmEfEeWH5;

var sessionId ='http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?';

function getdataDoctor(){
try{
	setCurrentTimeOfUser();		
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	access_Key = window.localStorage.getItem('accesskey');
	var unm=window.localStorage.getItem("user_name");
	console.log('user='+unm+'&akey='+access_Key);
	var checkNetConnection = checkNetwork();
if(checkNetConnection == true)
  {	
	$.ajax({
		  url:'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
		  type:'POST',
    	  dataType:'jsonp',
          jsonp:'callback',
		  
		  beforeSend: function(){
				$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

				//loaderStart();
				console.log("before");
			},
		  complete: function(){
				//alert("complete");
				console.log("complete");
				$.unblockUI();
				//loaderStop();
			},	
		  
          success: function(data)
			{
				
				var response=data.message;

				var success = response.success;
				
				var rs =response.result;
				
				var session_ID=rs.sessionName;
					
				var user_Id = rs.userId;
				//window.localStorage.setItem('userid_store',user_Id);		
			
				if(success==true){
						
						$.ajax({
				
							  url:'http://203.109.109.190:1469/royce3/roycerest/view_drvisit.php?sessid='+session_ID,
				  			  type:'POST',
    			  	  		  dataType:'jsonp',
                          	  jsonp:'callback',
							  beforeSend: function(){
								//Your code goes here
								//loaderStart();
								console.log("start");
								},						
							  complete: function(){
								//Your code goes here
								//loaderStop();
								console.log("complete");
								},
                 		 	  success: function(data)
				  				{console.log('success');
								 var response=data.message;
				  		
								 var success = response.success;
								 
								 console.log("start"+success);			
								 
								 var rs=response.result;				
						 		 
								 if(success){console.log("DOCTOR"+response.result.length);
								
										var access_Key = window.localStorage.getItem('accesskey');
										
											
										db.transaction(function(tx){
											for(var i=0; i<response.result.length; i++){	
												tx.executeSql('select * FROM doctor WHERE doctorvisitautono=" '+rs[i].doctorvisitautono+' "', [], function(tx, results){
											
											if(results.rows.length>0){
											
												console.log("update");
												tx.executeSql('UPDATE doctor  SET  doctorvisitautono=" '+rs[i].doctorvisitautono+' ", doctorvisitname=" '+rs[i].doctorvisitname+' ",doctorvisit_location=" '+rs[i].vtiger_doctorvisit_location+' " ,doctorvisit_enlistingcn=" '+rs[i].vtiger_doctorvisit_enlistingcn+' " ,doctorvisit_enlistingif=" '+rs[i].vtiger_doctorvisit_enlistingif+' " ,remarks=" '+rs[i].remarks+' ",createdtime=" '+rs[i].CreatedTime+' ", ModifiedTime=" '+rs[i].ModifiedTime+' ", cf_1063=" '+rs[i].cf_1063+' ", cf_1064=" '+rs[i].cf_1064+' ", id=" '+rs[i].id+' ",cf_1128="'+rs[i].cf_1127+'",cf_1127="'+rs[i].cf_1128+'",cf_1129="'+rs[i].cf_1129+'",cf_1130="'+rs[i].cf_1130+'",mark="not",nxt1="",nxt2="",nxt3="",nxt4="" WHERE doctorvisitautono=" '+rs[i].doctorvisitautono+' " ');				
											}else{
												console.log('insert');
												tx.executeSql('INSERT INTO doctor (accesskey, doctorvisitautono, doctorvisitname, doctorvisit_location, doctorvisit_enlistingcn, doctorvisit_enlistingif, remarks, user_id, createdtime, ModifiedTime, cf_1063, cf_1064, id,cf_1127,cf_1128,cf_1129,cf_1130,nxt1,nxt2,nxt3,nxt4) VALUES (" '+access_Key+' "," '+rs[i].doctorvisitautono+' " , " '+rs[i].doctorvisitname+' " ,  " '+rs[i].vtiger_doctorvisit_location+' " ,  " '+rs[i].vtiger_doctorvisit_enlistingcn+' " ,  " '+rs[i].vtiger_doctorvisit_enlistingif+' ",  " '+rs[i].remarks+' " ,  " '+rs[i].assigned_user_id+' ", " '+rs[i].CreatedTime+' " , " '+rs[i].ModifiedTime+' ", " '+rs[i].cf_1063+' ", " '+rs[i].cf_1064+' ", " '+rs[i].id+' ","'+rs[i].cf_1128+'","'+rs[i].cf_1127+'","'+rs[i].cf_1129+'","'+rs[i].cf_1130+'","","","","")');
   												}
											});
										}
										UpdateDoctorInfo();
									}, errorCB, successStore);	
									//for
								 }
							},error:function(){toast('Check Network')}
						});
					}else{
								 
 			toast(' Session Expire Login Again ');
	    }
	},error:function(e)
		{
		//alert('Error Check Connection');
		}
  });
  }else{toast('Unable to get Data Check network');}

	}catch(e){console.log(e);}
}
/*<-----------doctor End-&&&& ----Chemist start--------------------------------------->*/
function getdataChemist(){
try{	
	setCurrentTimeOfUser();		
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	access_Key = window.localStorage.getItem('accesskey');
	var unm=window.localStorage.getItem("user_name");
	console.log('user='+unm+'&akey='+access_Key);
var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);
if(checkNetConnection == true)
  {	
	$.ajax({
		  url:'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
		  type:'POST',
    	  dataType:'jsonp',
          jsonp:'callback',
		  
		  beforeSend: function(){
				//alert("before");
				$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

				//loaderStart();
				console.log("before");
			},
		  complete: function(){
				//alert("complete");
				console.log("complete");
				$.unblockUI();
				//loaderStop();
			},	
		  
          success: function(data)
			{
				
				var response=data.message;

				var success = response.success;
				
				var rs =response.result;
				
				var session_ID=rs.sessionName;
					
				var user_Id = rs.userId;
				window.localStorage.setItem('userid_store',user_Id);		
				if(success==true){
												
						$.ajax({
							  url:'http://203.109.109.190:1469/royce3/roycerest/view_chemvisit.php?sessid='+session_ID,
				  			  type:'POST',
    			  	  	  	  dataType:'jsonp',
                          	  jsonp:'callback',
                 		 	  success: function(data)
				  				{
								var response=data.message;
				  		
								var success = response.success;
						
								var rs =response.result;	
								var access_Key = window.localStorage.getItem('accesskey');					
								if(success){
									console.log("CHEMIST");
									
									for(var i=0; i<response.result.length;i++){				 
										
										db.transaction(function(tx){
																
										tx.executeSql('select * FROM chemist WHERE chemistvisitautono="'+rs[i].chemistvisitautono+'"', [], function(tx, results){
										//alert(results.rows.length);
										if(results.rows.length>0){
											
											console.log("update chemist");
											
											tx.executeSql('UPDATE chemist  SET  chemistvisit_chemistvisitname="'+rs[i].vtiger_chemistvisit_chemistvisitname+'", chemistvisit_availabilityofcn="'+rs[i].vtiger_chemistvisit_availabilityofcn+'" ,chemistvisit_availabilityofif="'+rs[i].vtiger_chemistvisit_availabilityofif+'" ,obqtycn="'+rs[i].obqtycn+'" ,obqtyif="'+rs[i].obqtyif+'",user_id="'+rs[i].assigned_user_id+'" ,createdtime="'+rs[i].CreatedTime+'", ModifiedTime="'+rs[i].ModifiedTime+'", cf_1060="'+rs[i].cf_1060+'", cf_1061="'+rs[i].cf_1061+'",cf_1062="'+rs[i].cf_1062+'",cf_1125="'+rs[i].cf_1125+'",cf_1126="'+rs[i].cf_1126+'" ,id="'+rs[i].id+'", mark="not",nxt1="",nxt2="",nxt3="",nxt4="" WHERE chemistvisitautono="'+rs[i].chemistvisitautono+'" ');	
										}else{	 console.log("insert chemist");
										
											tx.executeSql('INSERT INTO chemist (accesskey, chemistvisitautono, chemistvisit_chemistvisitname,  chemistvisit_availabilityofcn, chemistvisit_availabilityofif, obqtycn, obqtyif,  user_id, createdtime, ModifiedTime, cf_1060, cf_1061, cf_1062,cf_1125,cf_1126, id,nxt1,nxt2,nxt3,nxt4) VALUES ("'+access_Key+'","'+rs[i].chemistvisitautono+'" , "'+rs[i].vtiger_chemistvisit_chemistvisitname+'" ,"'+rs[i].vtiger_chemistvisit_availabilityofcn+'" ,  "'+rs[i].vtiger_chemistvisit_availabilityofif+'",  "'+rs[i].obqtycn+'" ,  "'+rs[i].obqtyif+'" ,"'+rs[i].assigned_user_id+'", "'+rs[i].CreatedTime+'" , "'+rs[i].ModifiedTime+'", "'+rs[i].cf_1060+'", "'+rs[i].cf_1061+'", "'+rs[i].cf_1062+'","'+rs[i].cf_1125+'","'+rs[i].cf_1126+'", "'+rs[i].id+'","","","","")');
   											}
										});
																	 	
									}, errorCB, successStore);
				
								}//for
								UpdateChemistInfo();
 							}else{
								toast('Session Expire Login Again');
								}
						},error:function(e)
							{
		 						//alert('Error Check Connection');
	 			 			}
 					});//ajax
								
		}else{
								 
 			toast(' Session Expire Login Again ');
	    }
	},error:function(e)
		{
		//alert('Error Check Connection');
		}
  });
  }else{toast('Unable to get Data Check network');}

	}catch(e){console.log(e);}
}
			
/*<---------Chemist End &&&&-Packet Start----------------------------------------------->*/
function getdataPocket(){
try{	
	setCurrentTimeOfUser();		
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	access_Key = window.localStorage.getItem('accesskey');
	var unm=window.localStorage.getItem("user_name");
	console.log('user='+unm+'&akey='+access_Key);
var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);
if(checkNetConnection == true)
 {	
	$.ajax({
		  url:'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
		  type:'POST',
    	  dataType:'jsonp',
          jsonp:'callback',
		  
		  beforeSend: function(){
				//alert("before");
				$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

				//loaderStart();
				console.log("before");
			},
		  complete: function(){
				//alert("complete");
				console.log("complete");
				$.unblockUI();
				//loaderStop();
			},	
		  
          success: function(data)
			{
				
				var response=data.message;

				var success = response.success;
				
				var rs =response.result;
				
				var session_ID=rs.sessionName;
					
				var user_Id = rs.userId;
				window.localStorage.setItem('userid_store',user_Id);		
				if(success==true){
						
					$.ajax({
						  url:'http://203.109.109.190:1469/royce3/roycerest/view_pocket.php?sessid='+session_ID,
				  		  type:'GET',
    			  	 	  dataType:'jsonp',
                    	  jsonp:'callback',
                 		  success: function(data)
				  		 	{
							 var response=data.message;
				  		
							 var success = response.success;
																				
						 	 if(success){console.log("POCKET");
								 var rs =response.result;
								 for(var i=0; i<response.result.length;i++){		
									 db.transaction(function(tx){	
								     tx.executeSql('select * FROM pocket WHERE pocketsessionautono=" '+rs[i].pocketsessionautono+' "', [], function(tx, results){
																						
									 if(results.rows.length>0){  
																				
tx.executeSql('UPDATE pocket SET pocketsessionname="'+rs[i].pocketsessionname+'", date="'+rs[i].date+'", totalhcpparticipants="'+rs[i].totalhcpparticipants+'", totalenlistedhcpparticipants="'+rs[i].totalenlistedhcpparticipants+'", costoftheevent="'+rs[i].costoftheevent+'", user_id="'+rs[i].assigned_user_id+'" ,createdtime="'+rs[i].CreatedTime+'", ModifiedTime="'+rs[i].ModifiedTime+'", cf_1090="'+rs[i].cf_1090+'", cf_1135="'+rs[i].cf_1136+'", cf_1136="'+rs[i].cf_1135+'", cf_1137="'+rs[i].cf_1137+'", cf_1138="'+rs[i].cf_1138+'", id="'+rs[i].id+'",mark="not",nxt1="",nxt2="",nxt3="",nxt4="",cf_1156="'+rs[i].cf_1156+'" where pocketsessionautono = "'+rs[i].pocketsessionautono+'" ');	
															
									}else{			
										tx.executeSql('INSERT INTO pocket (accesskey, pocketsessionautono, pocketsessionname, date, totalhcpparticipants, totalenlistedhcpparticipants, costoftheevent, user_id, createdtime, ModifiedTime, cf_1090,cf_1135,cf_1136,cf_1137,cf_1138, id,nxt1,nxt2,nxt3,nxt4,cf_1156) VALUES (" '+access_Key+' "," '+rs[i].pocketsessionautono+' " , " '+rs[i].pocketsessionname+' " ,  " '+rs[i].date+' " ,  " '+rs[i].totalhcpparticipants+' " ,  " '+rs[i].totalenlistedhcpparticipants+' ", " '+rs[i].costoftheevent+' " ,  " '+rs[i].assigned_user_id+' ", " '+rs[i].CreatedTime+' " , " '+rs[i].ModifiedTime+' ", " '+rs[i].cf_1090+' "," '+rs[i].cf_1136+' "," '+rs[i].cf_1135+' "," '+rs[i].cf_1137+' "," '+rs[i].cf_1138+' ", " '+rs[i].id+' ","","","","","'+rs[i].cf_1156+'")');
   	
										}
									});
								},errorCB);
							}//end for
							updatePocketDetail();
						}else{
						 
							toast(' Session Expire Login Again ');
						}
				  	}
				  	,error:function(e)
						{
		 				//alert('Error Check Connection');
		 				}
   				});
						
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
/*<----------------Packet End---&&&&Paramedic Start----------------------------------->*/	
function getdataParamedic(){
try{	
	setCurrentTimeOfUser();		
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	access_Key = window.localStorage.getItem('accesskey');
	var unm=window.localStorage.getItem("user_name");
	console.log('user='+unm+'&akey='+access_Key);
var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);
if(checkNetConnection == true)
 {	
	$.ajax({
		  url:'http://203.109.109.190:1469/royce3/roycerest/rsacrm3.php?user='+unm+'&akey='+access_Key,
		  type:'POST',
    	  dataType:'jsonp',
          jsonp:'callback',
		  
		  beforeSend: function(){
				//alert("before");
				$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

				//loaderStart();
				console.log("before");
			},
		  complete: function(){
				//alert("complete");
				console.log("complete");
				$.unblockUI();
				//loaderStop();
			},	
		  
          success: function(data)
			{
				
				var response=data.message;

				var success = response.success;
				
				var rs =response.result;
				
				var session_ID=rs.sessionName;
					
				var user_Id = rs.userId;
				window.localStorage.setItem('userid_store',user_Id);		
				if(success==true){
			
				$.ajax({
								
					  url:'http://203.109.109.190:1469/royce3/roycerest/view_paramedic.php?sessid='+session_ID,
					  type:'POST',
				  	  dataType:'jsonp',
					  jsonp:'callback',
					  success: function(data)
						{
					    	var response=data.message;
							var success = response.success;
							if(success){console.log("PARAMEDIC");
						    var rs =response.result;
							for(var i=0; i<response.result.length;i++){		
								 db.transaction(function(tx){		
							     tx.executeSql('select * FROM paramedic WHERE paramedicsessionautono=" '+rs[i].paramedicsessionautono+' "', [], function(tx, results){
																										
								 if(results.rows.length>0){  
																											
									tx.executeSql('UPDATE paramedic  SET  paramedicsessionname="'+rs[i].paramedicsessionname+'",date="'+rs[i].date+'",paramedicsession_location="'+rs[i].vtiger_paramedicsession_location+'" ,paramedicsession_institutename="'+rs[i].vtiger_paramedicsession_institutename+'" ,totalparamedicparticipants="'+rs[i].totalparamedicparticipants+'" ,costofevent="'+rs[i].costofevent+'",user_id="'+rs[i].assigned_user_id+'",createdtime="'+rs[i].CreatedTime+'",ModifiedTime="'+rs[i].ModifiedTime+'",cf_1091="'+rs[i].cf_1091+'",cf_1140="'+rs[i].cf_1139+'",cf_1139="'+rs[i].cf_1140+'",cf_1141="'+rs[i].cf_1141+'",cf_1142="'+rs[i].cf_1142+'",id="'+rs[i].id+'",mark="not",nxt1="",nxt2="",nxt3="",nxt4="" where paramedicsessionautono = "'+rs[i].paramedicsessionautono+'"');	
																	
								}else{	
									tx.executeSql('INSERT INTO paramedic (accesskey, paramedicsessionautono, paramedicsessionname, date, paramedicsession_location, paramedicsession_institutename, totalparamedicparticipants, costofevent, user_id, createdtime, ModifiedTime, cf_1091,cf_1139,cf_1140,cf_1141,cf_1142, id,nxt1,nxt2,nxt3,nxt4) VALUES (" '+access_Key+' "," '+rs[i].paramedicsessionautono+' " , " '+rs[i].paramedicsessionname+' " ,  " '+ rs[i].date+' " ,  " '+rs[i].vtiger_paramedicsession_location+' " ,  " '+rs[i].vtiger_paramedicsession_institutename+' ",  " '+rs[i].totalparamedicparticipants+' " ," '+rs[i].costofevent+' " , " '+rs[i].assigned_user_id+' ", " '+rs[i].CreatedTime+' " , " '+rs[i].ModifiedTime+' ", " '+rs[i].cf_1091+' "," '+rs[i].cf_1140+' "," '+rs[i].cf_1139+' "," '+rs[i].cf_1141+' "," '+rs[i].cf_1142+' ", " '+rs[i].id+' ","","","","")');
									}
								});
							},errorCB);
						}
						upadteParamedicDetail();
					 }else{	 
						toast(' Session Expire Login Again ');
						}
				},error:function(e)
					{
					toast('Error Check Connection');
				}
			});
/*<-------------------------Paramedic End------------------------------------>*/																
						
		}else{
								 
 			toast(' Session Expire Login Again ');
	    }
	},error:function(e)
		{
		//alert('Error Check Connection');
		}
  });
 }else{toast('Check network connetion');}

	}catch(e){console.log(e);}
}
	

function  successStore(){
	
	}
function  errorCB(e){
	
		//alert('error'+e);
	}

//<-----************end all user store*************************>


//<-------------------Show Data On Table---------------------------*>


//<-***************doc start----------------------------------------------->
function UpdateDoctorInfo(){
	
		//addExtra_doc_Spinner();
		

		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);									
		db.transaction(function(tx){
								
			tx.executeSql('SELECT * FROM doctor',  [], function(tx, results){ 		
				  						
			console.log(lenInf = results.rows.length);
									
			var output="<table id='abcd' cellpadding='0' cellspacing='0' style='font-size:14px; color:#ffffff;' width='100%'><thead><tr style='background-color:#B85008; font-weight:bold;'><td style='padding:10px; border:1px solid #ffffff; border-left:none;'>Name</td><td style='padding:10px; border:1px solid #ffffff;'>Location</td><td style='padding:10px; border:1px solid #ffffff; border-right:none;'>Date</td></tr></thead>";
								
			for (var i = 0; i < results.rows.length; i++) 
				{
				output+="<tbody style='width=100%;'><tr><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-left:none; padding:10px;'>Dr. <a href='#' class='aClass' onclick='getlistvaluefrmTable("+results.rows.item(i).doc_id+")'>"+results.rows.item(i).doctorvisitname+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTable("+results.rows.item(i).doc_id+")'>"+results.rows.item(i).doctorvisit_location+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-right:none; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTable("+results.rows.item(i).doc_id+")'>"+results.rows.item(i).cf_1063+"</a></td></tr></tbody>";	
				}
				output+="</table>";
			
				changePage("listPage","slide");
			
				$('#Flist').html(output);
					
				window.localStorage.setItem("dv_search",1);
				window.localStorage.removeItem("cv_search");		
				window.localStorage.removeItem("ps_search");	
				window.localStorage.removeItem("pe_search");
				
				window.localStorage.setItem('synch_dr',1);
				window.localStorage.removeItem("synch_pv");		
				window.localStorage.removeItem("synch_cv");
				window.localStorage.removeItem("synch_pe");	
				
				
				
				$('#tableheader').html("Doctor List");
									
		},errorCB);
	}, errorCB);
									
}		
 /*$('#litd').click(function () {
            
	   var instance = $(this);
            
	   instance.css('background-color', 'Red');
           
	   instance.find('td:eq(0)') .css('background-color', 'Green');
            
});*/

function getlistvaluefrmTable(listkey){
		
	window.localStorage.setItem('listkey',listkey);
				
	//changePage("editPage_doctor","slide");
	
	$('#header_dr').text('Edit Doctor');
	
	$("#edit_location_doc").prop("disabled", true); 
			
	$("#edit_name_doc").prop("disabled", true);
	
		
	showDataOnTable('Yes');
	
}

function showDataOnTable(checkDoctor){	
	changePage("editPage_doctor","slide");
	var dr_name = '';
	var dr_loc = '';
	var location = '<option value="">Select</option>';
	var namedoc = '<option value="">Select</option>';
	
	$("#ui-btn-textdr3").html("<span class='ui-listview'>Select</span>");
	$("#ui-btn-textdr4").html("<span class='ui-listview'>Select</span>");
	$('#edit_remark_doc').val("");
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	db.transaction(function(tx){
		if(window.localStorage.getItem('listkey')){
			
			var listkey =window.localStorage.getItem('listkey');
					
			tx.executeSql('SELECT * FROM doctor where doc_id =" '+listkey+' "',  [], updateTableSuccess, errorCB);
					
				function updateTableSuccess(tx, results){
					if(results.rows.length>0){
						
						if(checkDoctor == 'Yes')
						{
							dr_name=results.rows.item(0).doctorvisitname;   
							dr_loc=results.rows.item(0).doctorvisit_location;
						}
											
						
						
					}//end if
				}//end fun

			}//end if
			else{
				//return false;
			}
//<---------------spinner------------------>
			tx.executeSql('SELECT DISTINCT doc_location FROM royce_doctor ORDER BY doc_location ASC;',  [],function(tx,results){
					
				console.log(results.rows.length);
				if(results.rows.length>0){
					for (var i = 0; i < results.rows.length; i++) {
						if(checkDoctor == 'Yes')
						{
							if(jQuery.trim(dr_loc) == jQuery.trim(results.rows.item(i).doc_location))
							{
								location+='<option value="" selected="selected">'+jQuery.trim(results.rows.item(i).doc_location)+'</option>';
								$("#ui-btn-textdr3").html("<span class='ui-listview'>"+jQuery.trim(results.rows.item(i).doc_location)+"</span>");
							}
							else
							{
								location+='<option value="">'+jQuery.trim(results.rows.item(i).doc_location)+'</option>';
							}
						}
						else
						{
							location+='<option value="">'+jQuery.trim(results.rows.item(i).doc_location)+'</option>';
						}
					}
					$('#edit_location_doc').html(location);											  				}//end if	
			},errorCB);
			if(checkDoctor == 'Yes')
			{
				tx.executeSql('SELECT DISTINCT doc_name FROM royce_doctor where doc_location =" '+jQuery.trim(dr_loc)+' "',  [], function(tx,results){																																													 						namedoc = '<option value="">Select</option>';																																						
						if(results.rows.length > 0){console.log(results.rows.length);
							for (var i = 0; i < results.rows.length; i++) {
								if(checkDoctor == 'Yes')
								{
									if(jQuery.trim(dr_name) == jQuery.trim(results.rows.item(i).doc_name))
									{
										namedoc+='<option value="" selected="selected">'+jQuery.trim(results.rows.item(i).doc_name)+'</option>';
										$("#ui-btn-textdr4").html("<span class='ui-listview'>"+jQuery.trim(results.rows.item(i).doc_name)+"</span>");
									}
									else
									{
										namedoc+='<option value="">'+jQuery.trim(results.rows.item(i).doc_name)+'</option>';
									}
								}
								else
								{
									namedoc+='<option value="">'+jQuery.trim(results.rows.item(i).doc_name)+'</option>';
								}
							}
							$('#edit_name_doc').html(namedoc);
						}
					},errorCB);
			}
			else
			{
				$('#edit_name_doc').html(namedoc);
			}
					
			$('#edit_location_doc').change(function() {
				var getlocation=$('#edit_location_doc :selected').text();
				console.log(getlocation);
				tx.executeSql('SELECT DISTINCT doc_name FROM royce_doctor where doc_location =" '+getlocation+' "',  [],													function(tx,results){
																																													 						namedoc = '<option value="">Select</option>';	
																																																			
						if(results.rows.length > 0){console.log(results.rows.length);
							for (var i = 0; i < results.rows.length; i++) {
								namedoc+='<option value="">'+jQuery.trim(results.rows.item(i).doc_name)+'</option>';
								$("#ui-btn-textdr4").html("<span class='ui-listview'></span>");
							}
							$('#edit_name_doc').html(namedoc);
						}
					},errorCB);	
			});var fieldLen=0;
			tx.executeSql('SELECT * FROM royce_doc_txt',  [],function(tx,results){
				var field_txt=""; var sendName = '';
				for (var i = 0; i < results.rows.length; i++) {
						
					/*sendName = "'"+jQuery.trim(results.rows.item(i).field_name)+"'";
					field_txt+='<label class="ui-input-text" id="doc_lbl_'+i+'">'+jQuery.trim(results.rows.item(i).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="doc_nxt_'+i+'" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" onkeyup="checkValidate('+sendName+', '+i+');" />';
					*/
						$('#doc_lbl_'+i).append('( ATP '+jQuery.trim(results.rows.item(i).feild_value)+')');
					console.log(field_txt);
						
				}
				if( results.rows.length >= 0){
					try{	sendName = '';//"'"+jQuery.trim(results.rows.item(i).field_name)+"'";
					field_txt+='<label class="ui-input-text" id="doc_lbl_0">'+jQuery.trim(results.rows.item(0).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="doc_nxt_0" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" onkeyup="checkValidate();" />';
					
					field_txt+='<label class="ui-input-text" id="doc_lbl_1">'+jQuery.trim(results.rows.item(1).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="doc_nxt_1" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" onkeyup="checkValidate();" />';
					
					field_txt+='<label class="ui-input-text" id="doc_lbl_2">'+jQuery.trim(results.rows.item(2).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="doc_nxt_2" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" onkeyup="checkValidate();" />';
					
					field_txt+='<label class="ui-input-text" id="doc_lbl_3">'+jQuery.trim(results.rows.item(3).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="doc_nxt_3" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" onkeyup="checkValidate();" />';
					
					}catch(e){console.log(e);}
					}
				try{														   
				$('#add_nxt_field_doc').html(field_txt);
				}catch(e){console.log(e);}
			});
//<---------------end spinner------------------>
tx.executeSql('SELECT * FROM royce_doc_txt',  [],function(tx,results){
														  
					for(var i=0;i<results.rows.length;i++){													  
						if(parseInt(results.rows.item(i).feild_value) > 0){//alert(i);
							$('#doc_lbl_'+i).append('( ATP '+jQuery.trim(results.rows.item(i).feild_value)+')');
							//$('#doc_lbl_1').append('( ATP '+jQuery.trim(results.rows.item(1).feild_value)+')');
							//$('#doc_lbl_2').append('( ATP '+jQuery.trim(results.rows.item(2).feild_value)+')');
							//$('#doc_lbl_3').append('( ATP '+jQuery.trim(results.rows.item(3).feild_value)+')');	
						}else{
								$('#doc_nxt_'+i).hide();
								$('#doc_lbl_'+i).hide();
								$('#doc_nxt_'+i+'').hide();
								$('#doc_lbl_'+i+'').hide();								
								
						}
							
					}
});
if(window.localStorage.getItem('listkey')){
	tx.executeSql('SELECT * FROM doctor where doc_id = "'+window.localStorage.getItem('listkey')+'"',  [],function(tx,results){
		if(results.rows.length>0) {
				
			$('#doc_nxt_0').val(jQuery.trim(results.rows.item(0).cf_1127));
			$('#doc_nxt_1').val(jQuery.trim(results.rows.item(0).cf_1128));
			$('#doc_nxt_2').val(jQuery.trim(results.rows.item(0).cf_1129));
			$('#doc_nxt_3').val(jQuery.trim(results.rows.item(0).cf_1130));
			
			previousValueHandal(results.rows.item(0).cf_1127,results.rows.item(0).cf_1128,results.rows.item(0).cf_1129,results.rows.item(0).cf_1130);
			
			$('#edit_remark').val(results.rows.item(0).remarks);
							
			//$("#slider_ecn_doc").text(results.rows.item(0).doctorvisit_enlistingcn);
										
			//$("#slider_eif_doc").text(results.rows.item(0).doctorvisit_enlistingif);
			
			if(jQuery.trim(results.rows.item(0).doctorvisit_enlistingcn).toLowerCase()=="yes" || parseInt(results.rows.item(0).doctorvisit_enlistingcn)==1){
				
			//var sliedr5 = '<option value="Yes" selected="selected">Yes</option><option value="No">No</option>';
				document.getElementById("s1").selected=true;
				$('#slider_ecn_doc').trigger('change');
				$("#ecndoc .ui-slider-label-a").css("width","100%");
				$("#ecndoc .ui-slider-label-b").css("width","0%");
				
				
			}else{//var sliedr5 = '<option value="Yes">Yes</option><option value="No" selected="selected">No</option>';
					document.getElementById("s").selected=true;
					$('#slider_ecn_doc').trigger('change');
					$("#ecndoc .ui-slider-label-a").css("width","0%");
					$("#ecndoc .ui-slider-label-b").css("width","100%");
					
				}
			
			if(jQuery.trim(results.rows.item(0).doctorvisit_enlistingif).toLowerCase()=="yes" || parseInt(results.rows.item(0).doctorvisit_enlistingif)==1){
				//var sliedr6 = '<option value="Yes" selected="selected">Yes</option><option value="No">No</option>';
				
				document.getElementById("d1").selected=true;
				$('#slider_eif_doc').trigger('change');
				$("#eifdoc .ui-slider-label-a").css("width","100%");
				$("#eifdoc .ui-slider-label-b").css("width","0%");
				
			}else{
				//var sliedr6 = '<option value="Yes" >Yes</option><option value="No" selected="selected">No</option>';
				document.getElementById("d").selected=true;
				$('#slider_eif_doc').trigger('change');
				$("#eifdoc .ui-slider-label-a").css("width","0%");
				$("#eifdoc .ui-slider-label-b").css("width","100%");
				
				}
			
			//$("#slider_ecn_doc").html(sliedr5);
			
			//$("#slider_eif_doc").html(sliedr6);
		}
	});

}else{previousValueHandal(0,0,0,0);
/*	tx.executeSql('SELECT * FROM royce_doc_txt',  [],function(tx,results){
		for (var i = 0; i < results.rows.length; i++) {

			$('#doc_nxt_'+i+'').val(jQuery.trim(results.rows.item(i).feild_value));
		*/
		}

	}, errorCB);			
}
					

//<-***************doc end----------------------------------------------->

//<--------**********chemist**************************************>

function UpdateChemistInfo(){
	
	
	//addExtraFieldSpinner();
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);									
	db.transaction(function(tx){
							
		tx.executeSql('SELECT * FROM chemist',  [],function(tx,results){
																														
			var lenInf = results.rows.length;
									
			console.log(lenInf);
									
	 var output="<table id='abcd' cellpadding='0' cellspacing='0' style='font-size:14px; color:#ffffff;' width='100%'><thead><tr style='background-color:#B85008; font-weight:bold;'><td style='padding:10px; border:1px solid #ffffff; border-left:none;'>Name</td><td style='padding:10px; border:1px solid #ffffff;'>Location</td><td style='padding:10px; border:1px solid #ffffff; border-right:none;'>Date</td></tr></thead>";
			for (var i = 0; i < results.rows.length; i++) 
			{
		output+="<tbody style='width=100%;'><tr><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-left:none; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTablecv("+results.rows.item(i).chemist_id+")'>"+results.rows.item(i).cf_1060+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTablecv("+results.rows.item(i).chemist_id+")'>"+results.rows.item(i).chemistvisit_chemistvisitname+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-right:none; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTablecv("+results.rows.item(i).chemist_id+")'>"+results.rows.item(i).cf_1061+"</a></td></tr></tbody>";	
										
			}
			console.log(output);
			output+="</table>";
		
			changePage("listPage","slide");
		
			$('#Flist').html(output);
		
			window.localStorage.setItem("cv_search",2);
			window.localStorage.removeItem("dv_search");
			window.localStorage.removeItem("ps_search");	
			window.localStorage.removeItem("pe_search");
			
			window.localStorage.removeItem("synch_pe");
			window.localStorage.setItem("synch_cv",2);		
			window.localStorage.removeItem("synch_pv");
			window.localStorage.removeItem("synch_dr");	
									
			$('#tableheader').html("Chemist Visit List");
									
		}, errorCB);		
	
	}, errorCB);
									
}
	

function getlistvaluefrmTablecv(listkey){
		
			window.localStorage.setItem('listkey',listkey);
			
			//document.getElementById("edit_location_ch").disabled=true;
			
			//document.getElementById("edit_name_ch").disabled=true;
			
			$("#edit_location_ch").prop("disabled", true); 
			
			$("#edit_name_ch").prop("disabled", true);
			
			//changePage("editPage_chemist","");
			
			$('#header_ch').text('Edit Chemist');
			
			showDataOnTableChemist('Yes');
}

function showDataOnTableChemist(checkChemist){																								
		
		changePage("editPage_chemist","slide");
		
		var location = '<option value="">Select</option>'
		var namedoc = '<option value="">Select</option>'
		var ch_loc;
		var ch_name;
		
		$("#ui-btn-textch5").html("<span class='ui-listview'>Select</span>");
		$("#ui-btn-textch6").html("<span class='ui-listview'>Select</span>");
		
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
		db.transaction(function(tx){
			if(window.localStorage.getItem('listkey')){
				var listkey =window.localStorage.getItem('listkey');
					
				tx.executeSql('SELECT * FROM chemist where chemist_id =" '+listkey+' "',  [], updateTableSuccess, errorCB);
	
				function updateTableSuccess(tx, results){
				
					if(checkChemist == 'Yes')
					{
						ch_name=results.rows.item(0).cf_1060;
						ch_loc=results.rows.item(0).chemistvisit_chemistvisitname;
					}
						
					//$("#slider_ecn_ch:selected").text(results.rows.item(0).chemistvisit_availabilityofcn);
					
					//$("#slider_eif_ch:selected").text(results.rows.item(0).chemistvisit_availabilityofif);
					
					$('#edit_obqtycn').val(results.rows.item(0).obqtycn);
					$('#edit_obqtyif').val(results.rows.item(0).obqtyif);
					//$("#edit_obqtycn").val(results.rows.item(0).obqtycn);
					//$("#edit_obqtyif").val(results.rows.item(0).obqtyif);
					//$('#slider_quality: selected').text(results.rows.item(0).cf_1126);													
					//$('#slider_outlet: selected').text(results.rows.item(0).cf_1125);
					
					if(jQuery.trim(results.rows.item(0).chemistvisit_availabilityofcn).toLowerCase()=="yes" ){
						document.getElementById("ecn_ch_yes").selected=true;
					//var sliedr1 = '<option value="Yes" selected="selected">Yes</option><option value="No">No</option>';
						$('#slider_ecn_ch').trigger('change');
						$("#ecn_slider .ui-slider-label-a").css("width","100%");
						$("#ecn_slider .ui-slider-label-b").css("width","0%");
					}else{
					//var sliedr1 = '<option value="Yes">Yes</option><option value="No" selected="selected">No</option>';
						document.getElementById("ecn_ch_no").selected=true;
						$('#slider_ecn_ch').trigger('change');
						$("#ecn_slider .ui-slider-label-a").css("width","0%");
						$("#ecn_slider .ui-slider-label-b").css("width","100%");
						
						}
					
					if(jQuery.trim(results.rows.item(0).chemistvisit_availabilityofif).toLowerCase()=="yes" ){
					//var sliedr2 = '<option value="Yes" selected="selected">Yes</option><option value="No">No</option>';
						document.getElementById("eif_ch_yes").selected=true;						
						$('#slider_eif_ch').trigger('change');
						$("#eif_slider .ui-slider-label-a").css("width","100%");
						$("#eif_slider .ui-slider-label-b").css("width","0%");
						
					}else{	
					//var sliedr2 = '<option value="Yes">Yes</option><option value="No" selected="selected">No</option>';
							document.getElementById("eif_ch_no").selected=true;
							$('#slider_eif_ch').trigger('change');
							$("#eif_slider .ui-slider-label-a").css("width","0%");
							$("#eif_slider .ui-slider-label-b").css("width","100%");
							
						}
					
					if(jQuery.trim(results.rows.item(0).cf_1125).toLowerCase()=="yes" ){
					//var sliedr3 = '<option value="Yes" selected="selected">Yes</option><option value="No">No</option>';
						document.getElementById("outlet_yes").selected=true;
						$('#slider_outlet').trigger('change');
						$("#outletshow .ui-slider-label-a").css("width","100%");
						$("#outletshow .ui-slider-label-b").css("width","0%");
						
					}else{
					//var sliedr3 = '<option value="Yes">Yes</option><option value="No" selected="selected">No</option>';
						document.getElementById("outlet_no").selected=true;
						$('#slider_outlet').trigger('change');
						$("#outletshow .ui-slider-label-a").css("width","0%");
						$("#outletshow .ui-slider-label-b").css("width","100%");
						
						}
					
					if(jQuery.trim(results.rows.item(0).cf_1126).toLowerCase()=="good" || jQuery.trim(results.rows.item(0).cf_1126)=="Good" ){
				//var sliedr4 = '<option value="good" selected="selected">good</option><option value="Bad">Bad</option>';
						console.log('if');
						document.getElementById("quality_g").selected=true;						
						
						$("#qualityshow .ui-slider-label-a").css("width","100%");
						$("#qualityshow .ui-slider-label-b").css("width","0%");
						
						$('#slider_quality').trigger('change');
						
					}else{console.log('else');
				//var sliedr4 = '<option value="good">good</option><option value="Bad" selected="selected">Bad</option>';									
						document.getElementById("quality_b").selected=true;							
						
						$("#qualityshow .ui-slider-label-a").css("width","0%");
						$("#qualityshow .ui-slider-label-b").css("width","100%");
					
						$('#slider_quality').trigger('change');
						}
					//$("#slider_ecn_ch").html(sliedr1);
					//$("#slider_eif_ch").html(sliedr2);
					//$("#slider_outlet").html(sliedr3);
					//$("#slider_quality").html(sliedr4);
				}
			}											 
			else{
				//return false;
				}
			//<---------------spinner------------------>
				
			tx.executeSql('SELECT chem_location FROM royce_chemist group by chem_location',[],function(tx,results){
						
				
				if(results.rows.length>0){
					for (var i = 0; i < results.rows.length; i++) {
						if(checkChemist == 'Yes')
						{
							if(jQuery.trim(ch_loc) == jQuery.trim(results.rows.item(i).chem_location))
							{
								location+='<option value="" selected="selected">'+jQuery.trim(results.rows.item(i).chem_location)+'</option>';	
								$("#ui-btn-textch5").html("<span class='ui-listview'>"+jQuery.trim(results.rows.item(i).chem_location)+"</span>");
							}
							else
							{
								location+='<option value="">'+jQuery.trim(results.rows.item(i).chem_location)+'</option>';
							}
						}
						else
						{
							location+='<option value="">'+jQuery.trim(results.rows.item(i).chem_location)+'</option>';	
						}
					}
					$('#edit_location_ch').html(location);																	  											
				}	
			},errorCB);
			
			if(checkChemist == 'Yes')
			{
				tx.executeSql('SELECT DISTINCT chem_name FROM royce_chemist where chem_location =" '+jQuery.trim(ch_loc)+' "', [],function(tx,results){
																																	
					namedoc = '<option value="">Select</option>';		
					if(results.rows.length > 0){console.log(results.rows.length);
						for (var i = 0; i < results.rows.length; i++) {
							if(checkChemist == 'Yes')
							{
								if(jQuery.trim(ch_name) == jQuery.trim(results.rows.item(i).chem_name))
								{
									namedoc+='<option value="" selected="selected">'+jQuery.trim(results.rows.item(i).chem_name)+'</option>';
									$("#ui-btn-textch6").html("<span class='ui-listview'>"+jQuery.trim(results.rows.item(i).chem_name)+"</span>");
								}
								else
								{
									namedoc+='<option value="">'+jQuery.trim(results.rows.item(i).chem_name)+'</option>';
								}
							}
							else
							{
								namedoc+='<option value="">'+jQuery.trim(results.rows.item(i).chem_name)+'</option>';
							}
						}
						$('#edit_name_ch').html(namedoc);
					}
				},errorCB);
			}
			else
			{
				$('#edit_name_ch').html(namedoc);
			}
			
			$('#edit_location_ch').change(function() {
			
				var getlocation=$('#edit_location_ch :selected').text();
				
				tx.executeSql('SELECT DISTINCT chem_name FROM royce_chemist where chem_location =" '+getlocation+' "',  [],function(tx,results){
																																	
					namedoc = '<option value="">Select</option>';		
					if(results.rows.length > 0){console.log(results.rows.length);
						for (var i = 0; i < results.rows.length; i++) {
							namedoc+='<option value="">'+jQuery.trim(results.rows.item(i).chem_name)+'</option>';
						}
						$('#edit_name_ch').html(namedoc);
					}
				},errorCB);
			});
		/*	tx.executeSql('SELECT * FROM royce_chemist_txt',  [],function(tx,results){
			
				var field_txt="";var sendName='';
				for (var i = 0; i < results.rows.length; i++) {
					sendName = "'"+jQuery.trim(results.rows.item(i).field_name)+"'";		
					field_txt+='<label class="ui-input-text">'+jQuery.trim(results.rows.item(i).field_name);
					field_txt+='</label>';
					field_txt+='<input type="text" id="ch_nxt_'+i+'" onkeyup="checkValidate_chemist('+sendName+', '+i+');" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					console.log("id=ch_nxt_"+i);
					
				}
				$('#add_nxt_field_ch').html(field_txt);
			},errorCB);*/
					
//<---------------end spinner------------------>		
/*f(window.localStorage.getItem('listkey')){
	tx.executeSql('SELECT * FROM chemist where chemist_id ="'+window.localStorage.getItem('listkey')+'" ',  [],function(tx,results){
		if(results.rows.length>0) {
	
			$('#ch_nxt_0').val(jQuery.trim(results.rows.item(0).nxt1));
			$('#ch_nxt_1').val(jQuery.trim(results.rows.item(0).nxt2));
			$('#ch_nxt_2').val(jQuery.trim(results.rows.item(0).nxt3));
			$('#ch_nxt_3').val(jQuery.trim(results.rows.item(0).nxt4));
		}
	});
	
}*//*else{
	tx.executeSql('SELECT * FROM royce_chemist_txt',  [],function(tx,results){
		for (var i = 0; i < results.rows.length; i++) {
	
			$('#ch_nxt_'+i+'').val(jQuery.trim(results.rows.item(i).feild_value));
			
		}*/
	
					
	},errorCB);
}



//<--------*********end chemist**************************************>

//<------------------pocket********************>

function updatePocketDetail(){
	
	//addExtraFieldfor_Pocket();	
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);								
	db.transaction(function(tx){
								
		tx.executeSql('SELECT * FROM pocket',  [], function(tx, results){

			var lenInf = results.rows.length;
									
			console.log(lenInf);
									
	 		//var output="<table id='abcd' cellpadding='0' cellspacing='0' style='font-size:14px; color:#ffffff;' width='100%'><thead><tr style='background-color:#B85008; font-weight:bold;'><td style='padding:10px; border:2px solid #ffffff; border-left:none;'>Name</td><td style='padding:10px; border:2px solid #ffffff;'>Location</td><td style='padding:10px; border:2px solid #ffffff; border-right:none;'>Date</td></tr></thead>";
			var output="<table id='abcd' cellpadding='0' cellspacing='0' style='font-size:14px; color:#ffffff;' width='100%'><thead><tr style='background-color:#B85008; font-weight:bold;'><td style='padding:10px; border:1px solid #ffffff; border-left:none;'>Name</td><td style='padding:10px; border:1px solid #ffffff; border-right:none;'>Date</td></tr></thead>";
			for (var i = 0; i < results.rows.length; i++) 
				{
				//output+="<tbody style='width=100%;'><tr><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-left:none; padding:10px;'><a href='#' onclick='getlistvaluefrmTableps("+results.rows.item(i).pocket_id+")'>"+results.rows.item(i). pocketsessionname+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; padding:10px;'><a href='#' onclick='getlistvaluefrmTableps("+results.rows.item(i).pocket_id+")'></a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-right:none; padding:10px;'><a href='#' onclick='getlistvaluefrmTableps("+results.rows.item(i).pocket_id+")'>"+results.rows.item(i).date+"</a></td></tr></tbody>";
				output+="<tbody style='width=100%;'><tr><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-left:none; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTableps("+results.rows.item(i).pocket_id+")'>"+results.rows.item(i). pocketsessionname+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-right:none; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTableps("+results.rows.item(i).pocket_id+")'>"+results.rows.item(i).date+"</a></td></tr></tbody>";
				}
				output+="</table>";
				
				changePage("listPage","slide");
			
				$('#Flist').html(output);
				
				//$('#add_Btn').hide();
				
				window.localStorage.setItem("ps_search",3);
				window.localStorage.removeItem("dv_search");
				window.localStorage.removeItem("cv_search");		
	 			window.localStorage.removeItem("pe_search");

				window.localStorage.removeItem("synch_pe");
				window.localStorage.removeItem("synch_cv");		
				window.localStorage.setItem("synch_pv",3);
				window.localStorage.removeItem("synch_dr");	
				
				$('#tableheader').html("Pocket List");

		}, errorCB);
	}, errorCB);
}


function getlistvaluefrmTableps(listkey){
		
			window.localStorage.setItem('listkey',listkey);
									
			//changePage("editPage_pocket","slide");
			
			$('#header_pv').text('Edit Pocket');
			
			showDataOnTablePocket();	
	}

function showDataOnTablePocket(){																								
	changePage("editPage_pocket","slide");
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);								

	db.transaction(function(tx){
		if(window.localStorage.getItem('listkey')){
			
			var listkey =window.localStorage.getItem('listkey');
		
			tx.executeSql('SELECT * FROM pocket where pocket_id =" '+listkey+' "',  [], updateTableSuccess, errorCB);
	
			function updateTableSuccess(tx, results){
					
					
					//var nm='<label class="ui-input-text" id="nm1">Name</label><input type="text" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" value="'+jQuery.trim(results.rows.item(0).pocketsessionname)+'" id="pct_name"/>';
					//$('#name_pct').html(nm);
					
					/*var loc='<label class="ui-input-text" id="location">Location</label><input type="text" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" value="'+jQuery.trim(results.rows.item(0).paramedicsession_location)+'" id="loc"/>';*/
					//$('#location_pp').html(loc);
					
			}
		}
		else{
				//return false;
			}
		
		tx.executeSql('SELECT * FROM royce_doc_txt',  [],function(tx,results){
			var field_txt="";var sendName='';
			/*for (var i = 0; i < results.rows.length; i++) {
					sendName = "'"+jQuery.trim(results.rows.item(i).field_name)+"'";		
					field_txt+='<label class="ui-input-text" id="pct_lbl_'+i+'">'+jQuery.trim(results.rows.item(i).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="pct_nxt_'+i+'" onkeyup="checkValidate_pocket('+sendName+', '+i+');" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					
						
				}*/
				if(results.rows.length >= 0){
					try{
						sendName =''// "'"+jQuery.trim(results.rows.item(i).field_name)+"'";		
					field_txt+='<label class="ui-input-text" id="pct_lbl_0">'+jQuery.trim(results.rows.item(0).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="pct_nxt_0" onkeyup="checkValidate_pocket();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					
					field_txt+='<label class="ui-input-text" id="pct_lbl_1">'+jQuery.trim(results.rows.item(1).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="pct_nxt_1" onkeyup="checkValidate_pocket();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';

					field_txt+='<label class="ui-input-text" id="pct_lbl_2">'+jQuery.trim(results.rows.item(2).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="pct_nxt_2" onkeyup="checkValidate_pocket();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';

					field_txt+='<label class="ui-input-text" id="pct_lbl_3">'+jQuery.trim(results.rows.item(3).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="pct_nxt_3" onkeyup="checkValidate_pocket();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';

					}catch(e){console.log(e);}
					
					}
			try{		
			$('#add_nxt_field_pct').html(field_txt);															 
			}catch(e){console.log(e);}

}, errorCB);
try{
tx.executeSql('SELECT * FROM royce_doc_txt',  [],function(tx,results){
					for(var i=0;i<results.rows.length;i++){													  
						if(parseInt(results.rows.item(i).feild_value) > 0){//alert(i);
							$('#pct_lbl_'+i).append('( ATP '+jQuery.trim(results.rows.item(i).feild_value)+')');
						}else{
								$('#pct_nxt_'+i).hide();
								$('#pct_lbl_'+i).hide();
								$('#pct_nxt_'+i+'').hide();
								$('#pct_lbl_'+i+'').hide();
								
						}
							
						}
});	
if(window.localStorage.getItem('listkey')){
	tx.executeSql('SELECT * FROM pocket where pocket_id ="'+window.localStorage.getItem('listkey')+'" ',  [],function(tx,results){
		if(results.rows.length>0) {
			
			$('#institute_nm').val(jQuery.trim(results.rows.item(0).pocketsessionname));
			
			$('#total_en').val(jQuery.trim(results.rows.item(0).totalenlistedhcpparticipants));
			
			$('#total_hcp').val(jQuery.trim(results.rows.item(0).totalhcpparticipants));
			
			$('#cost').val(jQuery.trim(results.rows.item(0).costoftheevent));
			
			$('#topic_nm').val(jQuery.trim(results.rows.item(0).cf_1156));
			
			$('#pct_nxt_0').val(jQuery.trim(results.rows.item(0).cf_1135));
			$('#pct_nxt_1').val(jQuery.trim(results.rows.item(0).cf_1136));
			$('#pct_nxt_2').val(jQuery.trim(results.rows.item(0).cf_1137));
			$('#pct_nxt_3').val(jQuery.trim(results.rows.item(0).cf_1138));
			
			previousValueHandal(results.rows.item(0).cf_1135,results.rows.item(0).cf_1136,results.rows.item(0).cf_1137,results.rows.item(0).cf_1138);
		}
	});
	
}else{previousValueHandal(0,0,0,0);}
}catch(e){console.log(e);}
			
	},errorCB);
   
}

//<----------------------end pocket********************>

//<----------------------paramedic********************>

function upadteParamedicDetail(){
		
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);					
		db.transaction(function(tx){
									
			tx.executeSql('SELECT * FROM paramedic',  [], function(tx, results){
	
				lenInf = results.rows.length;
									
				console.log(lenInf);
									
 				var output="<table id='abcd' cellpadding='0' cellspacing='0' style='font-size:14px; color:#ffffff;' width='100%'><thead><tr style='background-color:#B85008; font-weight:bold;'><td style='padding:10px; border:1px solid #ffffff; border-left:none;'>Name</td><td style='padding:10px; border:1px solid #ffffff;'>Location</td><td style='padding:10px; border:1px solid #ffffff; border-right:none;'>Date</td></tr></thead>";
				for (var i = 0; i < results.rows.length; i++) 
					{
					output+="<tbody style='width=100%;'><tr><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-left:none; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTablepe("+results.rows.item(i).paramedic_id+")'>"+results.rows.item(i).paramedicsessionname+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTablepe("+results.rows.item(i).paramedic_id+")'>"+results.rows.item(i).paramedicsession_location+"</a></td><td style='color:#0A10E1; background-color:#70A860;border:1px solid #ffffff; border-right:none; padding:10px;'><a href='#' class='aClass' onclick='getlistvaluefrmTablepe("+results.rows.item(i).paramedic_id+")'>"+results.rows.item(i).date+"</a></td></tr></tbody>";	
								
					}
					output+="</table>";
					
					changePage("listPage","slide");
					
					$('#Flist').html(output);
					
				//	$('#add_Btn').hide();
					
					window.localStorage.setItem("pe_search",4);
					window.localStorage.removeItem("dv_search");
				 	window.localStorage.removeItem("cv_search");		
					window.localStorage.removeItem("ps_search");	
					
					window.localStorage.removeItem("synch_dr");
					window.localStorage.removeItem("synch_pv");		
					window.localStorage.removeItem("synch_cv");
					window.localStorage.setItem('synch_pe',4);	
					$('#tableheader').html("Paramedic List");

					
			}, errorCB);		
	
		}, errorCB);
									
	

						
}

function getlistvaluefrmTablepe(listkey){
		
			window.localStorage.setItem('listkey',listkey);
			
			//changePage("editPage_paramedic","slide");
			
			$('#header_ps').text('Edit Paramedic');
			
			showDataOnTableParamedic();
}
 function showDataOnTableParamedic(){
	 changePage("editPage_paramedic","slide");
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);								

		db.transaction(function(tx){
			if(window.localStorage.getItem('listkey')){
			
				var listkey =window.localStorage.getItem('listkey');
					
				tx.executeSql('SELECT * FROM paramedic where paramedic_id =" '+listkey+' "',  [], updateTableSuccess, errorCB);
	
				function updateTableSuccess(tx, results){
					
					//var nm='<label class="ui-input-text" id="nmlbl">Name</label><input type="text" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" value="'+jQuery.trim(results.rows.item(0).paramedicsessionname)+'" id="ps_name"/>';
					//$('#name_ps').html(nm);
					
					//var loc='<label class="ui-input-text" id="location">Location</label><input type="text" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset" value="'+jQuery.trim(results.rows.item(0).paramedicsession_location)+'" id="ps_location"/>';
					//$('#location_ps').html(loc);
					
					//var tx=$('#nm').val();
					
				}
			}
			else{
				//return false;
				}
			tx.executeSql('SELECT * FROM royce_doc_txt',  [],function(tx,results){
				var field_txt="";var sendName='';
				/*for (var i = 0; i < results.rows.length; i++) {
					sendName = "'"+jQuery.trim(results.rows.item(i).field_name)+"'";		
					field_txt+='<label class="ui-input-text" id="ps_lbl_'+i+'">'+jQuery.trim(results.rows.item(i).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="ps_nxt_'+i+'" onkeyup="checkValidate_ps('+sendName+', '+i+');" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					
					
							
				}*/
				if(results.rows.length >=0){
					try{
						sendName =''// "'"+jQuery.trim(results.rows.item(i).field_name)+"'";		
					field_txt+='<label class="ui-input-text" id="ps_lbl_0">'+jQuery.trim(results.rows.item(0).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="ps_nxt_0" onkeyup="checkValidate_ps();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					
						
					field_txt+='<label class="ui-input-text" id="ps_lbl_1">'+jQuery.trim(results.rows.item(1).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="ps_nxt_1" onkeyup="checkValidate_ps();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					
					
					field_txt+='<label class="ui-input-text" id="ps_lbl_2">'+jQuery.trim(results.rows.item(2).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="ps_nxt_2" onkeyup="checkValidate_ps();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					
					
					field_txt+='<label class="ui-input-text" id="ps_lbl_3">'+jQuery.trim(results.rows.item(3).field_name);
					field_txt+='</label>';
					field_txt+='<input type="number" id="ps_nxt_3" onkeyup="checkValidate_ps();" class="input_text ui-input-text ui-body-c ui-corner-all ui-shadow-inset"/>';
					
					}catch(e){console.log(e);}	
					
					}
					try{
						$('#add_nxt_field_ps').html(field_txt);
					}catch(e){console.log(e);}
			});
try{
tx.executeSql('SELECT * FROM royce_doc_txt',  [],function(tx,results){
					for(var i=0;i<results.rows.length;i++){													  
						if(parseInt(results.rows.item(i).feild_value) > 0){//alert(i);
							$('#ps_lbl_'+i).append('( ATP '+jQuery.trim(results.rows.item(i).feild_value)+')');
						}else{
								console.log(results.rows.item(i).feild_value);							
								$('#ps_nxt_'+i).hide();
								$('#ps_lbl_'+i).hide();
								$('#ps_nxt_'+i+'').hide();
								$('#ps_lbl_'+i+'').hide();
								
						}
							
						}
});	
if(window.localStorage.getItem('listkey')){
	tx.executeSql('SELECT * FROM paramedic where paramedic_id ="'+window.localStorage.getItem('listkey')+'" ',  [],function(tx,results){
		if(results.rows.length > 0) {
			
			//$('#institute_nm_ps').val(jQuery.trim(results.rows.item(0).paramedicsession_institutename));
	var xy=document.getElementById("institute_nm_ps").value=jQuery.trim(results.rows.item(0).paramedicsession_institutename);
			console.log(xy);			
			
			$('#name_ps_txt').val(jQuery.trim(results.rows.item(0).paramedicsessionname));
			
			$('#location_ps_txt').val(jQuery.trim(results.rows.item(0).paramedicsession_location));
			
			
			$('#total_part').val(jQuery.trim(results.rows.item(0).totalparamedicparticipants));
			
			$('#cost_event').val(jQuery.trim(results.rows.item(0).costofevent));
			
		
			
			$('#ps_nxt_0').val(jQuery.trim(results.rows.item(0).cf_1139));
			$('#ps_nxt_1').val(jQuery.trim(results.rows.item(0).cf_1140));
			$('#ps_nxt_2').val(jQuery.trim(results.rows.item(0).cf_1141));
			$('#ps_nxt_3').val(jQuery.trim(results.rows.item(0).cf_1142));
			 
			 previousValueHandal(results.rows.item(0).cf_1139,results.rows.item(0).cf_1140,results.rows.item(0).cf_1141,results.rows.item(0).cf_1142);
		}
	});
	
}else{previousValueHandal(0,0,0,0);}
}catch(e){console.log(e);}	
				
		},errorCB);
}

//<----------------------end paramedic********************>

//<--------------UPDATE VALUE----------------------------->

//<---------------------selection for update----------->

function selectForUpdate(){
try{	
	 if(window.localStorage.getItem("dv_search")==1){
			//window.localStorage.removeItem("dv_search");			
			 updateDoc();	
		}
	if(window.localStorage.getItem("cv_search")==2){
			//window.localStorage.removeItem("cv_search");				
			 chemist();
	}
	if(window.localStorage.getItem("ps_search")==3){
			//window.localStorage.removeItem("ps_search");			
			pocket();
	}
	if(window.localStorage.getItem("pe_search")==4){
			//window.localStorage.removeItem("pe_search");			
			paramedic();
		
		}
	 
	 }catch(e){console.log(e);}
}
function addUser_All(){
try{	
	 $("#edit_location_doc").prop("disabled", false); 
			
	 $("#edit_name_doc").prop("disabled", false);
	 
	 $("#edit_location_ch").prop("disabled", false); 
			
	 $("#edit_name_ch").prop("disabled", false);
	 
	 if(window.localStorage.getItem("dv_search")==1){
			
			//document.getElementById("edit_location_doc").disabled=false;
			
			//document.getElementById("edit_name_doc").disabled=false;
			
			window.localStorage.removeItem('listkey');
			//window.localStorage.removeItem("dv_search");			
			//changePage("editPage_doctor","slide");
			
			$('#header_dr').text('Add Doctor');
			
			$('#edit_remark').val("");
		
			showDataOnTable('No');	
		}
	if(window.localStorage.getItem("cv_search")==2){
		 window.localStorage.removeItem('listkey');
			//window.localStorage.removeItem("cv_search");				
			// changePage("editPage_chemist","slide");
			
			$('#header_ch').text('Add Chemist');
			
			$('#edit_obqtycn').val("");
			
			$('#edit_obqtyif').val("");
			  
			 //document.getElementById("edit_location_ch").disabled=false;
		     //document.getElementById("edit_name_ch").disabled=false;
			 
			 showDataOnTableChemist('No');
	}
	if(window.localStorage.getItem("ps_search")==3){
		 window.localStorage.removeItem('listkey');
			//window.localStorage.removeItem("cv_search");				
			// changePage("editPage_pocket","slide");
			 $('#header_pv').text('Add pocket');
			 
			 $('#institute_nm').val("");
			 
			 $('#total_en').val("");
			 
			 $('#total_hcp').val("");
			 
			 $('#cost').val("");
			 
			 $('#topic_nm').val("");
			 
			 
			showDataOnTablePocket();
	}
	if(window.localStorage.getItem("pe_search")==4){
		 window.localStorage.removeItem('listkey');
			//window.localStorage.removeItem("cv_search");				
			// changePage("editPage_paramedic","slide");
			 $('#header_ps').text('Add paramedic');
			 
			 $('#institute_nm_ps').val("");
			 
			 $('#name_ps_txt').val("");
			 
			 $('#location_ps_txt').val("");
			 
			 $('#total_part').val("");
			
			 $('#cost_event').val("");
			 	
			 showDataOnTableParamedic();
	}
	
	}catch(e){console.log(e);}
}
//<---------------------end selection for update----------->
var l="";
var n="";
var cns="";
$(document).ready(function(){
	 	
	 			   
		l=$('#edit_location_doc :selected').text();						   
	$('#edit_location_doc').change(function() {
				
		l=$('#edit_location_doc :selected').text();
		
	 });
	n=$('#edit_name_doc :selected').text();
	$('#edit_name_doc').change(function() {
				
		n=$('#edit_name_doc :selected').text();
	 
	 });

	
});


function updateDoc(){
	
	var temp1="";
	var temp2="";
	var temp3="";
	var temp4="";
	var edit_ecn ="";								
	var edit_eif ="";
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);								

	db.transaction(populateDB, successStore);		
					
	function populateDB(tx) {
					   			
			listkey =window.localStorage.getItem('listkey');
									
			var access_Key = window.localStorage.getItem('accesskey');
			//var edit_location =$('#edit_location_doc').val();
			// edit_ecn =$('#slider_ecn_doc').val();								
			 //edit_eif =$('#slider_eif_doc').text();	
			
			var sel = document.getElementById('slider_ecn_doc');
       		var sv = sel.options[sel.selectedIndex].value;
       		console.log(sv);
			edit_ecn=sv; 
			
			var edit_remark =$('#edit_remark').val();	
										
			var sel1 = document.getElementById('slider_eif_doc');
       		var sv1 = sel.options[sel.selectedIndex].value;
       		console.log(sv1);
			edit_eif=sv1;							
										
			temp1 = $('#doc_nxt_0').val();
			temp2 = $('#doc_nxt_1').val();
			temp3 = $('#doc_nxt_2').val();
			temp4 = $('#doc_nxt_3').val();			

			var chk='';
			tx.executeSql('select * FROM doctor', [], function(tx, results){
				
				for(var i=0;i<results.rows.length;i++){
					if(jQuery.trim(n).toLowerCase()==jQuery.trim(results.rows.item(i).doctorvisitname).toLowerCase()){
						chk=chk+1;
						var mid=jQuery.trim(results.rows.item(i).doc_id);
						//alert(chk+" : " +n+ " :"+mid+" : "+listkey);
						//break;
					}
					else{
						chk=0;
						}
				}
				
				if(parseInt(listkey)==parseInt(mid) || chk==0){
					chk=0;//alert(mid+" : "+listkey);
				}else{chk=1;//alert(mid+" : "+listkey);
					}
			});
			
			
			
			if(listkey!=null){
				
				tx.executeSql('select * FROM doctor WHERE doc_id=" '+listkey+' "', [], function(tx, results){
					if(n==""){n=results.rows.item(0).doctorvisitname;}
					if(l==""){l=results.rows.item(0).doctorvisit_location;}
				if(results.rows.length>0){
					var f=0;
					tx.executeSql('select * FROM royce_doc_txt ', [], function(tx, results){
					try{														   
						if(parseInt(temp1) > parseInt(results.rows.item(0).feild_value) ){
							$('#doc_nxt_0').val(results.rows.item(0).feild_value);
							f=1;
						}
						if(parseInt(temp2) > parseInt(results.rows.item(1).feild_value) ){
							$('#doc_nxt_1').val(results.rows.item(1).feild_value);
							f=1;
						}
						if(parseInt(temp3) > parseInt(results.rows.item(2).feild_value) ){
						$('#doc_nxt_2').val(results.rows.item(2).feild_value);
						f=1;
						}
						if(parseInt(temp4) > parseInt(results.rows.item(3).feild_value) ){
							$('#doc_nxt_3').val(results.rows.item(3).feild_value);
							f=1;
						}
					}catch(e){console.log(e);}	
					
					
	
					});		
					if(f==0){
						if(chk ==0){
					 		console.log('doctorvisitname=" '+n+' ",doctorvisit_location=" '+l+'" ,doctorvisit_enlistingcn=" '+ edit_ecn+' " ,doctorvisit_enlistingif=" '+edit_eif+' " ,remarks=" '+($('#edit_remark').val())+' ",cf_1063=" '+todaydt+' ",ModifiedTime=" '+mycurrentTime+' ",mark="yes",cf_1167="Updated from Mobile" WHERE doc_id=" '+listkey+' " ');
							
							tx.executeSql('UPDATE doctor  SET  doctorvisitname=" '+n+' ",doctorvisit_location=" '+l+' " ,doctorvisit_enlistingcn=" '+ edit_ecn+' " ,doctorvisit_enlistingif=" '+edit_eif+' " ,remarks=" '+($('#edit_remark').val())+' ",ModifiedTime=" '+mycurrentTime+' ",mark="yes",cf_1127="'+temp1+'",cf_1128="'+temp2+'",cf_1129="'+temp3+'",cf_1130="'+temp4+'",cf_1064="'+mytime+'",cf_1167="Updated from Mobile" WHERE doc_id=" '+listkey+' " ');		
							window.localStorage.removeItem('listkey');					
							toast("Updated successfully");
							markitingMenupulate(temp1,temp2,temp3,temp4);
							UpdateDoctorInfo();
							//changePage('menuPage');
						}else{toast('Name already Exist');}
					}else{
						toast('check value not greater then Displayed value');
					}
				}
			});	
		}//listkey
		else{
			
			var f=0;
			tx.executeSql('select * FROM royce_doc_txt ', [], function(tx, results){
			try{														   
				if(parseInt(temp1) > parseInt(results.rows.item(0).feild_value) ){
					$('#doc_nxt_0').val(results.rows.item(0).feild_value);
					f=1;
					}
				if(parseInt(temp2) > parseInt(results.rows.item(1).feild_value) ){
					$('#doc_nxt_1').val(results.rows.item(1).feild_value);
					f=1;
					}
				if(parseInt(temp3) > parseInt(results.rows.item(2).feild_value) ){
					$('#doc_nxt_2').val(results.rows.item(2).feild_value);
					f=1;
					}
				if(parseInt(temp4) > parseInt(results.rows.item(3).feild_value) ){
					$('#doc_nxt_3').val(results.rows.item(3).feild_value);
					f=1;
					}
			}catch(e){console.log(e);}		
	
			});
			if(f==0){
				console.log(" insrt");
				
				var user_Id = window.localStorage.getItem('userid_store');
				
				if(chk==0){
					if(n!="" && l!=""){
					tx.executeSql('INSERT INTO doctor (accesskey, doctorvisitautono, doctorvisitname, doctorvisit_location, doctorvisit_enlistingcn, doctorvisit_enlistingif, remarks, user_id, createdtime, ModifiedTime, cf_1063, cf_1064, cf_1127,cf_1128,cf_1129,cf_1130,id,mark,cf_1167) VALUES (" '+access_Key+' ","", " '+n+' " ,  " '+l+' " ,  " '+edit_ecn+' " ,  " '+edit_eif+' ",  " '+edit_remark+' " ,"'+user_Id+'"," '+mycurrentTime+' " , " '+mycurrentTime+' ","'+todaydt+'","'+mytime+'"," '+temp1+' ", " '+temp2+' ", " '+temp3+' ","'+temp4+'","","yes","Added from Mobile")');							
					toast("New Record Added successfully");
					markitingMenupulate(temp1,temp2,temp3,temp4);
					UpdateDoctorInfo();
					}else{toast("Please enter Name Location");}
					//changePage('menuPage');
				}else{toast('Name already Exist');}
			}
			else{toast('check value not greater the Displayed value');
			}	
			
		}
	}
	
}

	
//<----------------end Doctor------------------------>
var edit_loc="";
var edit_name="";
$(document).ready(function(){
  
	edit_loc=$('#edit_location_ch :selected').text();					   
$('#edit_location_ch').change(function() {
			
 	edit_loc=$('#edit_location_ch :selected').text();
	
 });
edit_name=$('#edit_name_ch :selected').text();
$('#edit_name_ch').change(function() {
			
 	edit_name=$('#edit_name_ch :selected').text();
 
 });
});

function chemist(){

	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);								
		
	db.transaction(populateDB, successStore);		
					
	function populateDB(tx) {
		//tx.executeSql('DROP TABLE IF EXISTS doctor');
		listk =window.localStorage.getItem('listkey');
						
		access_Key = window.localStorage.getItem('accesskey');
		
		 //=$('#edit_location_ch :selected').text();
		edit_ecn =$('#slider_ecn_ch').val();								
		edit_eif =$('#slider_eif_ch').val();													
		//edit_name = $('#edit_name_ch :selected').text();
		
		
		var quality =$('#slider_quality').val();
		
		var outlet= $('#slider_outlet').val();
		
		var qty_cn =$('#edit_obqtycn').val();													
		
		var qty_if= $('#edit_obqtyif').val();
		
		var chk='';
		tx.executeSql('select * FROM chemist', [], function(tx, results){
			for(var i=0;i<results.rows.length;i++){
				if(jQuery.trim(edit_name).toLowerCase()==jQuery.trim(results.rows.item(i).cf_1060).toLowerCase()){
					chk=chk+1;
					var mid=jQuery.trim(results.rows.item(i).chemist_id);
					break;
				}
				else{
					chk=0;
					}
			}
			if(parseInt(listk)==parseInt(mid) || chk==0){
				chk=0;//alert(mid+" : "+listkey);
			}else{chk=1;//alert(mid+" : "+listkey);
				}
		}); 
		if(listk!=null){
			
			tx.executeSql('select * FROM chemist WHERE chemist_id=" '+listk+' "', [], function(tx, results){
				
				if(chk==0){
					if(edit_name==""){edit_name=results.rows.item(0).cf_1060;}
					if(edit_loc==""){edit_loc=results.rows.item(0).chemistvisit_chemistvisitname;}
					tx.executeSql('UPDATE chemist  SET  chemistvisit_chemistvisitname="'+edit_loc +'",cf_1060="'+edit_name+'",chemistvisit_availabilityofcn="'+edit_ecn+'" ,chemistvisit_availabilityofif="'+edit_eif+'",obqtycn="'+qty_cn+'", obqtyif="'+qty_if+'",createdtime="'+mycurrentTime+'", ModifiedTime="'+mycurrentTime+'",cf_1125="'+outlet+'",cf_1126="'+quality+'", mark="yes",cf_1062="'+mytime+'",cf_1166="Updated from Mobile" WHERE chemist_id="'+listk+'" ');	
					toast("Updated successfully");
					window.localStorage.removeItem('listkey');
					UpdateChemistInfo();
					//changePage('menuPage');	
				}else{toast('Name Already Exist');}
			});
			  
		}//end if list
		else{
			
			console.log("insert");
			
			var user_Id=window.localStorage.getItem('userid_store');
			if(chk==0){
				if(edit_name!="" && edit_loc!=""){
				tx.executeSql('INSERT INTO chemist (accesskey, chemistvisitautono, chemistvisit_chemistvisitname,  chemistvisit_availabilityofcn, chemistvisit_availabilityofif, obqtycn, obqtyif,  user_id, createdtime, ModifiedTime, cf_1060, cf_1061, cf_1062,cf_1125,cf_1126, id , nxt1 ,nxt2 , nxt3 , nxt4,mark,cf_1166) VALUES ("'+access_Key+'","","'+edit_loc+'" , "'+edit_ecn+'" ,  "'+edit_eif+'","'+qty_cn+'","'+qty_if+'","'+user_Id+'","'+mycurrentTime+'" , "'+mycurrentTime+'","'+edit_name+'","'+todaydt+'","'+mytime+'","'+outlet+'","'+quality+'","", "", "", "","","yes","Added from Mobile")');
				toast("New Record Added successfully");
				UpdateChemistInfo();
				}else{toast("Please enter Name and Location");}
				//changePage('menuPage');
			}else{toast('Name Already Exist');}
			
		}																					 
  
	}
}
//<-------------------------end Chemist------------------------->
function pocket(){
	var temp1="";
	var temp2="";
	var temp3="";
	var temp4="";
	var flg=0;
	
	edit_location_txt =$('#location_pv_txt').val();
	
	//edit_name =$('#name_pv_txt').val();	
	
	edit_name=$('#institute_nm').val();
			
	var total_en=$('#total_en').val();
			
	var total_hcp=$('#total_hcp').val();
			
	var cost=$('#cost').val();
			
	var topic=$('#topic_nm').val();
	//edit_eif =$("#slider_eif_doc:selected").val();													
	//edit_name = $('#pct_name').val();						
																							
	temp1 = $('#pct_nxt_0').val();
	temp2 = $('#pct_nxt_1').val();
	temp3 = $('#pct_nxt_2').val();
	temp4 = $('#pct_nxt_3').val();
	 
	var chk="";		
	
	if(flg==0){
	
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);								
		
		db.transaction(populateDB, successStore);		
					
		function populateDB(tx) {
			//tx.executeSql('DROP TABLE IF EXISTS doctor');
			listkey =window.localStorage.getItem('listkey');
							
			access_Key = window.localStorage.getItem('accesskey');
			
			tx.executeSql('select * FROM pocket', [], function(tx, results){
				for(var i=0;i<results.rows.length;i++){
					if(jQuery.trim(edit_name).toLowerCase()==jQuery.trim(results.rows.item(i).pocketsessionname).toLowerCase()){
						chk=chk+1;
						var mid=jQuery.trim(results.rows.item(i).pocket_id);
						break;
					}
					else{
						chk=0;
					}
				}
				if(parseInt(listkey)==parseInt(mid) || chk==0){
					chk=0;//alert(mid+" : "+listkey);
				}else{chk=1;//alert(mid+" : "+listkey);
				}
			});		
			
			if(listkey!=null){//alert(window.localStorage.getItem('listkey'));
				tx.executeSql('select * FROM pocket WHERE pocket_id=" '+listkey+' "', [], function(tx, results){

						var f=0;
						tx.executeSql('select * FROM royce_doc_txt ', [], function(tx, results){
							try{														   
								if(parseInt(temp1) > parseInt(results.rows.item(0).feild_value) ){
									$('#pct_nxt_0').val(results.rows.item(0).feild_value);
									f=1;
								}
								if(parseInt(temp2) > parseInt(results.rows.item(1).feild_value) ){
									$('#pct_nxt_1').val(results.rows.item(1).feild_value);
									f=1;
								}
								if(parseInt(temp3) > parseInt(results.rows.item(2).feild_value) ){
									$('#pct_nxt_2').val(results.rows.item(2).feild_value);
									f=1;
								}
								if(parseInt(temp4) > parseInt(results.rows.item(3).feild_value) ){
									$('#pct_nxt_3').val(results.rows.item(3).feild_value);
									f=1;
								}
							}catch(e){console.log(e);}		
	
						});
						if(f==0){
							if(chk==0){
								tx.executeSql('UPDATE pocket  SET  pocketsessionname="'+edit_name+'",ModifiedTime="'+mycurrentTime+'",mark="yes",cf_1135="'+temp1+'",cf_1136="'+temp2+'",cf_1137="'+temp3+'",cf_1138="'+temp4+'",totalhcpparticipants="'+total_hcp+'",totalenlistedhcpparticipants="'+total_en+'",costoftheevent="'+cost+'",cf_1156="'+topic+'",mark="yes",cf_1165="Updated from Mobile",cf_1090="'+mytime+'" where pocket_id= "'+listkey+'"');
								toast("Updated successfully");
								window.localStorage.removeItem('listkey');	
								markitingMenupulate(temp1,temp2,temp3,temp4);
								updatePocketDetail();
								//changePage('menuPage_cme');	
							}else{toast('Name Already Exist');}
						}
					
			
				});	
			}else{var user_Id=window.localStorage.getItem('userid_store');
				if(chk==0){
					if(edit_name!=""){
					tx.executeSql('INSERT INTO pocket (accesskey, pocketsessionautono, pocketsessionname, date, totalhcpparticipants, totalenlistedhcpparticipants, costoftheevent, user_id, createdtime, ModifiedTime, cf_1090, id,cf_1135,cf_1136,cf_1137,cf_1138,cf_1156,mark,cf_1165) VALUES (" '+access_Key+' ","" , " '+edit_name+' " ,  " '+todaydt+' " ,"'+total_hcp+'" ,  "'+total_en+'", "'+cost+'" ,  "'+user_Id+'", " '+mycurrentTime+' " , " '+mycurrentTime+' ", "'+mytime+'","","'+temp1+'","'+temp2+'","'+temp3+'","'+temp4+'","'+topic+'","yes","Added from Mobile")');
					toast("New Record Added successfully");
					markitingMenupulate(temp1,temp2,temp3,temp4);
					updatePocketDetail();
					}else{toast("Enter Pocket Session Name");}
					//changePage('menuPage_cme');
				}else{toast("Name already exist");}
			}
  																								 
		}
	}
}

//<----------------------end POCKET----------------------->

function paramedic(){

	var temp1="";
	var temp2="";
	var temp3="";
	var temp4="";
	var flg=0;
	
	var edit_name = $('#name_ps_txt').val();						
	var edit_loc = $('#location_ps_txt').val();
				
	var ins_nm=$('#institute_nm_ps').val();
			
	var total_prt=$('#total_part').val();
			
	var coe=$('#cost_event').val();
			
	
																							
	temp1 = $('#ps_nxt_0').val();
	temp2 = $('#ps_nxt_1').val();
	temp3 = $('#ps_nxt_2').val();
	temp4 = $('#ps_nxt_3').val();
	
	if(flg==0){	
		
		var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);								

		db.transaction(populateDB, successStore);		
					
		function populateDB(tx) {
			
			listkey =window.localStorage.getItem('listkey');
							
			access_Key = window.localStorage.getItem('accesskey');
		
			var chk="";
			
			tx.executeSql('select * FROM paramedic', [], function(tx, results){
				
				for(var i=0;i<results.rows.length;i++){
					if(jQuery.trim(edit_name).toLowerCase()==jQuery.trim(results.rows.item(i).paramedicsessionname).toLowerCase()){
						chk=chk+1;
						var mid=jQuery.trim(results.rows.item(i).paramedic_id);
						break;
					}else{
						chk=0;
					}
				}
				if(parseInt(listkey)==parseInt(mid) || chk==0){
					chk=0;//alert(mid+" : "+listkey);
				}else{chk=1;//alert(mid+" : "+listkey);
				}			
			});	
										
			if(listkey!=null){
				
				tx.executeSql('select * FROM paramedic WHERE paramedic_id=" '+listkey+' "', [], function(tx, results){

				window.localStorage.removeItem('listkey');	

				if(results.rows.length>0){
				
					var f=0;
					
					tx.executeSql('select * FROM royce_doc_txt ', [], function(tx, results){
						try{														   
							if(parseInt(temp1) > parseInt(results.rows.item(0).feild_value) ){
								$('#ps_nxt_0').val(results.rows.item(0).feild_value);
								f=1;
							}
							if(parseInt(temp2) > parseInt(results.rows.item(1).feild_value) ){
								$('#ps_nxt_1').val(results.rows.item(1).feild_value);
								f=1;
								}
							if(parseInt(temp3) > parseInt(results.rows.item(2).feild_value) ){
								$('#ps_nxt_2').val(results.rows.item(2).feild_value);
								f=1;
								}
							if(parseInt(temp4) > parseInt(results.rows.item(3).feild_value) ){
								$('#ps_nxt_3').val(results.rows.item(3).feild_value);
								f=1;
								}
						}catch(e){console.log(e);}			
					});
					
					if(f==0){												
						
						if(chk ==0){											
							
							tx.executeSql('UPDATE paramedic  SET  paramedicsessionname="'+edit_name+'",ModifiedTime="'+mycurrentTime+'", paramedicsession_location="'+edit_loc+'", mark="yes",cf_1139="'+temp1+'",cf_1140="'+temp2+'",cf_1141="'+temp3+'",cf_1142="'+temp4+'",paramedicsession_institutename="'+ins_nm+'",totalparamedicparticipants="'+total_prt+'",costofevent="'+coe+'",mark="yes",cf_1164="Updated from Mobile",cf_1091="'+mytime+'"  where paramedic_id = "'+listkey+'"');					
							toast("Updated successfully");
							markitingMenupulate(temp1,temp2,temp3,temp4);
							upadteParamedicDetail();
							//changePage('menuPage_cme');
							
						}else{toast('Name Already Exist');}
					}
				}			
			});				
		}else{
			
			var user_Id=window.localStorage.getItem('userid_store');
			
			if(chk==0){
				if(edit_name!=""){
				tx.executeSql('INSERT INTO paramedic (accesskey, paramedicsessionautono, paramedicsessionname, date, paramedicsession_location, paramedicsession_institutename, totalparamedicparticipants, costofevent, user_id, createdtime, ModifiedTime, cf_1091, id,cf_1139,cf_1140,cf_1141,cf_1142,mark,cf_1164) VALUES (" '+access_Key+' ","" , " '+edit_name+' " ," '+todaydt+' " ,  " '+edit_loc+' " ,  "'+ins_nm+'",  "'+total_prt+'" ,  "'+coe+'" , "'+user_Id+'" , " '+mycurrentTime+' " ," '+mycurrentTime+'","'+mytime+'","","'+temp1+'","'+temp2+'","'+temp3+'","'+temp4+'","yes","Added from Mobile")');
				toast("New Record Added successfully");
				markitingMenupulate(temp1,temp2,temp3,temp4);
				upadteParamedicDetail();
				//changePage('menuPage_cme');
				}else{toast("Enter Paramedic Session Name");}
			}else{toast('Name already exist');}
		}
	
	}
  }
}


//<------LogOut------------------------------------------------>

function logOut(){
	
	window.localStorage.clear();
	
	$('#login').val("");
	
	$('#pass').val("");
	
	
	var backlen = history.length;    
	
	history.go(-backlen);
	
	changePage("loginPage","slide");
	
	toast('Logout successfully');
	
		
}
	
//<------------------------Chemist------------------------>
function addExtraFieldSpinner(){
	console.log("spinner");

var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {			 	
	
	var unm=window.localStorage.getItem("user_name");
	var db = window.openDatabase("Database","1.0","ROYCEDB",2000000);
	$.ajax({
		  url:'http://203.109.109.190:1469/royce3/roycerest/mjallpicklist.php?module=chemistvisit&user=5007456',
		  type:'POST',
    	  dataType:'jsonp',
          jsonp:'callback',
          success: function(data)
			{
				var a=data.message;
				var rs=a.result;
				
				console.log(rs.length);//3=max 
			
				var str=rs[0].pickvalue;
				
				var strChemist = new Array();

				var strChemist = str.split(",");
			//<****************************************> value	
				var strValue = new Array();
				
				for(var i=0;i<strChemist.length;i++){		
				
					strValue[i] = strChemist[i].split("___");

				}
	db.transaction(function(tx){
				tx.executeSql('DROP TABLE IF EXISTS royce_chemist');			
				tx.executeSql('CREATE TABLE IF NOT EXISTS royce_chemist(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, chem_name TEXT NULL, chem_location TEXT NULL)');
			var name = new Array();
			var loc =new Array();
			console.log(strValue.length);
				for(var i=0;i<strValue.length;i++){
					var yes = strValue[i]; 
					
					var ok = String(yes).split(",");
					

					tx.executeSql('INSERT INTO royce_chemist(chem_name,chem_location) VALUES(" '+ok[0]+' ", " '+ok[1]+' ")');
							
					}
	//<--------------txt Field Extra---------------------------->
			
				var str1 = rs[1].pickvalue;
				
				var strChemist1 = new Array();

				var strChemist1 = str1.split(",");
			//<****************************************> value	
				var strValue1 = new Array();
				
				for(var i=0;i<strChemist1.length;i++)
				{		
					
					strValue1[i] = strChemist1[i].split("___");

				}
				
				db.transaction(function(tx)
				{			tx.executeSql('DROP TABLE IF EXISTS royce_chemist_txt');
							tx.executeSql('CREATE TABLE IF NOT EXISTS royce_chemist_txt(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, field_name TEXT NULL, feild_value TEXT NULL)');
						var name = new Array();
						var loc =new Array();
						console.log(strValue1.length);
							for(var i=0;i<strValue1.length;i++){
								var yes = strValue1[i]; 
								
								var ok = String(yes).split(",");
								
								var s=parseInt(ok[1]);
									if(s > 0){
								tx.executeSql('INSERT INTO royce_chemist_txt(field_name,feild_value) VALUES(" '+ok[0]+' ", " '+ok[1]+' ")');				
									}
										
								}
								
				});	
		
	
	//<----endtxt---------------------------------------->				
			});				
	    									
			},error: function(e){
				console.log("error"+e);
			}	
	});
  }else{//toast("Unable to get Location and Name please check Network");
  }

}

//<-----------end chamist--------------------------->
/*function addExtraFieldfor_Pocket(){
	
	var unm=window.localStorage.getItem("user_name");
	var db = window.openDatabase("Database","1.0","ROYCEDB",2000000);
	$.ajax({
		  url:'http://203.109.109.190:1469/royce3/roycerest/mjallpicklist.php?module=PocketSession&user='+unm,
		  type:'POST',
    	  dataType:'jsonp',
          jsonp:'callback',
          success: function(data)
			{
				var a=data.message;
				var rs=a.result;
				
				console.log(rs.length);//3=max 
				
				var str1 = rs[1].pickvalue;
				
				var strPocket1 = new Array();

				var strPocket1 = str1.split(",");
			//<****************************************> value	
				var strValue1 = new Array();
				
				for(var i=0;i<strPocket1.length;i++)
					{		
					
					strValue1[i] = strPocket1[i].split("___");
			
					}
				
				db.transaction(function(tx)
				{			tx.executeSql('DROP TABLE IF EXISTS royce_pocket');
							tx.executeSql('CREATE TABLE IF NOT EXISTS royce_pocket(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, field_name TEXT NULL, feild_value TEXT NULL)');
						var name = new Array();
						var loc =new Array();
						console.log(strValue1.length);
							for(var i=0;i<strValue1.length;i++){
								var yes = strValue1[i]; 
								
								var ok = String(yes).split(",");
								
								var s=parseInt(ok[1]);
								
								if(s > 0)
									{
								tx.executeSql('INSERT INTO royce_pocket(field_name,feild_value) VALUES(" '+ok[0]+' ", " '+ok[1]+' ")');
									}
								}
								
				});	

	    									
			},error: function(e)
				{
				console.log("error"+e);
				}	
	});
}*/
/****************************doctor spinner********/


function addExtra_doc_Spinner(){
var checkNetConnection = checkNetwork();

if(checkNetConnection == true)
   {			 	
	
	var unm=window.localStorage.getItem("user_name");
	var db = window.openDatabase("Database","1.0","ROYCEDB",2000000);
	$.ajax({
		  url:'http://203.109.109.190:1469/royce3/roycerest/mjallpicklist.php?module=DoctorVisit&user='+unm,
		  type:'POST',
    	  dataType:'jsonp',
          jsonp:'callback',
          success: function(data)
			{
				var a=data.message;
				var rs=a.result;
				
				console.log(rs.length);//3=max
				
				if(rs[0].pickvalue==null){
					console.log("rs[0].pickvalue"+rs[0].pickvalue);
					}
			else{
					var str=rs[0].pickvalue;
				}
				var strdoc = new Array();

				var strdoc = str.split(",");
			//<****************************************> value	
				var strValue = new Array();
				
				for(var i=0;i<strdoc.length;i++){		
				
					strValue[i] = strdoc[i].split("___");

				}
	db.transaction(function(tx){
				tx.executeSql('DROP TABLE IF EXISTS royce_doctor');
				tx.executeSql('DROP TABLE IF EXISTS royce_doc_txt');
				tx.executeSql('CREATE TABLE IF NOT EXISTS royce_doctor(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, doc_name TEXT NULL, doc_location TEXT NULL)');
			console.log(strValue.length);
				for(var i=0;i<strValue.length;i++){
					var yes = strValue[i]; 
					
					var ok = String(yes).split(",");
					

					tx.executeSql('INSERT INTO royce_doctor(doc_name,doc_location) VALUES(" '+ok[0]+' ", " '+ok[1]+' ")');
							
					}
	/*********************************************************/		
				var str1 = rs[1].pickvalue;
				
				var strdoc1 = new Array();

				var strdoc1 = str1.split(",");
			//<****************************************> value	
				var strValue1 = new Array();
				
				for(var i=0;i<strdoc1.length;i++)
				{		
					
					strValue1[i] = strdoc1[i].split("___");

				}
				
				db.transaction(function(tx)
				{			//tx.executeSql('DROP TABLE IF EXISTS royce_doc_txt');
							tx.executeSql('CREATE TABLE IF NOT EXISTS royce_doc_txt(tbl_id INTEGER PRIMARY KEY AUTOINCREMENT, field_name TEXT NULL, feild_value TEXT NULL)');
						
						console.log(strValue1.length);
							for(var i=0;i<strValue1.length;i++){
								var yes = strValue1[i]; 
								
								var ok = String(yes).split(",");
								
								var s=parseInt(ok[1]);
								
								
								tx.executeSql('INSERT INTO royce_doc_txt(field_name,feild_value) VALUES(" '+ok[0]+' ", " '+ok[1]+' ")');	
								
									
								}
								
				});	
		
					
			});				
	    									
			},error: function(e){
				console.log("error"+e);
			}	
	});
   }else{toast("Unable to get Location and Name please check Network");}

}
/********************end**************************************/
function checkValidate()
{	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	//alert('textId = '+textId);
	var temp1 =$('#doc_nxt_0').val();
	var temp2 =$('#doc_nxt_1').val();
	var temp3 =$('#doc_nxt_2').val();
	var temp4 =$('#doc_nxt_3').val();

	db.transaction(function(tx){
	
		tx.executeSql('select * FROM royce_doc_txt ', [], function(tx, results){
			try{						
				if(parseInt(temp1) > parseInt(results.rows.item(0).feild_value) ){
					$('#doc_nxt_0').val(jQuery.trim(results.rows.item(0).feild_value));
					toast('maximum value '+results.rows.item(0).feild_value);
				 $(this).focusout();
				}
				
				if(parseInt(temp2) > parseInt(results.rows.item(1).feild_value) ){
					$('#doc_nxt_1').val(jQuery.trim(results.rows.item(1).feild_value));
					toast('maximum value '+results.rows.item(1).feild_value);
				 $(this).focusout();
				}
				
				if(parseInt(temp3) > parseInt(results.rows.item(2).feild_value) ){
					$('#doc_nxt_2').val(jQuery.trim(results.rows.item(2).feild_value));
					toast('maximum value '+results.rows.item(2).feild_value);
				 $(this).focusout();
				}
				
				if(parseInt(temp4) > parseInt(results.rows.item(3).feild_value) ){
					$('#doc_nxt_3').val(jQuery.trim(results.rows.item(3).feild_value));
					toast('maximum value '+results.rows.item(3).feild_value);
				 $(this).focusout();
				}
				
			}catch(e){console.log(e);}		
	
			});
		});

}

function checkValidate_pocket()
{	var temp1="";
	var temp2="";
	var temp3="";
	var temp4="";
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
	temp1 =$('#pct_nxt_0').val();
	temp2 =$('#pct_nxt_1').val();
	temp3 =$('#pct_nxt_2').val();
	temp4 =$('#pct_nxt_3').val();
	
	db.transaction(function(tx){
	
		tx.executeSql('select * FROM royce_doc_txt ', [], function(tx, results){
			try{
								
				if(parseInt(temp1) > parseInt(results.rows.item(0).feild_value) ){
					toast('maximum value '+results.rows.item(0).feild_value);
					$('#pct_nxt_0').val(jQuery.trim(results.rows.item(0).feild_value));
					 $(this).focusout();
				}
		
				if(parseInt(temp2) > parseInt(results.rows.item(1).feild_value) ){
					toast('maximum value '+results.rows.item(1).feild_value);
					$('#pct_nxt_1').val(jQuery.trim(results.rows.item(1).feild_value));
					 $(this).focusout();
				}		
				
				if(parseInt(temp3) > parseInt(results.rows.item(2).feild_value) ){
					toast('maximum value '+results.rows.item(2).feild_value);
					$('#pct_nxt_2').val(jQuery.trim(results.rows.item(2).feild_value));
					 $(this).focusout();
				}
				
				
				if(parseInt(temp4) > parseInt(results.rows.item(3).feild_value) ){
					toast('maximum value '+results.rows.item(3).feild_value);
					$('#pct_nxt_3').val(jQuery.trim(results.rows.item(3).feild_value));
					 $(this).focusout();
				}
				
			}catch(e){console.log(e);}		
	
			});
		});
}
function checkValidate_ps()
{	var temp1="";
	var temp2="";
	var temp3="";
	var temp4="";
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
	 temp1 =$('#ps_nxt_0').val();
	 temp2 =$('#ps_nxt_1').val();
	 temp3 =$('#ps_nxt_2').val();
	 temp4 =$('#ps_nxt_3').val();
	
	db.transaction(function(tx){
	
		tx.executeSql('select * FROM royce_doc_txt ', [], function(tx, results){
			try{
								
				if(parseInt(temp1) > parseInt(results.rows.item(0).feild_value) ){
					toast('maximum value '+results.rows.item(0).feild_value);
					$('#ps_nxt_0').val(jQuery.trim(results.rows.item(0).feild_value));
					 $(this).focusout();
				}				
			
				if(parseInt(temp2) > parseInt(results.rows.item(1).feild_value) ){
					toast('maximum value '+results.rows.item(1).feild_value);
					$('#ps_nxt_1').val(jQuery.trim(results.rows.item(1).feild_value));
					 $(this).focusout();
				}
								
				if(parseInt(temp3) > parseInt(results.rows.item(2).feild_value) ){
					toast('maximum value '+results.rows.item(2).feild_value);
					$('#ps_nxt_2').val(jQuery.trim(results.rows.item(2).feild_value));
					 $(this).focusout();
				}
				
				if(parseInt(temp4) > parseInt(results.rows.item(3).feild_value) ){
					toast('maximum value '+results.rows.item(3).feild_value);
					$('#ps_nxt_3').val(jQuery.trim(results.rows.item(3).feild_value));
					 $(this).focusout();
				}
				
			}catch(e){console.log(e);}		
	
			});
		});

}

/**********************************************************************************************

registration 

************************************************************************************************/
function registration(unm,access_Key){
	
	var imei_no="";
	
	window.plugins.imei.get(function(imei) {

			imei_no=imei;
			
			console.log(imei_no+"device id :"+imei);							  
				   
		 
	 }, function(e) {
			console.log("fail"+e);
  	});
	

	var pinno = randomNumber();
window.localStorage.setItem('pin',pinno);
window.localStorage.setItem('iemi',imei_no);
var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);
	if(checkNetConnection == true)
    {
	$.ajax({
			url:sessionId+'user='+unm+'&akey='+access_Key,
			type:'POST',
    		dataType:'jsonp',
            jsonp:'callback',
            success: function(data)
			{
				var response=data.message;
				
				var success = response.success;
					
				var rs =response.result;
				
				var session_ID = rs.sessionName;
						
				var user_Id = rs.userId;
				
				var reg='http://203.109.109.190:1469/royce3/roycerest/syncmodel.php?sessid='+session_ID+'&module=MobileRegistration&data=[{"mobileregistrationname":"'+unm+'","pinnumber":"'+pinno+'","registrationdate":"'+todaydt+'","time":"'+mytime+'","vtiger_mobileregistration_activestatus":"No","mobileapkversion":"Android App Ver 1.0","assigned_user_id":"'+user_Id+'","CreatedTime":"'+mycurrentTime+'","ModifiedTime":"'+mycurrentTime+'","cf_1157":"","cf_1158":"'+imei_no+'","mode":"RS"}]';
console.log(reg);
				$.ajax({
						url:reg,
						type:'post',
						dataType:'jsonp',
						jsonp:'callback',
						beforeSend: function(){
							//alert("before");
							
							getUserDB();
					
							//loaderStart();
						},						
			
						complete: function(){
							//alert("complete");
							$.unblockUI();
							//loaderStop();
						},
						success: function(data)
						{
							resp=data.message;
				
							succ = resp.success;
							
							if(succ){
																	
									getUserDB();
									
									//toast('Register Successfilly');
									alert('Register Successfilly');
									
									changePage("Pin_Varificationpage","slide");
									
							}else{toast('Registration Fail');}
							
						},error:function(e){toast("Mobile registration failed");}
					});
				
				
			},error:function()
				 {
				//alert('Error Check Connection');
				  }
		});
	}else{toast('Check Network');}
}

function pinverification(){
try{
	var pinv="";
	var pass="";
	var unm="";
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);
	
	var unm=$('#pin_user').val();
	
	var pass=$('#pin_pass').val();
	
	var pinv=$('#pin_code').val();
	
	console.log(unm+":"+pass+" : "+pinv);
	
	db.transaction(function(tx){
	
		tx.executeSql('select * FROM login ', [], function(tx, results){
			
			if(results.rows.length > 0){
				
				if(jQuery.trim(results.rows.item(0).pinvalid).toLowerCase()!="yes"){
					
					if(unm!="" || pass!="" ||pinv!=""){
					console.log(results.rows.item(0).username+":"+results.rows.item(0).password);
					if(jQuery.trim(results.rows.item(0).username).toLowerCase()===jQuery.trim(unm).toLowerCase() ){
						console.log("ture usernm");
						if( jQuery.trim(results.rows.item(0).password).toLowerCase()===jQuery.trim(pass).toLowerCase() ){
					
						
							if(jQuery.trim(results.rows.item(0).pin) == jQuery.trim($('#pin_code').val())){
							
								tx.executeSql('UPDATE login  SET  pinvalid="yes" ');
							
								//toast("pin validation successfull");
								alert("pin validation successfull");
							
								changePage("loginPage","slide");
							}
							else{
						
								toast('Enter valid Pin');
							}
						}else{toast("Invalid  password");}
					}else{toast("Invalid username or password");}
				}else{toast("Invalid username or password");}	
				}else{return true;}// pin ==yes
			}//length
		});
	});

}catch(e){console.log(e);}
}
function RegisterUser()
{
try{	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);			
	db.transaction(noNetworkLoginDB);
	function noNetworkLoginDB(tx){
		tx.executeSql('SELECT * FROM login ',[], function(tx,results){
			console.log("No of user"+results.rows.length);
			if(results.rows.length > 0){
					toast("You have already Registered");
				}else{				
	console.log('authonticated');
	// user's email check
	var user_name = jQuery.trim($('#login_rg').val());
	
	if(user_name == '')
	{
		toast('Please enter your user name.');
		return false;
	}

	// user's password check
	var password = jQuery.trim($('#pass_rg').val());
	if(password == '')
	{
		toast('Please enter your password.');
		return false;
	}	

	//jQuery.support.cors = true;
	var checkNetConnection = checkNetwork();
	console.log(checkNetConnection);
	if(checkNetConnection == true)
    {
		// service url
		var serviceURL ='http://203.109.109.190:1469/royce3/roycerest/index.php?login='+user_name+'&pass='+password;
	
		// data string (if requierd)
		var dataString = '';

		$.ajax({
			
			type: 'POST',

			url: serviceURL,

			data: dataString,

			dataType: 'jsonp',
			
			jsonp: 'callback',

			beforeSend: function(){
				//alert("before");
				$.blockUI({ css: {border: 'none',padding: '15px',backgroundColor: '#000','-webkit-border-radius': '10px','-moz-border-radius': '10px',opacity: .5,color: '#fff'},timeout: 10000,fadeOut: 700, });

				//loaderStart();
			},						

			complete: function(){
				//alert("complete");
				//loaderStop();
			},

			success: function(data){
  	
				if(data.message.success == true){
					
					var response=data.message;
   		
					var acc = response.result;
			
					access_Key = acc.accesskey;
					
					window.localStorage.setItem('accesskey',access_Key);
					
					var role_Id = acc.roleid;
					
					window.localStorage.setItem('role_Id',role_Id);
					
					window.localStorage.setItem('user_name',user_name);
					
					window.localStorage.setItem('pass',password);
					
					registration(user_name,access_Key);
					
			
					}else{}
	
					
			},

			error:function(jqXHR, textStatus, errorThrown){
				// when restaurant/user session false or some error comes
				timeOut(jqXHR, textStatus, errorThrown);			
			}
		}); // ajax end
	}else{
			toast("Check Network");
		}
	
				}//else
		  });
		}
}catch(e){console.log(e);}
}

function chemistobqty_cn(){
try{
	var cn="";
	var qif="";
	 cn=$('#edit_obqtycn').val();
	 qif=$('#edit_obqtyif').val();
	
	if(isNaN(cn)||cn.indexOf(" ")!=-1){					
		$('#edit_obqtycn').val("");
			toast('Given value is not a number');
			$('#edit_obqtycn').focus();
					
		}
	if(isNaN(qif)||qif.indexOf(" ")!=-1){					
		$('#edit_obqtyif').val("");
			toast('Given value is not a number');
			$('#edit_obqtyif').focus();
					
		}

				
}catch(e){console.log(e);}
}
	
function checkUserAccount(){
	var F=0;	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);	
		
	db.transaction(noNetworkLoginDB);
	try{
	function noNetworkLoginDB(tx){
			
	
		tx.executeSql('SELECT * FROM login ',[], function(tx,results){
			console.log("No of user"+results.rows.length);
			if(results.rows.length > 0){
				if(jQuery.trim(results.rows.item(0).pinvalid).toLowerCase()==="yes"){
					F=1;
					changePage("loginPage","slide");
				}else{
					F=2;
					changePage("Pin_Varificationpage","slide");
					}
				
			}else{
				F=0;
				changePage("Registrationpage","slide");
				}
															  
		}, errorlogin);
					
	}	
	}catch(e){console.log(e);}
}
	
function StoreOnlyCurrectData_Drop(){
	setCurrentTimeOfUser();
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);	
		
	db.transaction(noNetworkLoginDB);
	try{
	function noNetworkLoginDB(tx){
	
		tx.executeSql('SELECT * FROM login ',[], function(tx,results){

			if(results.rows.length > 0){
				if( parseInt(results.rows.item(0).status) == parseInt(firstTimelogin)){ 
					return true;
				}else{console.log('DROP TABLE '+firstTimelogin);
						tx.executeSql('DELETE FROM offlineAttendance where endDay="yes" ', []);
						tx.executeSql('DROP TABLE IF EXISTS doctor');
						tx.executeSql('DROP TABLE IF EXISTS chemist');
						tx.executeSql('DROP TABLE IF EXISTS pocket');
						tx.executeSql('DROP TABLE IF EXISTS paramedic');
						tx.executeSql('DROP TABLE IF EXISTS royce_chemist');
						tx.executeSql('DROP TABLE IF EXISTS royce_doctor');
						tx.executeSql('DROP TABLE IF EXISTS royce_pocket');
						
						createDatabase();
						return true;
					}
				
			}												  
		}, errorlogin);
					
	}	
	}catch(e){console.log(e);}

	
	
	}

function markitingMenupulate(r1,r2,r3,r4){
try{	
	var p1=0;
	var p2=0;
	var p3=0;
	var p4=0;
	if(r1=="" ||parseInt(r1) < 0 ){
		r1=0;
		
		}
	if(r2=="" || parseInt(r1) < 0){
		r2=0;
		
		}
	if(r3=="" || parseInt(r1) < 0){
		r3=0;
		
			}
	if(r4=="" || parseInt(r1) < 0){
		r4=0;
	
			}

	 p1=window.localStorage.getItem('p1');
	 p2=window.localStorage.getItem('p2');
	 p3=window.localStorage.getItem('p3');
	 p4=window.localStorage.getItem('p4');
	if(p1==null || parseInt(p1) < 0){p1=0;}
	if(p2==null || parseInt(p1) < 0){p2=0;}
	if(p3==null || parseInt(p1) < 0){p3=0;}
	if(p4==null || parseInt(p1) < 0){p4=0;}
	

	var r5=parseInt(r1)-parseInt(p1);
	var r6=parseInt(r2)-parseInt(p2);
	var r7=parseInt(r3)-parseInt(p3);
	var r8=parseInt(r4)-parseInt(p4);
	
	console.log(p1+" : "+p2+" : "+p3+" : "+p4);
	console.log(r1+" : "+r2+" : "+r3+" : "+r4);
	console.log(r5+" : "+r6+" : "+r7+" : "+r8);
	
	var db = window.openDatabase("Database", "1.0", "ROYCEDB", 2000000);	
	
	db.transaction(noNetworkLoginDB);

	

	
	function noNetworkLoginDB(tx){
	
		tx.executeSql('SELECT * FROM royce_doc_txt ',[], function(tx,results){

			if(results.rows.length > 0){
				console.log(parseInt(results.rows.item(0).feild_value));
				 var rs1 = parseInt(results.rows.item(0).feild_value)-r5; 
				 var rs2 = parseInt(results.rows.item(1).feild_value)-r6;
				 var rs3 = parseInt(results.rows.item(2).feild_value)-r7;
				 var rs4 = parseInt(results.rows.item(3).feild_value)-r8;
				
				console.log(rs1+" : "+rs2+" : "+rs3+" : "+rs4);
				console.log(r5+" : "+r6+" : "+r7+" : "+r8);
				
				if( parseInt(results.rows.item(0).feild_value) >0 && parseInt(r5) >0){
					tx.executeSql('UPDATE royce_doc_txt  SET  feild_value="'+rs1+'"  where feild_value="'+results.rows.item(0).feild_value+'" AND tbl_id=1' );
				}
				
				if( parseInt(results.rows.item(1).feild_value) && parseInt(r6) > 0){
					tx.executeSql('UPDATE royce_doc_txt  SET  feild_value="'+rs2+'"  where feild_value="'+results.rows.item(1).feild_value+'" AND tbl_id=2' );
				}
				
				if( parseInt(results.rows.item(2).feild_value) > 0 && parseInt(r7) > 0){
					tx.executeSql('UPDATE royce_doc_txt  SET  feild_value="'+rs3+'"  where feild_value="'+results.rows.item(2).feild_value+'" AND tbl_id=3' );
				}
				
				if( parseInt(results.rows.item(3).feild_value) > 0 && parseInt(r8) > 0){
					tx.executeSql('UPDATE royce_doc_txt  SET  feild_value="'+rs4+'"  where feild_value="'+results.rows.item(3).feild_value+'" AND tbl_id=4' );
				}
				
			}												  
		});
					
	}	
	}catch(e){console.log(e);}
	
}	

function previousValueHandal(p1,p2,p3,p4){
try{	
	if(p1=="" || parseInt(p1) < 0 ){p1=0;}
	if(p2=="" || parseInt(p2) < 0){p2=0;}
	if(p3=="" || parseInt(p3) < 0){p3=0;}
	if(p4=="" || parseInt(p4) < 0){p4=0;}
	console.log(p1+" : "+p2+" : "+p3+" : "+p4);
	window.localStorage.setItem('p1',p1);
	window.localStorage.setItem('p2',p2);
	window.localStorage.setItem('p3',p3);
	window.localStorage.setItem('p4',p4);
	return;
}catch(e){console.log(e);}	
}		