import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { monadTestnet } from 'viem/chains';

// ABI fragment for the Registry
const REGISTRY_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_skillId", "type": "uint256" }],
    "name": "getSkill",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "skillId", "type": "uint256" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "uint256", "name": "pricePerUse", "type": "uint256" },
          { "internalType": "string", "name": "metadataURI", "type": "string" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "uint256", "name": "totalCalls", "type": "uint256" }
        ],
        "internalType": "struct ISkillRegistry.Skill",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skillId, buyer, transactionId, input } = body;

    console.log(`🤖 Agent: Processing request for skill #${skillId}`);

    // 1. Fetch Metadata from Blockchain
    const publicClient = createPublicClient({
      chain: monadTestnet,
      transport: http(process.env.NEXT_PUBLIC_MONAD_RPC_URL)
    });

    const registryAddress = process.env.NEXT_PUBLIC_SKILL_REGISTRY_ADDRESS as `0x${string}`;

    console.log(`🔗 Looking up skill metadata on-chain...`);
    const skillData = await publicClient.readContract({
      address: registryAddress,
      abi: REGISTRY_ABI,
      functionName: 'getSkill',
      args: [BigInt(skillId)]
    });

    // 2. Fetch Description from IPFS
    let metadataURI = skillData.metadataURI;
    if (metadataURI.startsWith('ipfs://')) {
      metadataURI = `https://ipfs.io/ipfs/${metadataURI.replace('ipfs://', '')}`;
    }

    console.log(`🌐 Fetching instructions from IPFS: ${metadataURI}`);
    const metaResponse = await fetch(metadataURI);
    const metadata = await metaResponse.json();

    const skillDescription = metadata.description || "You are a helpful assistant.";
    console.log(`📝 Instructions: "${skillDescription.substring(0, 50)}..."`);

    // 3. Execute logic (Using Gemini as the engine)
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is missing! Using simulated fallback.");
      // Fallback for demo if key isn't provided yet
      return NextResponse.json({
        success: false,
        message: `Missing API key`,
        data: {
          timestamp: new Date().toISOString(),
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log(`🧠 Executing skill logic with Gemini...`);

    const prompt = `
      You are an AI Agent execution engine for the SkillForge marketplace.
      Your task is to execute a specific "Skill" based on its official description.
      
      SKILL DESCRIPTION:
      "${skillDescription}"
      
      USER INPUT:
      "${input}"
      
      Perform the skill exactly as described. Return ONLY the direct result of the skill. 
      No conversational filler, no explanations. Just the output.
    `;

    const result = await model.generateContent(prompt);
    const resultOutput = result.response.text().trim();

    console.log(`✨ Skill Output: ${resultOutput.substring(0, 50)}...`);

    return NextResponse.json({
      success: true,
      message: `Skill #${skillId} executed via Gemini AI`,
      data: {
        timestamp: new Date().toISOString(),
        output: resultOutput,
        instructionsUsed: skillDescription,
        usage: {
          tokens: input?.length || 0,
          cost: "0.000001 MON"
        }
      }
    });

  } catch (error: any) {
    console.error('Agent Execution error:', error);
    return NextResponse.json(
      { error: `Failed to execute agent: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "SkillForge Agent API Ready" });
}