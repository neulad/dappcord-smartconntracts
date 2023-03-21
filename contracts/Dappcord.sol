//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dappcord is ERC721Enumerable, Ownable {
    struct Channel {
        uint256 id;
        string name;
        address owner;
        uint256 price;
        uint256 balance;
    }

    uint256 public tokenCounter;
    mapping(uint256 => mapping(uint256 => bool)) public participants;
    Channel[] private channels;

    modifier channelExists(uint256 _id) {
        require(
            channels.length > _id && _id >= 0,
            "Dappcord: Channel doesn't  exit"
        );
        _;
    }

    constructor() ERC721("Dappcord", "DPC") {}

    function getChannel(uint256 _id) external view returns (Channel memory) {
        return channels[_id];
    }

    function withdraw(uint256 _id) external channelExists(_id) {
        require(
            channels[_id].owner == msg.sender,
            "Dappcord: Withdrawer must be the owner"
        );

        (bool successs, ) = msg.sender.call{value: channels[_id].balance}("");
        require(successs, "Dappcord: Transfer has failed");
    }

    function mint(uint256 _id) external payable channelExists(_id) {
        require(
            channels[_id].price <= msg.value,
            "Dappcord: Value is lower than required in the chanel"
        );

        tokenCounter++;

        participants[_id][tokenCounter] = true;
        channels[_id].balance += msg.value;
        _safeMint(msg.sender, tokenCounter);
    }

    function createChannel(string memory _name, uint256 _price) external {
        channels.push(Channel(channels.length, _name, msg.sender, _price, 0));
    }

    function getChannelsNumber() external view returns (uint256) {
        return channels.length;
    }

    function getIfParticipant(
        uint256 _id,
        uint256 _tokenId
    ) external view returns (bool) {
        return participants[_id][_tokenId];
    }
}
