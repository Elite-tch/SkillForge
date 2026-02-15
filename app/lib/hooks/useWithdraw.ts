'use client';

import { useEffect } from 'react';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SkillPaymentABI } from '../contracts';
import { formatEther } from 'viem';

/**
 * Hook to manage creator earnings (check balance and withdraw)
 */
export function useWithdraw() {
  const { address } = useAccount();

  // Get creator's earnings balance
  const { data: balance, refetch } = useReadContract({
    address: SkillPaymentABI.contractAddress as `0x${string}`,
    abi: SkillPaymentABI.abi,
    functionName: 'creatorBalances',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    }
  });

  // Withdraw hook
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash });

  const withdraw = async () => {
    if (!address) {
      throw new Error('No wallet connected');
    }

    if (!balance || balance === BigInt(0)) {
      throw new Error('No balance to withdraw');
    }

    await writeContract({
      address: SkillPaymentABI.contractAddress as `0x${string}`,
      abi: SkillPaymentABI.abi,
      functionName: 'withdrawEarnings',
    });
  };

  // Refetch balance after successful withdrawal
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  return {
    balance: balance || BigInt(0),
    balanceFormatted: balance ? formatEther(balance) : '0',
    withdraw,
    isPending: isWritePending || isConfirming,
    isSuccess,
    error: writeError || confirmError,
    refetch,
  };
}
