// src/types/twitter-api.d.ts
import type { ExtendedTweetV2 } from "./index";

declare module "twitter-api-v2" {
  export class TwitterApi {
    constructor(apiKey: string);

    v2: {
      users(authorId: string): unknown;
      search(
        query: string,
        options?: {
          "tweet.fields"?: string[];
          expansions?: string[];
          "user.fields"?: string[];
          max_results?: number;
        }
      ): Promise<{
        rateLimit: {
        limit: number;
        remaining: number;
        reset: number;
      };
        data: ExtendedTweetV2[];
      }>;

      singleTweet(
        id: string,
        options?: {
          "tweet.fields"?: string[];
          expansions?: string[];
          "user.fields"?: string[];
        }
      ): Promise<{
        data: ExtendedTweetV2;
      }>;

      sendDmToParticipant(
        userId: string,
        message: { text: string }
      ): Promise<unknown>;

      trendingTopics(): Promise<unknown>;
    };
  }
}
