'use client';

import { useReadContract, useAccount } from 'wagmi';
import { SkillRegistryABI } from '../contracts';
import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { monadTestnet } from 'viem/chains';

interface SkillWithMetadata {
  skillId: bigint;
  name: string;
  description: string;
  category: string;
  creator: string;
  pricePerUse: bigint;
  isActive: boolean;
  totalCalls: bigint;
  metadataURI: string;
}

/**
 * Hook to fetch skills created by the connected wallet with metadata
 */
export function useMySkills() {
  const { address } = useAccount();
  const [skills, setSkills] = useState<SkillWithMetadata[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  console.log('🔍 useMySkills - Connected address:', address);

  const { data: mySkillIds, isLoading, error, refetch } = useReadContract({
    address: SkillRegistryABI.contractAddress as `0x${string}`,
    abi: SkillRegistryABI.abi,
    functionName: 'getSkillsByCreator',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  console.log('📋 useMySkills - Skill IDs from blockchain:', mySkillIds);
  console.log('⏳ useMySkills - Loading state:', isLoading);
  console.log('❌ useMySkills - Error:', error);

  // Fetch full skill details for each skill ID
  useEffect(() => {
    async function fetchSkillsWithMetadata() {
      console.log('🚀 Starting fetchSkillsWithMetadata...');
      console.log('📊 mySkillIds:', mySkillIds);
      console.log('📊 Is array?', Array.isArray(mySkillIds));
      console.log('📊 Length:', mySkillIds?.length);

      if (!mySkillIds || !Array.isArray(mySkillIds) || (mySkillIds as any[]).length === 0) {
        console.log('⚠️ No skill IDs found, setting empty array');
        setSkills([]);
        return;
      }

      setIsLoadingMetadata(true);
      console.log('⏳ Loading metadata for', mySkillIds.length, 'skills');

      try {
        // Create public client for direct blockchain reads
        console.log('🔗 Creating public client...');
        console.log('🔗 RPC URL:', process.env.NEXT_PUBLIC_MONAD_RPC_URL);
        console.log('🔗 Contract address:', SkillRegistryABI.contractAddress);

        const publicClient = createPublicClient({
          chain: monadTestnet,
          transport: http(process.env.NEXT_PUBLIC_MONAD_RPC_URL),
        });
        console.log('✅ Public client created');

        const skillPromises = (mySkillIds as bigint[]).map(async (skillId, index) => {
          console.log(`\n🔄 [${index + 1}/${mySkillIds.length}] Fetching skill #${skillId}...`);

          try {
            // Fetch skill data directly from blockchain (no backend route!)
            console.log(`📡 Reading contract for skill #${skillId}...`);
            const skillData = await publicClient.readContract({
              address: SkillRegistryABI.contractAddress as `0x${string}`,
              abi: SkillRegistryABI.abi,
              functionName: 'getSkill',
              args: [BigInt(skillId)],
            });

            console.log(`✅ Raw skill data for #${skillId}:`, skillData);
            console.log(`📊 Type of skillData:`, typeof skillData);
            console.log(`📊 Is array?`, Array.isArray(skillData));
            console.log(`📊 skillData keys:`, Object.keys(skillData || {}));

            // Handle both array and object formats
            let id, creator, pricePerUse, metadataURI, isActive, totalCalls;

            if (Array.isArray(skillData)) {
              [id, creator, pricePerUse, metadataURI, isActive, totalCalls] = skillData;
            } else if (typeof skillData === 'object' && skillData !== null) {
              // Handle object format
              const data = skillData as any;
              id = data.skillId || data[0];
              creator = data.creator || data[1];
              pricePerUse = data.pricePerUse || data[2];
              metadataURI = data.metadataURI || data[3];
              isActive = data.isActive || data[4];
              totalCalls = data.totalCalls || data[5];
            } else {
              throw new Error('Unexpected skillData format');
            }

            console.log(`📋 Parsed - ID: ${id}, Creator: ${creator}, Price: ${pricePerUse}, Active: ${isActive}, URI: ${metadataURI}`);

            // Fetch metadata from URI
            let metadata = {
              name: `Skill #${skillId}`,
              description: metadataURI || '',
              category: 'General',
            };

            if (metadataURI) {
              console.log(`📦 Fetching metadata from: ${metadataURI}`);
              try {
                // Convert IPFS URI to gateway URL
                let metadataUrl = metadataURI;
                if (metadataUrl.startsWith('ipfs://')) {
                  const hash = metadataUrl.replace('ipfs://', '');
                  metadataUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
                  console.log(`🔄 Converted IPFS to gateway: ${metadataUrl}`);
                }

                const metadataResponse = await fetch(metadataUrl);
                console.log(`📥 Metadata response status: ${metadataResponse.status}`);

                if (metadataResponse.ok) {
                  metadata = await metadataResponse.json();
                  console.log(`✅ Metadata loaded:`, metadata);
                } else {
                  console.warn(`⚠️ Failed to fetch metadata: ${metadataResponse.statusText}`);
                }
              } catch (metadataError) {
                console.error(`❌ Metadata fetch error for skill #${skillId}:`, metadataError);
              }
            } else {
              console.log(`⚠️ No metadata URI for skill #${skillId}`);
            }

            const skillWithMetadata = {
              skillId: BigInt(skillId),
              name: metadata.name,
              description: metadata.description,
              category: metadata.category,
              creator: creator || '0x0',
              pricePerUse: pricePerUse || 0n,
              isActive: isActive ?? true,
              totalCalls: totalCalls || 0n,
              metadataURI: metadataURI || '',
            };

            console.log(`✅ Skill #${skillId} processed:`, skillWithMetadata);
            return skillWithMetadata;
          } catch (error) {
            console.error(`❌ Failed to fetch skill ${skillId}:`, error);
            return null;
          }
        });

        console.log('⏳ Waiting for all skills to be fetched...');
        const fetchedSkills = await Promise.all(skillPromises);
        console.log('📊 Raw fetched skills:', fetchedSkills);

        const validSkills = fetchedSkills.filter((s): s is SkillWithMetadata => s !== null);
        console.log('✅ Valid skills after filtering:', validSkills);

        setSkills(validSkills);
        console.log('💾 Skills set in state:', validSkills.length, 'skills');
      } catch (error) {
        console.error('❌ Failed to fetch skills with metadata:', error);
      } finally {
        setIsLoadingMetadata(false);
        console.log('✅ Metadata loading complete');
      }
    }

    fetchSkillsWithMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySkillIds?.length, mySkillIds?.[0]?.toString()]); // Track length and first ID

  console.log('📤 useMySkills returning:', {
    skillIds: mySkillIds,
    skills,
    skillsCount: skills.length,
    isLoading: isLoading || isLoadingMetadata,
    error,
  });

  return {
    skillIds: mySkillIds as bigint[] | undefined,
    skills,
    isLoading: isLoading || isLoadingMetadata,
    error,
    refetch,
  };
}
