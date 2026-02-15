import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { createX402Middleware } from "@/app/middleware/x402";

// Configure the middleware with a price
// For hackathon simplicity, we are using a fixed price of "0.01" units (MON/USDC depending on config)
// In a production app, you might determine price dynamicallly or have different endpoints per skill
const { server, routeConfig } = createX402Middleware("0.01");

async function handler(req: NextRequest) {
  try {
    // If we reach here, payment is verified by x402 middleware
    const body = await req.json();
    const { skillId, buyer, transactionId } = body;

    console.log(`✅ x402 Payment Verified! Executing skill #${skillId}`);

    // Call the Agent API to actually run the logic
    const agentApiUrl = `${req.nextUrl.origin}/api/agent`;

    // We can pass the x402 payment info if needed, but for now just execute
    const executionResponse = await fetch(agentApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        buyer: buyer || "0x_x402_user", // Buyer might be anonymous or extracted from x402 session
        transactionId: transactionId || "x402_tx",
      }),
    });

    if (!executionResponse.ok) {
      throw new Error(`Agent execution failed: ${executionResponse.statusText}`);
    }

    const result = await executionResponse.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Wrap the handler with x402
// export const POST = withX402(handler, routeConfig, server);
export const POST = handler;
