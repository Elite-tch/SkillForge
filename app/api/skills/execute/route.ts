import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { skillId, buyer, transactionId } = body;

    console.log(`🚀 Executing skill #${skillId}`);

    // Call the Agent API to actually run the logic
    const agentApiUrl = `${req.nextUrl.origin}/api/agent`;

    const executionResponse = await fetch(agentApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        buyer: buyer || "user",
        transactionId: transactionId || "direct_execution",
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

export const POST = handler;
