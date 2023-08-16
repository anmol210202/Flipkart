// SPDX-License-Identifier: MIT
// contracts/FlipCoin.sol

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract FlipCoin is ERC20Capped , ERC20Burnable {

    address payable public owner;
    uint256 public blockReward;

    constructor(uint256 cap,uint256 reward) ERC20("FlipCoin", "FKC") ERC20Capped(cap*10**decimals()){
        owner = payable(msg.sender);
        _mint(msg.sender, 70000000 * 10 ** decimals());
        blockReward = reward*10**decimals();
    } 

    function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }
    
    function mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
            mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, amount);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward*10**decimals(); 
    }

    


    // make a destroy function to destroy the contract and send the funds to the owner
//    function destroy() public onlyOwner {
//        selfdestruct(owner);
//    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    
}

