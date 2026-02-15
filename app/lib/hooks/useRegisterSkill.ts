'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SkillRegistryABI } from '../contracts';
import { parseEther } from 'viem';

/**
 * Hook to register new skills on the blockchain
 */
export function useRegisterSkill() {
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
  } = useWaitForTransactionReceipt({ hash });

  const registerSkill = async (priceInMON: string, metadataURI: string) => {
    if (!priceInMON || parseFloat(priceInMON) <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (!metadataURI) {
      throw new Error('Metadata URI is required');
    }

    const priceInWei = parseEther(priceInMON);

    await writeContract({
      address: SkillRegistryABI.contractAddress as `0x${string}`,
      abi: SkillRegistryABI.abi,
      functionName: 'registerSkill',
      args: [priceInWei, metadataURI],
    });
  };

  return {
    registerSkill,
    hash,
    receipt,
    isPending: isWritePending || isConfirming,
    isSuccess,
    error: writeError || confirmError,
  };
}
