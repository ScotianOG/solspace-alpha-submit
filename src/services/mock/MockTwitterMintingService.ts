interface Post {
  id: string;
  author: string;
}

export class MockTwitterMintingService {
  async mintPost(post: Post) {
    // Simulate minting delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return `mock-nft-address-${post.id}`;
  }

  async notifyCreator(post: Post, nftAddress: string) {
    console.log(
      `Mock notification sent to ${post.author} for NFT ${nftAddress}`
    );
  }
}
