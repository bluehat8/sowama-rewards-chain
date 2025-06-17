// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenToken is ERC20, Ownable {
    constructor() ERC20("SOWAMA", "SOWA") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}

contract GreenRewards is Ownable {
    struct User {
        uint256 balance;
        uint256 totalWasteDelivered; 
        uint256 totalRewardsEarned; 
        bool isRegistered;
    }

    struct WasteDelivery {
        address user;
        uint256 amount; 
        uint256 timestamp;
        string wasteType; 
        bool processed;
    }

    struct MarketItem {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 stock;
        bool active;
    }

    mapping(address => User) public users;
    mapping(uint256 => WasteDelivery) public wasteDeliveries;
    mapping(uint256 => MarketItem) public marketItems;
    
    uint256 public deliveryCounter;
    uint256 public itemCounter;
    
    // Token ERC20 para las recompensas
    GreenToken public greenToken;
    
    event UserRegistered(address indexed user);
    event WasteDelivered(address indexed user, uint256 deliveryId, uint256 amount, string wasteType);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ItemPurchased(address indexed buyer, uint256 itemId, uint256 quantity);
    event MarketItemAdded(uint256 itemId, string name, uint256 price);
    event MarketItemUpdated(uint256 itemId, uint256 newPrice, uint256 newStock);
    
    constructor() Ownable(msg.sender) {
        greenToken = new GreenToken();
        greenToken.transferOwnership(address(this));
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    
    function register() external {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            balance: 0,
            totalWasteDelivered: 0,
            totalRewardsEarned: 0,
            isRegistered: true
        });
        
        emit UserRegistered(msg.sender);
    }
    
    function deliverWaste(uint256 _amount, string memory _wasteType) external onlyRegistered {
        require(_amount > 0, "Amount must be greater than 0");
        
        uint256 deliveryId = deliveryCounter++;
        wasteDeliveries[deliveryId] = WasteDelivery({
            user: msg.sender,
            amount: _amount,
            timestamp: block.timestamp,
            wasteType: _wasteType,
            processed: false
        });
        
        _processDelivery(deliveryId);
        
        emit WasteDelivered(msg.sender, deliveryId, _amount, _wasteType);
    }
    
    function claimRewards() external onlyRegistered {
        uint256 amount = users[msg.sender].balance;
        require(amount > 0, "No rewards to claim");
        
        users[msg.sender].balance = 0;
        greenToken.transfer(msg.sender, amount);
        
        emit RewardsClaimed(msg.sender, amount);
    }
    
    // Comprar un artículo del marketplace
    function purchaseItem(uint256 _itemId, uint256 _quantity) external onlyRegistered {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(marketItems[_itemId].active, "Item not available");
        require(marketItems[_itemId].stock >= _quantity, "Not enough stock");
        
        uint256 totalPrice = marketItems[_itemId].price * _quantity;
        
        require(greenToken.balanceOf(msg.sender) >= totalPrice, "Insufficient balance");
        
        require(greenToken.transferFrom(msg.sender, address(this), totalPrice), "Token transfer failed");
        
        marketItems[_itemId].stock -= _quantity;
        
        emit ItemPurchased(msg.sender, _itemId, _quantity);
    }
    
    // Funciones del propietario
    
    function addMarketItem(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _stock
    ) external onlyOwner {
        uint256 itemId = itemCounter++;
        marketItems[itemId] = MarketItem({
            id: itemId,
            name: _name,
            description: _description,
            price: _price,
            stock: _stock,
            active: true
        });
        
        emit MarketItemAdded(itemId, _name, _price);
    }
    
    // Actualizar un artículo del marketplace
    function updateMarketItem(
        uint256 _itemId,
        uint256 _newPrice,
        uint256 _newStock,
        bool _active
    ) external onlyOwner {
        require(marketItems[_itemId].id == _itemId, "Item does not exist");
        
        marketItems[_itemId].price = _newPrice;
        marketItems[_itemId].stock = _newStock;
        marketItems[_itemId].active = _active;
        
        emit MarketItemUpdated(_itemId, _newPrice, _newStock);
    }
    
    // Funciones internas
    
    // Procesar una entrega de residuos y otorgar recompensas
    function _processDelivery(uint256 _deliveryId) internal {
        WasteDelivery storage delivery = wasteDeliveries[_deliveryId];
        require(!delivery.processed, "Delivery already processed");
        
        // Marcar como procesada
        delivery.processed = true;
        
        // Actualizar estadísticas del usuario
        User storage user = users[delivery.user];
        user.totalWasteDelivered += delivery.amount;
        
        uint256 reward = delivery.amount * (10 ** greenToken.decimals());
        
        user.balance += reward;
        user.totalRewardsEarned += reward;
    }
    
    function processDeliveryAdmin(uint256 _deliveryId) external onlyOwner {
        _processDelivery(_deliveryId);
    }
    
    // Función para retirar fondos del contrato (tokens)
    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(greenToken.balanceOf(address(this)) >= _amount, "Insufficient balance");
        greenToken.transfer(owner(), _amount);
    }
}
