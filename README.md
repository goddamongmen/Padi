# Padi - Crypto GoFundMe

## Project Overview

Padi is a decentralized crowdfunding platform, likened to a "crypto GoFundMe," built on the 
Neutron blockchain within the Cosmos ecosystem. It enables anyone to create a rally 
(a fundraising campaign), allows others to support it with native tokens or CW20 tokens, and 
permits creators to claim proceeds after the rally period ends. Supporters can also provide 
feedback, fostering community engagement and transparency. Designed to leverage Neutron’s 
secure and scalable infrastructure, Padi reimagines crowdfunding with blockchain efficiency and 
trustlessness.

The source code is available at https://github.com/cenwadike/Padi, and a live demo can be accessed
at https://padi-lake.vercel.app/. Developed for the Naija HackATOM, Padi showcases how Cosmos 
technologies can power innovative financial applications.

## Key Features

- Create rallies for crowdfunding campaigns.
- Support rallies with native Neutron tokens or CW20 tokens.
- Claim proceeds after the rally period concludes.
- Provide feedback as a supporter to enhance transparency.

## Technical Architecture

Padi is a dApp comprising a smart contract layer on Neutron and a web frontend, designed for 
seamless interaction with the Cosmos ecosystem. Below is its technical structure:

### Frontend

- Framework: Next.js (inferred from Vercel hosting), offering a responsive and user-friendly interface.
- Deployment: Hosted on Vercel at https://padi-lake.vercel.app/.
- Components:
    - Rally creation form.
    - Support interface for token contributions.
    - Claim and feedback submission features.
    - Wallet integration (e.g., Keplr) for transactions.

### Backend (Smart Contracts)

- Platform: Neutron blockchain, a Cosmos-based chain with CosmWasm support.
- Contracts:
    - Rally contract: Manages campaign creation, duration, and proceeds.
    - Token handling: Supports native Neutron tokens and CW20 tokens for contributions and payouts.
    - Feedback module: Stores supporter feedback on-chain.
    - Language: Rust, compiled to WebAssembly (Wasm) for CosmWasm execution.

## Data Flow

- User creates a rally via the frontend, specifying duration and token preferences.
- Supporters contribute native or CW20 tokens, recorded by the smart contract.
- After the rally period, the creator claims proceeds via a contract call.
- Supporters submit feedback, stored and accessible through the contract or UI.

## How it Leverages Cosmos Technologies

Padi harnesses Cosmos technologies through its deployment on Neutron, utilizing the ecosystem’s 
scalability and token standards:

1. Neutron Blockchain (Cosmos-Based)
- Use Case: Hosts Padi’s smart contracts, providing a secure and interoperable platform.
- Implementation: Leverages Neutron’s CosmWasm runtime for rally logic, token handling, and feedback.
- Benefit: Offers a neutral, developer-friendly chain with Cosmos ecosystem compatibility.

2. CosmWasm
- Use Case: Executes Padi’s smart contracts for rally management and token interactions.
- Implementation: Rust-based contracts support native and CW20 token contributions, claims, and feedback.
- Benefit: Enables secure, upgradeable, and programmable crowdfunding logic.

3. Cosmos Ecosystem Tokens
- Use Case: Supports native Neutron tokens and CW20 tokens for contributions.
- Implementation: Integrates CW20 standard for flexibility alongside Neutron’s native token (e.g., NTRN).
- Benefit: Broadens accessibility by supporting diverse Cosmos token types.

## Future Plans and Roadmap

Padi aims to expand its crowdfunding capabilities and deepen its Cosmos integration:

### Short-Term (Post-Hackathon, Q2 2025)

- UI Enhancements: Add real-time rally progress tracking and feedback display.
- Testing: Conduct security audits of smart contracts and test on Neutron testnet.
- Token Expansion: Support additional CW20 tokens from Cosmos chains.

### Medium-Term (Q3-Q4 2025)

- IBC Integration: Enable cross-chain contributions via Inter-Blockchain Communication (IBC).
- Governance: Add a feedback-based voting system for rally validation or disputes.
- Analytics: Provide supporters with contribution history and rally success metrics.

### Long-Term (2026 and Beyond)
- Multi-Chain Support: Deploy on additional Cosmos chains for broader reach.
- Reward System: Introduce a native token or incentives for active supporters.
- Ecosystem Partnerships: Collaborate with Cosmos projects to promote rallies and increase adoption.

## Getting Started
To explore or contribute to Padi, follow these steps:

### Prerequisites
- Rust: For compiling CosmWasm contracts.
- Node.js: For running the frontend.
- Neutron Wallet: Fund with testnet NTRN (e.g., via Keplr).

### Setup

- Clone the Repository:

```bash
git clone https://github.com/cenwadike/Padi.git
cd Padi
```

### Build Smart Contracts:

```bash
    cargo wasm
```

## Conclusion
Padi redefines crowdfunding by deploying a decentralized "crypto GoFundMe" on the Neutron blockchain, 
leveraging CosmWasm and Cosmos token standards. Its support for native and CW20 tokens, combined 
with rally creation and feedback features, showcases the power of Cosmos technologies in financial 
innovation. We’re excited to grow Padi and invite the Naija HackATOM community to join us!

Explore the project at https://github.com/cenwadike/Padi or try the demo at https://padi-lake.vercel.app/
