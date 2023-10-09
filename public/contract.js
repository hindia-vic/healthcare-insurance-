
var connected, myContract;

var current_address_span = document.getElementById("current_address")

// console.log(SmartContractAddress);

async function connect_to_metamask() {

    // Modern DApp Browser
    if (window.ethereum) {

        web3 = new Web3(window.ethereum)

        try {

            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const accounts = await web3.eth.getAccounts();

            current_address = accounts[0];

            current_address_span.innerHTML = `Active: ${current_address}`;

            console.log(current_address);
            console.log("connected");

            return true;

        } catch (err) {

            return false;

        }
        // For Legacy Browser
    } else if (window.web3) {

        window.web3 = new Web3(web3.currentProvider);

        return true;

    } else {

        Alert("Please Install Metamask !");

        return false;
    }

}
document.addEventListener('DOMContentLoaded', async () => {
    connected = await connect_to_metamask();
    // Connect to smart contract 
    myContract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);
    console.log(myContract)
});

function logout() {
    // Clear the authenticated session data
    sessionStorage.removeItem('loggedIn');

    // Redirect back to the login page
    window.location.href = '/';
}

async function setPatientData() {
    var name = document.getElementById("name").value;
    var uniqueIdentifier = document.getElementById("uniqueIdentifier").value;
    var amountInsured = document.getElementById("amountInsured").value;
    var account = document.getElementById("account").value;


    if (!name || !uniqueIdentifier || !amountInsured || !account) {
        alert("Please fill in all fields.");
        return;
    }
    try {
        let result = await myContract.methods.setPatientData(name, uniqueIdentifier, amountInsured, account).send({ from: current_address });
        console.log(result)
        alert("Client added successfully");
        document.getElementById("name").value = " ";
        document.getElementById("uniqueIdentifier").value = " ";
        document.getElementById("amountInsured").value = " ";
        document.getElementById("account").value = " ";
    } catch (error) {
        console.error(error);

        // Display error message
        alert("Failed to register Client. Please try again.");
    }
}

async function setDoctor() {
    var doctorAddress = document.getElementById("doctorAddress").value;

    if (!doctorAddress) {
        alert("please fill in all fields")
        return;
    }
    try {
        let result = await myContract.methods.setDoctor(doctorAddress).send({ from: current_address });
        console.log(result)
        alert("Doctor registered successfully");
        document.getElementById("doctorAddress").value = " ";
    } catch (error) {
        console.error(error);

        // Display error message
        alert("Failed to register Doctor. Please try again.");
    }
}


async function useInsurance() {
    var useAddress = document.getElementById("useAddress").value;
    //var account = document.getElementById("account").value;
    var amountUsed = document.getElementById("amountUsed").value;

    if (!useAddress || !amountUsed) {
        alert("Please fill in all fields")
        return;
    }
    try {
        let result = await myContract.methods.useInsurance(useAddress, amountUsed).send({ from: current_address });
        console.log(result)
        alert("Insurance used successfully");
        document.getElementById("useAddress").value = " ";
        document.getElementById("amountUsed").value = " ";
    } catch (error) {
        console.error(error);

        // Display error message
        alert("Failed to use insurance. Please try again.");
    }
}

async function getpatientDetails() {
    var patientAddress = document.getElementById("patientAddress").value;
    //var account = document.getElementById("account").value;

    // call getpatientDetails function in contract
    let result = await myContract.methods.getpatientDetails(patientAddress).call({ from: current_address });
    document.getElementById("patientDetails").innerHTML = "Name: " + result[0] + "<br>unique id: " + result[1] + "<br>amount insured: " + result[2];
    console.log(result);
}
async function updateMedicalRecord() {
    const recordAddress = document.getElementById("recordAddress").value;
    const date = document.getElementById('recordDate').value;
    const symptoms = document.getElementById('recordSymptoms').value;
    const diagnosis = document.getElementById('recordDiagnosis').value;
    const treatment = document.getElementById('recordTreatment').value;

    // Input validation
    if (!recordAddress || !date || !symptoms || !diagnosis || !treatment) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        let result = await myContract.methods.updateMedicalRecord(recordAddress, date, symptoms, diagnosis, treatment).send({ from: current_address });

        console.log(result);

        // Display success message
        alert("Medical record updated successfully.");

        // Clear input fields
        clearInputFields();
    } catch (error) {
        console.error(error);

        // Display error message
        alert("Failed to update the medical record. Please try again.");
    }
}

function clearInputFields() {
    // Clear input fields
    document.getElementById("recordAddress").value = "";
    document.getElementById("recordDate").value = "";
    document.getElementById("recordSymptoms").value = "";
    document.getElementById("recordDiagnosis").value = "";
    document.getElementById("recordTreatment").value = "";
}

async function getMedicalRecords() {
    const medicalAddress = document.getElementById("medical").value;
    await myContract.methods.getMedicalRecords(medicalAddress).call({ from: current_address })
    try {
        const medicalRecords = await myContract.methods.getMedicalRecords(medicalAddress).call({ from: current_address });
        displayMedicalRecords(medicalRecords);
    } catch (error) {
        console.error(error);
        alert("Failed to retrieve the medical records.");
    }
}
function displayMedicalRecords(medicalRecords) {
    const medicalRecordsOutput = document.getElementById("medicalRecordsOutput");

    if (medicalRecords.length > 0) {
        let medicalRecordsHTML = "<h3>Medical Records:</h3>";

        for (let i = 0; i < medicalRecords.length; i++) {
            medicalRecordsHTML += "<p>" + medicalRecords[i] + "</p>";
        }

        medicalRecordsOutput.innerHTML = medicalRecordsHTML;
    } else {
        medicalRecordsOutput.innerHTML = "<p>No medical records found.</p>";
    }
}

