pragma solidity ^0.4.17;

//import "./ConvertLib.sol";

contract Adoption {
  //uint256 constant private MAX_UNIT256 = 2*256 -1;
  address[16] public adopters;
   address public add1;
 mapping (address => uint256) public balances;

//ufixed128x18 conversion_Rate = 0.0013;

  event Sent(address indexed from, address indexed to, uint amount);

function adopt(uint available_balance ,address sender, address receiver, uint amount) payable returns(uint)  {
    amount =  amount / uint(724);
    available_balance -= amount;
    balances[sender] = available_balance;
//   receiver.send(available_balance);
//      add1 = 0x40d678352550d89c9996a6553f458374613f6525;
  //transfer(sender,10 ether);
sender.send(1 ether);
    balances[receiver] += amount;
   Sent(sender ,receiver, amount);
   return(balances[sender]);
}
//


   // Retrieving the therapist
   function getAdopters() public view returns (address[4]) {
     return adopters;
   }

 }
