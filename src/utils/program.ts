import { SolspaceIDL } from '@/types/program';
import fs from 'fs';
import path from 'path';

/**
 * Gets a mock IDL that matches the SolspaceIDL interface
 */
function getMockIDL(): SolspaceIDL {
  return {
    version: "0.1.0",
    name: "solspace",
    instructions: [
      {
        name: "autoMintPost",
        accounts: [
          {
            name: "viralPost",
            isMut: true,
            isSigner: false,
          },
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          }
        ],
        args: [
          {
            name: "twitterId",
            type: "string",
          },
          {
            name: "metadataUri",
            type: "string",
          },
          {
            name: "metrics",
            type: {
              defined: "PostMetrics",
            },
          }
        ],
      },
      {
        name: "claimNft",
        accounts: [
          {
            name: "viralPost",
            isMut: true,
            isSigner: false,
          },
          {
            name: "recipient",
            isMut: true,
            isSigner: true,
          }
        ],
        args: [],
      },
      {
        name: "checkTierUpgrade",
        accounts: [
          {
            name: "viralPost",
            isMut: true,
            isSigner: false,
          },
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          }
        ],
        args: [
          {
            name: "metrics",
            type: {
              defined: "PostMetrics",
            },
          }
        ],
      },
      {
        name: "updateMetadata",
        accounts: [
          {
            name: "viralPost",
            isMut: true,
            isSigner: false,
          },
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          }
        ],
        args: [
          {
            name: "metadataUri",
            type: "string",
          }
        ],
      }
    ],
    accounts: [
      {
        name: "viralPost",
        type: {
          kind: "struct",
          fields: [
            {
              name: "authorId",
              type: "string",
            },
            {
              name: "twitterId",
              type: "string",
            },
            {
              name: "metadataUri",
              type: "string",
            },
            {
              name: "currentTier",
              type: "u8",
            },
            {
              name: "highestTier",
              type: "u8",
            },
            {
              name: "claimed",
              type: "bool",
            },
            {
              name: "recipient",
              type: "publicKey",
              optional: true,
            }
          ],
        },
      }
    ],
    types: [
      {
        name: "PostMetrics",
        type: {
          kind: "struct",
          fields: [
            {
              name: "likes",
              type: "u64",
            },
            {
              name: "retweets",
              type: "u64",
            },
            {
              name: "replies",
              type: "u64",
            },
            {
              name: "quote_tweets",
              type: "u64",
            }
          ],
        },
      }
    ],
    metadata: {
      address: "9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3"
    },
    errors: []
  };
}

/**
 * Loads the Solspace IDL from the specified path or uses a mocked version in a build environment.
 */
export function loadSolspaceIDL(): SolspaceIDL {
  // In a build environment (like Netlify), we can't access the compiled IDL
  if (process.env.NODE_ENV === 'production' || process.env.NETLIFY) {
    // Use a mock IDL to avoid file system access in build environment
    return getMockIDL();
  }

  try {
    // Try first with the target/idl path (local development)
    const idlPath = path.join(process.cwd(), 'target', 'idl', 'solspace.json');
    if (fs.existsSync(idlPath)) {
      const idlContent = fs.readFileSync(idlPath, 'utf-8');
      return JSON.parse(idlContent) as SolspaceIDL;
    }

    // Try with program/target/idl path as fallback
    const programIdlPath = path.join(process.cwd(), 'program', 'target', 'idl', 'solspace.json');
    if (fs.existsSync(programIdlPath)) {
      const idlContent = fs.readFileSync(programIdlPath, 'utf-8');
      return JSON.parse(idlContent) as SolspaceIDL;
    }

    // If all attempts fail, use a mock version
    console.warn('Could not load Solspace IDL from file, using mock version');
    return getMockIDL();
  } catch (error) {
    console.error('Error loading Solspace IDL:', error);
    // Return a mock version
    return getMockIDL();
  }
}