async function balance() {
    try {
        const balance = await myContract.methods.balance().call();
        displayBalance(balance);
    } catch (error) {
        console.error(error);
        alert("Failed to retrieve the account balance.");
    }
}
function displayBalance(balance) {
    const balanceOutput = document.getElementById("balanceOutput");

    const formattedBalance = web3.utils.fromWei(balance, 'ether');
    balanceOutput.innerHTML = "<p>Account Balance: " + formattedBalance + " ETH</p>";
}
async function revokeDoctor() {
    const daddress = document.getElementById("daddress").value;
    if (!daddress) {
        alert("Please fill in all fields.");
        return;
    }
    try {
        let result = await myContract.methods.revokeDoctor(daddress).send({ from: current_address });
        console.log(result)

        alert("Doctor revoked successfully.");
        document.getElementById("daddress").value = " ";
    } catch (error) {
        console.error(error);

        // Display error message
        alert("Failed to revoke Doctor. Please try again.");
    }

}

async function transferOwnership() {
    const newaddress = document.getElementById("newaddress").value;
    if (!newaddress) {
        alert("Please fill in all fields.");
        return;
    }
    try {
        let result = await myContract.methods.transferOwnership(newaddress).send({ from: current_address });
        console.log(result)
        alert("Contract transfered successfully.");
        document.getElementById("newaddress").value = " ";
    } catch (error) {
        console.log(error);

        alert("Transfer failed")
    }
}
async function getPatients() {
    const patients = await myContract.methods.getAllPatientsWithDetails().call();
    const patientsData = document.getElementById("patientsData");
    patients[0].forEach((address, index) => {
        const name = patients[1][index];
        const identifier = patients[2][index];
        const insuredAmount = patients[3][index].toString();

        const row = document.createElement("tr");
        const addressCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const identifierCell = document.createElement("td");
        const insuredAmountCell = document.createElement("td");

        addressCell.textContent = address;
        nameCell.textContent = name;
        identifierCell.textContent = identifier;
        insuredAmountCell.textContent = insuredAmount;

        row.appendChild(addressCell);
        row.appendChild(nameCell);
        row.appendChild(identifierCell);
        row.appendChild(insuredAmountCell);

        patientsData.appendChild(row);
    });
}

async function giveInsurancePermission() {
    const doctorsAddress = document.getElementById("doctorsAddress").value;
    if (!doctorsAddress) {
        alert("Please fill in all fields.");
        return;
    }
    try {
        let result = await myContract.methods.giveInsurancePermission(doctorsAddress).send({ from: current_address });
        console.log(result)
        alert("Insurance permission granted successfully!");
        document.getElementById("doctorsAddress").value = "";
    } catch (error) {
        console.error(error);
        alert("Failed to grant insurance permission.");
    }
}

document.getElementById("doctorsForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const doctorAddressInput = document.getElementById("doctorAddressInput").value;

    // Call the contract function
    getPatientsServedByDoctor(doctorAddressInput);
});
async function getPatientsServedByDoctor(doctorAddressInput) {
    try {
        const patientAddresses = await myContract.methods.getPatientsServedByDoctor(doctorAddressInput).call();
        displayPatients(patientAddresses);
    } catch (error) {
        console.error(error);
        alert("Failed to get the patients served by the doctor.");
    }
}
function displayPatients(patientAddresses) {
    const patientList = document.getElementById("patientList");

    if (patientAddresses.length > 0) {
        let patientHTML = "<h3>Patients Served by the Doctor:</h3>";
        patientHTML += "<ul>";

        for (let i = 0; i < patientAddresses.length; i++) {
            patientHTML += "<li>" + patientAddresses[i] + "</li>"
        }

        patientHTML += "</ul>";
        patientList.innerHTML = patientHTML;
    } else {
        patientList.innerHTML = "<p>No patients served by the doctor.</p>";
    }
}
async function getAllDoctors() {
    try {
        const doctors = await myContract.methods.getAllDoctors().call();
        displayDoctors(doctors);
    } catch (error) {
        console.error(error);
        alert("Failed to retrieve the list of doctors.");
    }
}
function displayDoctors(doctors) {
    const doctorsOutput = document.getElementById("doctorsOutput");

    if (doctors.length > 0) {
        let doctorsHTML = "<h3>List of Doctors:</h3>";

        for (let i = 0; i < doctors.length; i++) {
            doctorsHTML += "<p>" + doctors[i] + "</p>";
        }

        doctorsOutput.innerHTML = doctorsHTML;
    } else {
        doctorsOutput.innerHTML = "<p>No doctors found.</p>";
    }
}

async function getSuccessfulTransactions() {
    try {
        const successfulTransactions = await myContract.methods.getSuccessfulTransactions().call();

        // Display the transactions in the table
        const transactionsTable = document.getElementById('transactionsBody');
        successfulTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            const patientCell = document.createElement('td');
            const doctorCell = document.createElement('td');
            const amountUsedCell = document.createElement('td');
            patientCell.textContent = transaction.patient;
            doctorCell.textContent = transaction.doctor;
            amountUsedCell.textContent = transaction.amountUsed;
            patientCell.style.border = '1px solid black';
            doctorCell.style.border = '1px solid black';
            amountUsedCell.style.border = '1px solid black';
            patientCell.style.color = 'yellow';
            doctorCell.style.color = 'yellow';
            amountUsedCell.style.color = 'yellow';

            row.appendChild(patientCell);
            row.appendChild(doctorCell);
            row.appendChild(amountUsedCell);
            transactionsTable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

