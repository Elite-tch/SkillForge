// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SkillRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SkillPayment
 * @notice Handles micropayments, escrow, and settlement for skill executions
 * @dev Enhanced with OpenZeppelin security features: Ownable, Pausable, ReentrancyGuard
 */
contract SkillPayment is Ownable, Pausable, ReentrancyGuard {
    // Reference to the skill registry
    SkillRegistry public immutable skillRegistry;

    // Structs
    struct Transaction {
        uint256 skillId;
        address buyer;
        address creator;
        uint256 amount;
        uint256 timestamp;
        TransactionStatus status;
        string resultURI; // IPFS URI to execution result
    }

    enum TransactionStatus {
        Pending,
        Completed,
        Refunded,
        Failed
    }

    // State variables
    mapping(bytes32 => Transaction) public transactions;
    mapping(address => uint256) public creatorBalances;
    mapping(address => bytes32[]) public userTransactions;

    uint256 public platformFeePercent = 5; // 5% platform fee
    address public platformWallet;
    uint256 public totalTransactions;

    // Events
    event SkillPurchased(
        bytes32 indexed transactionId,
        uint256 indexed skillId,
        address indexed buyer,
        uint256 amount
    );

    event TransactionCompleted(
        bytes32 indexed transactionId,
        string resultURI
    );

    event TransactionRefunded(
        bytes32 indexed transactionId,
        string reason
    );

    event EarningsWithdrawn(address indexed creator, uint256 amount);

    // Modifiers
    modifier onlyPlatform() {
        require(msg.sender == platformWallet, "Only platform can call this");
        _;
    }

    constructor(address _skillRegistry, address _platformWallet) Ownable(msg.sender) {
        require(_skillRegistry != address(0), "Invalid registry address");
        require(_platformWallet != address(0), "Invalid platform wallet");
        
        skillRegistry = SkillRegistry(_skillRegistry);
        platformWallet = _platformWallet;
    }

    /**
     * @notice Purchase and execute a skill
     * @param skillId The skill to execute (auto-generated ID)
     * @return transactionId Unique transaction identifier
     */
    function purchaseSkill(uint256 skillId)
        external
        payable
        whenNotPaused
        nonReentrant
        returns (bytes32)
    {
        // Get skill details from registry
        SkillRegistry.Skill memory skill = skillRegistry.getSkill(skillId);
        
        require(skill.isActive, "Skill is not active");
        require(msg.value >= skill.pricePerUse, "Insufficient payment");

        // Generate unique transaction ID
        bytes32 transactionId = keccak256(
            abi.encodePacked(
                skillId,
                msg.sender,
                block.timestamp,
                totalTransactions
            )
        );

        // Calculate platform fee (funds held in escrow)
        // Will be split when transaction is completed

        // Create transaction record
        transactions[transactionId] = Transaction({
            skillId: skillId,
            buyer: msg.sender,
            creator: skill.creator,
            amount: msg.value,
            timestamp: block.timestamp,
            status: TransactionStatus.Pending,
            resultURI: ""
        });

        userTransactions[msg.sender].push(transactionId);
        totalTransactions++;

        // Hold funds in escrow (in contract balance)
        // Will be released on completion or refunded on failure

        // Record execution in registry
        skillRegistry.recordExecution(skillId);

        emit SkillPurchased(transactionId, skillId, msg.sender, msg.value);

        return transactionId;
    }

    /**
     * @notice Mark transaction as completed and release funds
     * @param transactionId The transaction to complete
     * @param resultURI IPFS URI containing execution results
     */
    function completeTransaction(bytes32 transactionId, string memory resultURI)
        external
        onlyPlatform
    {
        Transaction storage txn = transactions[transactionId];
        require(
            txn.status == TransactionStatus.Pending,
            "Transaction not pending"
        );

        txn.status = TransactionStatus.Completed;
        txn.resultURI = resultURI;

        // Calculate amounts
        uint256 platformFee = (txn.amount * platformFeePercent) / 100;
        uint256 creatorAmount = txn.amount - platformFee;

        // Add to creator's withdrawable balance
        creatorBalances[txn.creator] += creatorAmount;

        // Send platform fee
        (bool sent, ) = platformWallet.call{value: platformFee}("");
        require(sent, "Platform fee transfer failed");

        emit TransactionCompleted(transactionId, resultURI);
    }

    /**
     * @notice Refund a failed transaction
     * @param transactionId The transaction to refund
     * @param reason Reason for refund
     */
    function refundTransaction(bytes32 transactionId, string memory reason)
        external
        onlyPlatform
    {
        Transaction storage txn = transactions[transactionId];
        require(
            txn.status == TransactionStatus.Pending,
            "Transaction not pending"
        );

        txn.status = TransactionStatus.Refunded;

        // Refund full amount to buyer
        (bool sent, ) = txn.buyer.call{value: txn.amount}("");
        require(sent, "Refund transfer failed");

        emit TransactionRefunded(transactionId, reason);
    }

    /**
     * @notice Withdraw accumulated earnings
     */
    function withdrawEarnings() external nonReentrant {
        uint256 balance = creatorBalances[msg.sender];
        require(balance > 0, "No earnings to withdraw");

        creatorBalances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Withdrawal failed");

        emit EarningsWithdrawn(msg.sender, balance);
    }

    /**
     * @notice Get transaction details
     * @param transactionId Transaction to query
     */
    function getTransaction(bytes32 transactionId)
        external
        view
        returns (Transaction memory)
    {
        return transactions[transactionId];
    }

    /**
     * @notice Get user's transaction history
     * @param user User address
     */
    function getUserTransactions(address user)
        external
        view
        returns (bytes32[] memory)
    {
        return userTransactions[user];
    }

    /**
     * @notice Update platform fee (only platform)
     * @param newFeePercent New fee percentage (0-100)
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyPlatform {
        require(newFeePercent <= 20, "Fee too high (max 20%)");
        platformFeePercent = newFeePercent;
    }

    // ============ Admin Functions ============

    /**
     * @notice Pause the contract (only owner)
     * @dev Prevents new purchases during emergency
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

    /**
     * @notice Update platform wallet address (only owner)
     * @param newPlatformWallet New platform wallet address
     */
    function updatePlatformWallet(address newPlatformWallet) external onlyOwner {
        require(newPlatformWallet != address(0), "Invalid address");
        address oldWallet = platformWallet;
        platformWallet = newPlatformWallet;
        emit PlatformWalletUpdated(oldWallet, newPlatformWallet);
    }

    // Events for admin actions
    event EmergencyPause(
        address indexed by,
        string reason,
        uint256 timestamp
    );

    event PlatformWalletUpdated(
        address indexed oldWallet,
        address indexed newWallet
    );
}
