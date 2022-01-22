//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Tok1 is ERC20 {
    constructor() ERC20("Token 1", "TOK1") {
        _mint(msg.sender, 100_000);
    }
}

contract Tok2 is ERC20 {
    constructor() ERC20("Token 2", "TOK2") {
        _mint(msg.sender, 100_000);
    }
}

contract Vault {
    mapping(address => mapping(address => uint256)) private _vaults;

    event Withdraw(
        address indexed erc20TokenAddress,
        address indexed wallet,
        uint256 indexed amount
    );

    event Deposit(
        address indexed erc20TokenAddress,
        address indexed wallet,
        uint256 indexed amount
    );

    function deposit(address _erc20TokenAddress, uint256 _amount) external {
        require(
            _erc20TokenAddress != address(0),
            "Token address can't be zero address"
        );
        require(_amount > 0, "Amount must be > 0");

        bool transferSucceeded = IERC20(_erc20TokenAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );

        require(transferSucceeded, "Transfer failed");

        _vaults[msg.sender][_erc20TokenAddress] += _amount;
        emit Deposit(_erc20TokenAddress, msg.sender, _amount);
    }

    function withdraw(address _erc20TokenAddress, uint256 _amount) external {
        require(
            _erc20TokenAddress != address(0),
            "Token address can't be zero address"
        );
        require(_amount > 0, "Amount must be > 0");

        uint256 balance = _balanceOf(_erc20TokenAddress, msg.sender);

        require(balance >= _amount, "Not enough tokens deposited");

        bool approval = IERC20(_erc20TokenAddress).approve(
            address(this),
            balance
        );
        require(approval, "Approval to transfer failed");

        bool transferSucceeded = IERC20(_erc20TokenAddress).transferFrom(
            address(this),
            msg.sender,
            _amount
        );

        require(transferSucceeded, "Transfer failed");

        _vaults[msg.sender][_erc20TokenAddress] -= _amount;
        emit Withdraw(_erc20TokenAddress, msg.sender, _amount);
    }

    function balanceOf(address _erc20TokenAddress)
        external
        view
        returns (uint256)
    {
        return _balanceOf(_erc20TokenAddress, msg.sender);
    }

    function _balanceOf(address _erc20TokenAddress, address wallet)
        private
        view
        returns (uint256)
    {
        require(
            _erc20TokenAddress != address(0),
            "Token address can't be zero address"
        );

        return _vaults[wallet][_erc20TokenAddress];
    }
}
