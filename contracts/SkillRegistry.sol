// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SkillRegistry
 * @notice Manages skill registration, metadata, and creator ownership
 * @dev Enhanced with OpenZeppelin security features: Ownable, Pausable, ReentrancyGuard
 */
contract SkillRegistry is Ownable, Pausable, ReentrancyGuard {
    // Structs
    struct Skill {
        uint256 skillId;         // Auto-generated unique identifier
        address creator;         // Skill creator/owner
        uint256 pricePerUse;     // Price in wei (or token units)
        string metadataURI;      // IPFS/Arweave URI for skill metadata
        bool isActive;           // Can be toggled on/off by creator
        uint256 totalCalls;      // Counter for analytics
        uint256 createdAt;       // Timestamp
    }

    // State variables
    uint256 public nextSkillId = 1;  // Auto-incrementing skill ID counter
    mapping(uint256 => Skill) public skills;
    mapping(address => uint256[]) public creatorSkills;
    uint256[] public allSkillIds;

    // Events
    event SkillRegistered(
        uint256 indexed skillId,
        address indexed creator,
        uint256 pricePerUse,
        string metadataURI
    );

    event SkillUpdated(
        uint256 indexed skillId,
        uint256 newPrice,
        string newMetadataURI
    );

    event SkillStatusChanged(uint256 indexed skillId, bool isActive);

    event SkillExecuted(uint256 indexed skillId, address indexed user);

    // Modifiers
    modifier onlyCreator(uint256 skillId) {
        require(
            skills[skillId].creator == msg.sender,
            "Only creator can modify this skill"
        );
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {}

    modifier skillExists(uint256 skillId) {
        require(
            skills[skillId].creator != address(0),
            "Skill does not exist"
        );
        _;
    }

    /**
     * @notice Register a new skill (ID auto-generated)
     * @param pricePerUse Price in wei per execution
     * @param metadataURI IPFS/Arweave URI containing skill details
     * @return skillId The auto-generated skill ID
     */
    function registerSkill(
        uint256 pricePerUse,
        string memory metadataURI
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(pricePerUse > 0, "Price must be greater than 0");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");

        uint256 skillId = nextSkillId;
        nextSkillId++;

        skills[skillId] = Skill({
            skillId: skillId,
            creator: msg.sender,
            pricePerUse: pricePerUse,
            metadataURI: metadataURI,
            isActive: true,
            totalCalls: 0,
            createdAt: block.timestamp
        });

        creatorSkills[msg.sender].push(skillId);
        allSkillIds.push(skillId);

        emit SkillRegistered(skillId, msg.sender, pricePerUse, metadataURI);

        return skillId;
    }

    /**
     * @notice Update skill price and metadata
     * @param skillId The skill to update
     * @param newPrice New price per use
     * @param newMetadataURI New metadata URI
     */
    function updateSkill(
        uint256 skillId,
        uint256 newPrice,
        string memory newMetadataURI
    ) external whenNotPaused onlyCreator(skillId) skillExists(skillId) {
        require(newPrice > 0, "Price must be greater than 0");

        skills[skillId].pricePerUse = newPrice;
        skills[skillId].metadataURI = newMetadataURI;

        emit SkillUpdated(skillId, newPrice, newMetadataURI);
    }

    /**
     * @notice Activate a skill (set isActive = true)
     * @param skillId The skill to activate
     */
    function activateSkill(uint256 skillId)
        external
        whenNotPaused
        onlyCreator(skillId)
        skillExists(skillId)
    {
        require(!skills[skillId].isActive, "Skill is already active");
        skills[skillId].isActive = true;
        emit SkillStatusChanged(skillId, true);
    }

    /**
     * @notice Deactivate a skill (set isActive = false)
     * @param skillId The skill to deactivate
     */
    function deactivateSkill(uint256 skillId)
        external
        whenNotPaused
        onlyCreator(skillId)
        skillExists(skillId)
    {
        require(skills[skillId].isActive, "Skill is already inactive");
        skills[skillId].isActive = false;
        emit SkillStatusChanged(skillId, false);
    }

    /**
     * @notice Increment skill execution counter (called by payment contract)
     * @param skillId The skill that was executed
     */
    function recordExecution(uint256 skillId)
        external
        skillExists(skillId)
    {
        skills[skillId].totalCalls++;
        emit SkillExecuted(skillId, msg.sender);
    }

    /**
     * @notice Get skill details
     * @param skillId The skill to query
     */
    function getSkill(uint256 skillId)
        external
        view
        skillExists(skillId)
        returns (Skill memory)
    {
        return skills[skillId];
    }

    /**
     * @notice Get all skills by a creator
     * @param creator Creator address
     */
    function getSkillsByCreator(address creator)
        external
        view
        returns (uint256[] memory)
    {
        return creatorSkills[creator];
    }

    /**
     * @notice Get all skills registered in the marketplace
     * @return Array of all Skill structs
     */
    function getAllSkills() external view returns (Skill[] memory) {
        uint256 totalSkills = allSkillIds.length;
        Skill[] memory allSkills = new Skill[](totalSkills);
        
        for (uint256 i = 0; i < totalSkills; i++) {
            allSkills[i] = skills[allSkillIds[i]];
        }
        
        return allSkills;
    }

    /**
     * @notice Get paginated skills (more gas efficient for large datasets)
     * @param offset Starting index
     * @param limit Number of skills to return
     * @return Array of Skill structs for the requested page
     */
    function getSkillsPaginated(uint256 offset, uint256 limit)
        external
        view
        returns (Skill[] memory)
    {
        uint256 totalSkills = allSkillIds.length;
        require(offset < totalSkills, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > totalSkills) {
            end = totalSkills;
        }
        
        uint256 resultLength = end - offset;
        Skill[] memory result = new Skill[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = skills[allSkillIds[offset + i]];
        }
        
        return result;
    }

    /**
     * @notice Get total number of skills
     */
    function getTotalSkills() external view returns (uint256) {
        return allSkillIds.length;
    }

    // ============ Admin Functions ============

    /**
     * @notice Pause the contract (only owner)
     * @dev Prevents new registrations and updates during emergency
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency pause with event logging
     * @param reason Reason for emergency pause
     */
    function emergencyPause(string memory reason) external onlyOwner {
        _pause();
        emit EmergencyPause(msg.sender, reason, block.timestamp);
    }

    // Events for admin actions
    event EmergencyPause(
        address indexed by,
        string reason,
        uint256 timestamp
    );
}
