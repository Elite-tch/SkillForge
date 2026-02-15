'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SkillPaymentABI } from '../contracts';
import { parseEventLogs } from 'viem';

/**
 * Hook to handle skill purchasing with transaction tracking
 */
export function usePurchaseSkill() {
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined
  });

  const purchaseSkill = async (skillId: number, price: bigint) => {
    try {
      await writeContract({
        address: SkillPaymentABI.contractAddress as `0x${string}`,
        abi: SkillPaymentABI.abi,
        functionName: 'purchaseSkill',
        args: [BigInt(skillId)],
        value: price,
      });
    } catch (error) {
      console.error('Failed to purchase skill:', error);
      throw error;
    }
  };

  // Extract transaction ID from event logs when receipt is available
  useEffect(() => {
    if (receipt && isSuccess) {
      try {
        const logs = parseEventLogs({
          abi: SkillPaymentABI.abi,
          logs: (receipt as any).logs,
        });

        // Find the SkillPurchased event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const purchaseLog = logs.find((log: any) => log.eventName === 'SkillPurchased') as any;

        if (purchaseLog && purchaseLog.args) {
          // Safely extract transactionId from args
          const args = purchaseLog.args as { transactionId?: `0x${string}` | bigint;[key: string]: any };
          if (args.transactionId !== undefined) {
            setTransactionId(args.transactionId.toString());
          }
        }
      } catch (error) {
        console.error('Failed to parse event logs:', error);
      }
    }
  }, [receipt, isSuccess]);

  return {
    purchaseSkill,
    hash,
    transactionId,
    isPending: isWritePending || isConfirming,
    isSuccess,
    error: writeError || confirmError,
  };
}
