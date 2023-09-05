// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract My_ERC1155 is ERC1155, Ownable, ERC1155Burnable {
    uint256 public constant POP = 0;
    uint256 public constant LuckyNFT = 2;

    constructor()
        ERC1155(
                "https://ipfs.io/ipfs/{Your_Hash_Here}/{id}.json"
            )
    {   
        _mint(msg.sender, POP, 100, "");
        _mint(msg.sender, LuckyNFT, 1, "");
    }

    function uri(
        uint256 _tokenid
    ) public pure override returns (string memory){
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/{Your_Hash_Here}/",
                Strings.toString(_tokenid),
                ".json"
            )
        );
    }

    function contractURI() public pure returns (string memory){
        return "https://ipfs.io/ipfs/{Your_Hash_Here}/collection.json";
    }

    function airdrop(uint256 tokenId, address[] calldata recipients)
    external onlyOwner{
        for (uint i = 0; i<recipients.length; i++){
            _safeTransferFrom(msg.sender, recipients[i], tokenId, 1, "");
            if(balanceOf(owner(), POP) == 99 && balanceOf(owner(), LuckyNFT) == 1){
                _safeTransferFrom(msg.sender, recipients[i], LuckyNFT, 1, "");
            }
        }
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        require(
            msg.sender == owner() || to == address(0),
            "Token cannot be transferred, only be burned"
        );
    }
}
