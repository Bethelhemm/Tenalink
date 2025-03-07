# Tenalink
# Blockchain-Based Public Healthcare & Medical Records System

## Overview
A **Blockchain-Based Public Healthcare & Medical Records System** is a decentralized solution designed to improve healthcare infrastructure, securely store patient records, and enhance accessibility to medical history. This system leverages Solana's high-speed and low-cost blockchain network, built using Rust, to ensure data integrity, privacy, and secure sharing of medical information among authorized healthcare providers.

## Key Features
- **Decentralized Storage**: Medical records are securely stored and accessed on the blockchain.
- **Privacy & Security**: Patient data is encrypted, ensuring only authorized access.
- **Interoperability**: Enables seamless sharing of medical history among hospitals and healthcare providers.
- **Immutable Records**: Prevents unauthorized tampering and ensures data integrity.
- **Fast & Cost-Efficient**: Utilizes Solana’s high-performance blockchain for real-time data access with low transaction costs.
- **Role-Based Access Control (RBAC)**: Patients, doctors, and hospitals have different permission levels.

## Technologies Used
- **Blockchain Platform**: Solana
- **Programming Language**: Rust
- **Smart Contracts**: Solana Program Library (SPL)
- **Database**: Decentralized storage solutions (IPFS or Arweave)
- **Authentication**: Public and private key cryptography

## Installation & Setup
### Prerequisites
- Install Rust and Cargo: [Rust Installation Guide](https://www.rust-lang.org/tools/install)
- Install Solana CLI: [Solana Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools)
- Set up a Solana wallet: [Solana Wallet Guide](https://docs.solana.com/wallet-guide)

### Clone the Repository
```sh
 git clone https://github.com/your-username/blockchain-healthcare.git
 cd blockchain-healthcare
```

### Build & Deploy Smart Contract
```sh
cargo build-bpf --release
solana program deploy target/deploy/your_program.so
```

## Usage
1. **Register as a Patient or Healthcare Provider**
2. **Upload Medical Records** (encrypted and stored securely)
3. **Grant Access to Healthcare Providers**
4. **View & Update Records with Authorization**
5. **Ensure Data Integrity & Security**

## Contributors
- Bethelhem Gebeyehu(https://github.com/bethelhemm)
- Rediet Teklay (https://github.com/red095)


