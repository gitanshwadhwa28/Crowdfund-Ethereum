// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory{
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public{
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign{
    
    struct Request{
        string description;
        uint value;
        address recepient;
        bool complete;
        uint approvalCounts;
        mapping(address=>bool) approvals;
    }
    
    mapping(uint => Request) public requests;
    address public manager;
    uint256 public minContribution;
    mapping(address=>bool) public approvers;
    uint public approversCount;
    uint public numRequests;
    
    constructor(uint256 minimum, address creator){
        manager = creator;
        minContribution = minimum;
    }
    
    modifier restrict(){
        require(msg.sender == manager);
        _;
    }
    
    function contribute() public payable{
    
        require(msg.value > minContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
        
    }
    
    function createRequest(string memory description, uint value, address recepient) 
        public restrict{

        Request storage newRequestInStorage = requests[numRequests];
        newRequestInStorage.description = description;
        newRequestInStorage.value = value;
        newRequestInStorage.recepient = recepient;
        newRequestInStorage.complete = false;
        newRequestInStorage.approvalCounts = 0;
        numRequests++;

    }
    
    function approveRequest(uint index) public{
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);
        
        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCounts++;
        
        
    }
    
    function finalizeRequest(uint index) public restrict{
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalCounts > (approversCount / 2));
        address payable addr = payable(request.recepient);
        addr.transfer(request.value);
        request.complete = true;
        
        
    }

    function getSummary() public view returns(uint, uint, uint, uint, address){
        return(
            minContribution,
            address(this).balance,
            numRequests + 1,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint){
        return(
            numRequests + 1
        );
    }
    
}