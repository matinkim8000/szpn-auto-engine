import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { senderId, to, amount } = req.body || {};

    if (!senderId || !to || !amount) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const envKey = `PK_${senderId}`;
    const privateKey = process.env[envKey];

    if (!privateKey) {
      return res.status(400).json({ error: `Private key not found: ${envKey}` });
    }

    const rpcUrl = process.env.BSC_RPC_URL;
    const token = process.env.SZPN_TOKEN;

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const abi = ["function transfer(address to, uint256 amount) external returns (bool)"];
    const contract = new ethers.Contract(token, abi, wallet);

    const value = ethers.parseUnits(String(amount), 18);

    const tx = await contract.transfer(to, value);
    const receipt = await tx.wait();

    return res.status(200).json({
      status: "OK",
      from: wallet.address,
      to,
      amount,
      txHash: tx.hash,
      block: receipt.blockNumber
    });

  } catch (err) {
    return res.status(500).json({ status: "ERROR", error: String(err) });
  }
}

// trigger deploy

