var medicalDataContractAddress = '0x267EE4b8eC7357252B6b8A2E6A2481AB40Da5076';

if (window.ethereum) 
{
  window.web3 = new Web3(window.ethereum)
  try {
      // ask user for permission
      ethereum.enable()
      // user approved permission
  } catch (error) {
      // user rejected permission
      console.log('user rejected permission')
  }
}
else if (window.web3) 
{
  window.web3 = new Web3(window.web3.currentProvider)
  // no need to ask for permission
}
else 
{
  window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
console.log (window.web3.currentProvider)

// Constants

//Variables 
var contract;
var account;
var newAccount;
var newIdCardAddress;
var newMedicalCardAddress;

//Web3 fucntions
web3.eth.getAccounts(function(err, accounts) {
  if (err != null) {
    alert("Error retrieving accounts.");
    return;
  }
  if (accounts.length == 0) {
    alert("No account found! Make sure the Ethereum client is configured properly.");
    return;
  }
  account = accounts[0];

  contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);

  contract.methods.role(account).call(function (err, res) {
	if (res != 2) 
	{ 
	  if(res==0)
		location.assign("hospital.html"); 
	  else if(res==1)
		location.assign("doctor.html"); 
	  else
		location.assign("/login.html"); 
	}
	})

  getMedicalDataAddress(account);
  document.getElementById('account-address').innerText = "Account Address : " + account;
  console.log('Account: ' + account);
  web3.eth.defaultAccount = account;
});

function addHospitalByPatient()
{
  contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  info = $("#add-Hospital-By-Patient").val();
  contract.methods.addHospitalByPatient(info).send( {from: account}).then( function(tx) { 
         console.log("Transaction: ", tx); 
  });
  $("#add-Hospital-By-Patient").val('');
}

async function loadLogs()
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  	contract.methods.getLog().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		
		//document.getElementById('log-of-medical-data').innerHTML = res;
		buildtable(res,'load-logs');

	  })
}

async function viewMedicalDataByPatient()
{
	//$("#view-medical-data-by-patient").css({"display": "none"});
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  	contract.methods.viewMedicalDataByPatient().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		buildtable(res,'load-med-data');
	  })
}

async function loadAuthorisedHospitalsArray()
{
	//$("#load-authorised-hospitals-array").css({"display": "none"});
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  	contract.methods.viewAuthorisedHospitalsArray().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		buildtable(res,'load-auth-hospitals');
	  })
}


async function loadAuthorisedDoctorsArray()
{
	//$("#load-authorised-doctors-array").css({"display": "none"});
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
  	contract.methods.viewAuthorisedDoctorsArray().call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("The reply is: ", res)
		buildtable(res,'load-auth-doctors');
	  })
}

function getMedicalDataAddress(userAddress)
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
  	contract.methods.getMedicalDataAddress(userAddress).call(function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("MEdical data add is : ", res);
		medicalDataContractAddress = res;
		document.getElementById('medical-record-address').innerText = "Medical Data Address : " + res;
		return res;
	  })
}

async function removeHospitalByPatient()
{
	info = $("#remove-Hospital-By-Patient").val();

	await removeHospitalFromMedicalData(info);
	await removeHospitalFromCentralDatabase(info);

	$("#remove-Hospital-By-Patient").val('');
}
async function removeHospitalFromMedicalData(data)
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
	contract.methods.removeHospitalByPatient(data).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}
async function removeHospitalFromCentralDatabase(data)
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.deleteHospitalFromPatient(data).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}


async function removeDoctorByPatient()
{
	info = $("#remove-Doctor-By-Patient").val();

	await removeDoctorFromMedicalData(info);
	await removeDoctorFromCentralDatabase(info);

	$("#remove-Doctor-By-Patient").val('');
}
async function removeDoctorFromMedicalData(data)
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
	contract.methods.removeDoctorByPatient(data).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}
async function removeDoctorFromCentralDatabase(data)
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.deleteDoctorFromPatient(data).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}

async function addDoctorByPatient()
{
	info = $("#add-Doctor-By-Patient").val();

	await addDoctorToMedicalData(info);
	await addToPatientsOfDoctorInCentralDatabase(info);

	$("#add-Doctor-By-Patient").val('');
}
async function addDoctorToMedicalData(data)
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
	contract.methods.addDoctorByPatient(data).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}
async function addToPatientsOfDoctorInCentralDatabase(data)
{
	contract = new web3.eth.Contract(abiCenteralDatabase, centralDatabaseContractAddress);
	contract.methods.addToPatientsOfDoctor(data).send( {from: account}).then( function(tx) { 
			console.log("Transaction: ", tx); 
	});
}



function buildtable(data,id)
{
	console.log("Table called");

	var table = document.getElementById(id);
		
	table.style.display = 'inline-table';
	table.innerHTML = "";

	for (var i = 0; i < data.length; i++) {
	var row =
		` <tr>
	<td> ${i + 1}</td>
	<td style="text-align: center;"> ${data[i]}</td>
	</tr>`

	table.innerHTML += row;
	}
	
	table.innerHTML += `</table>`
}

var requests=[];
var len;
async function getRequests()
{
	//$("#get-requests").css({"display": "none"});
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
	contract.methods.viewRequests().call(function (err, res) {
		if (err) {
		console.log("An error occured", err)
		return
		}
		console.log("The reply is: ", res)
		requests = res;
		buildTableForRequests();
	})
}

async function acceptRequest(info, idx)
{
	len--;
	if(len==0)
		$("#view-requests").css({"display": "none"});

	await addDoctorToMedicalData(info);
	await addToPatientsOfDoctorInCentralDatabase(info);
	await deleteRequest(idx)

	var row_string = "#row" + idx ; 
	$(row_string).css({"display": "none"});
}

async function rejectRequest(idx)
{
	len--;
	if(len==0)
		$("#view-requests").css({"display": "none"});

	await deleteRequest(idx)

	var row_string = "#row" + idx ; 
	$(row_string).css({"display": "none"});
}


async function deleteRequest(idx)
{
	contract = new web3.eth.Contract(abiMedicalData, medicalDataContractAddress);
	contract.methods.deleteRequest(idx).send( {from: account}).then( function(tx) { 
		console.log("Transaction: ", tx); 
});
}



function buildTableForRequests()
{
	data= requests;
	len = data.length;
	console.log("Table called");

	var table = document.getElementById("view-requests");
		
	table.style.display = 'inline-table';
	table.innerHTML = "";

	for (var i = 0; i < data.length; i++) 
	{
	var row =
	`<tr id="row${i}">
	<td > ${i + 1}</td>
	<td style="text-align: center;"> '${data[i]}'</td>
	<td style="text-align: center;"> 
		<div class="btn-accept">
		<button id='greenBtn${i}' onclick="acceptRequest('${data[i]}',${i})">
			<i class="fa fa-check "></i>
		</button>
		</div>
	</td>
	<td style="text-align: center;"> 
		<div class="btn-reject">
		<button id='redBtn${i}' onclick="rejectRequest(${i})">
			<i class="fa fa-times "></i>
		</button>
		</div>
	</td>
	</tr>`

	table.innerHTML += row;
	}
	
	table.innerHTML += `</table>`
}