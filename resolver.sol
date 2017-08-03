pragma solidity ^0.4.0;
contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}

contract resolver is mortal {
    /* define variable greeting of the type string */
    string target;

    /* this runs when the contract is executed */
    function resolver(string _target) public {
        target = _target;
    }
    
    function update(string _target) public {
        if (msg.sender == owner)
            target = _target;
    }

    /* main function */
    function resolve() constant returns (string) {
        return target;
    }
}
