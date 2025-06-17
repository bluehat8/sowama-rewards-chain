require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

// Configuración de redes de Celo
const CELO_RPC_URL = process.env.CELO_RPC_URL || "https://forno.celo.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""; 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Red principal de Celo (Mainnet)
    celo: {
      url: CELO_RPC_URL,
      chainId: 42220,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 0.5 * 10**9, // 0.5 gwei
    },
    // Red de prueba Alfajores
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 0.5 * 10**9,
    },
    // Red de prueba Baklava (opcional)
    baklava: {
      url: "https://baklava-forno.celo-testnet.org",
      chainId: 62320,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 0.5 * 10**9,
    },
    // Red local para pruebas
    hardhat: {
      chainId: 1337,
    },
  },
  // Configuración para verificación en bloques exploradores
  etherscan: {
    apiKey: {
      alfajores: process.env.CELOSCAN_API_KEY || "",
      celo: process.env.CELOSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io"
        }
      },
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
