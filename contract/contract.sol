pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
contract healthcare {
address owner;
struct patient {
address account;
string name;
uint uniqueIdentifier;
uint amountInsured;
}
struct medicalRecord {
string date;
string symptoms;
string diagnosis;
string treatment;
}
mapping(address => bool)public doctormapping;
mapping(address => uint) public doctorBalances;
mapping(address => patient) public patientmapping;
//mapping(address => medicalRecord) public medicalRecordmapping;
mapping(address => medicalRecord[]) public medicalRecordmapping;

modifier onlyOwner() {
    require(owner == msg.sender);
    _;
}

constructor() public payable {
        require(msg.value > 0, "You must deploy the contract with an initial ether balance.");
        owner = msg.sender;
    }
    
function setDoctor(address _address) public onlyOwner {
    require(!doctormapping[_address]);
    doctormapping[_address] = true;
}

function setpatientData(string _name, uint _amountinsured, uint _uniqueIdentifier, address _account)public onlyOwner {
    patient p;
    p.name = _name;
    p.uniqueIdentifier = _uniqueIdentifier;
    p.amountInsured = _amountinsured *1 ether;
    patientmapping[_account] = p;
}

function useInsurance(address _account, uint _amountused) public returns (string) {
    require(doctormapping[msg.sender],'only the doctor can use insurance');
    if (patientmapping[_account].amountInsured < _amountused) {
        revert("not enough insurance amount available");
    }
    patientmapping[_account].amountInsured -= _amountused;
    msg.sender.transfer(_amountused);
    return "insurance has been used successfuly";
}

 function getDoctorBalance(address _doctor) public view returns(uint) {
    require(doctormapping[_doctor], "The given address is not a doctor");
    return _doctor.balance;
}

function updateMedicalRecord(address _account, string _date, string _symptoms, string _diagnosis, string _treatment) public {
    require(doctormapping[msg.sender]);
    medicalRecord record;
    record.date = _date;
    record.symptoms = _symptoms;
    record.diagnosis = _diagnosis;
    record.treatment = _treatment;
    medicalRecordmapping[_account].push(record);    
}

function getpatientDetails(address _account) external view returns (string, uint256, uint256) {
    return (patientmapping[_account].name, patientmapping[_account].uniqueIdentifier, patientmapping[_account].amountInsured);
}

function getMedicalRecords(address _account) public view returns (medicalRecord[] memory) {
    return medicalRecordmapping[_account];
}

function getLatestMedicalRecord(address _account) public view returns (medicalRecord memory) {
    medicalRecord[] memory records = medicalRecordmapping[_account];
    return records[records.length - 1];
}

function revokeDoctor(address _doctor) public onlyOwner {
    // Check that the given address is a doctor
    require(doctormapping[_doctor], "The given address is not a doctor");

    // Revoke the doctor's access by setting their address to false in the doctormapping variable
    doctormapping[_doctor] = false;
}

function transferOwnership(address _newOwner) public onlyOwner {
    // Check that the given address is not the zero address
    require(_newOwner != address(0), "The given address is not valid");

    // Transfer ownership of the contract to the new owner
    owner = _newOwner;
}

function balance()public view returns(uint _balance){
_balance=address(this).balance;
}


}
