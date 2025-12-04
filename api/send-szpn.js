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
    const rpcUrl = process.env.BSC_RPC_URL;
    const SZPN = process.env.SZPN_TOKEN;

    return res.status(200).json({
      status: "DRY_RUN",
      senderId,
      to,
      amount,
      hasPrivateKey: !!privateKey,
      hasRpcUrl: !!rpcUrl,
      hasSzpn: !!SZPN
    });

  } catch (err) {
    return res.status(500).json({ status: "ERROR", error: String(err) });
  }
}
