import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { SkillRegistryABI } from '../contracts';

export interface SkillWithMetadata {
  skillId: bigint;
  name: string;
  description: string;
  category: string;
  creator: string;
  pricePerUse: bigint;
  isActive: boolean;
  totalCalls: bigint;
  metadataURI: string;
  image?: string;
  tags: string[];
}

/**
 * Hook to fetch all skills from the blockchain and resolve their metadata
 */
export function useSkills() {
  const [skills, setSkills] = useState<SkillWithMetadata[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const { data: rawSkills, isLoading: isContractLoading, error, refetch } = useReadContract({
    address: SkillRegistryABI.contractAddress as `0x${string}`,
    abi: SkillRegistryABI.abi,
    functionName: 'getAllSkills',
    query: {
      // refetchInterval: 10000, // Refresh every 10 seconds
    },
  });

  // Fetch metadata for all skills
  useEffect(() => {
    async function fetchMetadata() {
      if (!rawSkills || !Array.isArray(rawSkills) || rawSkills.length === 0) {
        setSkills([]);
        return;
      }

      setIsLoadingMetadata(true);
      console.log('⏳ useSkills - Loading metadata for', rawSkills.length, 'skills');

      try {
        const skillPromises = rawSkills.map(async (skillData: any) => {
          try {
            // Handle different return formats (array vs object)
            let id, creator, pricePerUse, metadataURI, isActive, totalCalls;

            if (Array.isArray(skillData)) {
              [id, creator, pricePerUse, metadataURI, isActive, totalCalls] = skillData;
            } else {
              id = skillData.skillId;
              creator = skillData.creator;
              pricePerUse = skillData.pricePerUse;
              metadataURI = skillData.metadataURI;
              isActive = skillData.isActive;
              totalCalls = skillData.totalCalls;
            }

            const skillId = BigInt(id);

            // Default metadata
            let metadata = {
              name: `Skill #${skillId}`,
              description: 'No description available',
              category: 'General',
              image: '',
              tags: [] as string[]
            };

            // Fetch metadata if URI exists
            if (metadataURI && metadataURI.length > 0) {
              try {
                // Convert IPFS URI to gateway URL
                let metadataUrl = metadataURI;
                if (metadataUrl.startsWith('ipfs://')) {
                  const hash = metadataUrl.replace('ipfs://', '');
                  metadataUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
                }

                const response = await fetch(metadataUrl);
                if (response.ok) {
                  const json = await response.json();
                  metadata = { ...metadata, ...json };
                }
              } catch (err) {
                console.warn(`Failed to fetch metadata for skill ${skillId}:`, err);
              }
            }

            return {
              skillId,
              creator,
              pricePerUse,
              isActive,
              totalCalls,
              metadataURI,
              ...metadata
            } as SkillWithMetadata;

          } catch (err) {
            console.error('Error processing skill data:', err);
            return null; // Filter out failed items
          }
        });

        const results = await Promise.all(skillPromises);
        const validSkills = results.filter((s): s is SkillWithMetadata => s !== null);

        // Sort by ID descending (newest first)
        validSkills.sort((a, b) => Number(b.skillId - a.skillId));

        setSkills(validSkills);
        console.log('✅ useSkills - Loaded', validSkills.length, 'skills with metadata');

      } catch (err) {
        console.error('Error in fetchMetadata:', err);
      } finally {
        setIsLoadingMetadata(false);
      }
    }

    fetchMetadata();
  }, [rawSkills]);

  return {
    skills,
    isLoading: isContractLoading || isLoadingMetadata,
    error,
    refetch,
  };
}

/**
 * Hook to fetch a single skill by ID
 */
export function useSkill(skillId: number | undefined) {
  const { data: skill, isLoading, error } = useReadContract({
    address: SkillRegistryABI.contractAddress as `0x${string}`,
    abi: SkillRegistryABI.abi,
    functionName: 'getSkill',
    args: skillId !== undefined ? [BigInt(skillId)] : undefined,
    query: {
      enabled: skillId !== undefined,
    }
  });

  return {
    skill,
    isLoading,
    error,
  };
}

/**
 * Hook to get total number of skills
 */
export function useTotalSkills() {
  const { data: total } = useReadContract({
    address: SkillRegistryABI.contractAddress as `0x${string}`,
    abi: SkillRegistryABI.abi,
    functionName: 'getTotalSkills',
  });

  return {
    totalSkills: total ? Number(total) : 0,
  };
}
