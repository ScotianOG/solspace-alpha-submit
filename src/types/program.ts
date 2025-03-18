import { PublicKey } from '@solana/web3.js';

export interface ViralPost {
  authorId: string;
  twitterId: string;
  metadataUri: string;
  currentTier: number;
  highestTier: number;
  claimed: boolean;
  recipient?: PublicKey;
}

import { Idl } from '@project-serum/anchor';

export interface SolspaceIDL extends Idl {
  version: "0.1.0";
  name: "solspace";
  instructions: [
    {
      name: "autoMintPost";
      accounts: [
        {
          name: "viralPost";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "twitterId";
          type: "string";
        },
        {
          name: "metadataUri";
          type: "string";
        },
        {
          name: "metrics";
          type: {
            defined: "PostMetrics";
          };
        }
      ];
    },
    {
      name: "claimNft";
      accounts: [
        {
          name: "viralPost";
          isMut: true;
          isSigner: false;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "checkTierUpgrade";
      accounts: [
        {
          name: "viralPost";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "metrics";
          type: {
            defined: "PostMetrics";
          };
        }
      ];
    },
    {
      name: "updateMetadata";
      accounts: [
        {
          name: "viralPost";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "metadataUri";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "viralPost";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authorId";
            type: "string";
          },
          {
            name: "twitterId";
            type: "string";
          },
          {
            name: "metadataUri";
            type: "string";
          },
          {
            name: "currentTier";
            type: "u8";
          },
          {
            name: "highestTier";
            type: "u8";
          },
          {
            name: "claimed";
            type: "bool";
          },
          {
            name: "recipient";
            type: "publicKey";
            optional: true;
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "PostMetrics";
      type: {
        kind: "struct";
        fields: [
          {
            name: "likes";
            type: "u64";
          },
          {
            name: "retweets";
            type: "u64";
          },
          {
            name: "replies";
            type: "u64";
          },
          {
            name: "quote_tweets";
            type: "u64";
          }
        ];
      };
    }
  ];
}
