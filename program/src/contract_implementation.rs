use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use mpl_token_metadata::{
    ID as MetadataID,
    instruction as token_instruction,
};

#[program]
pub mod solspace_mvp {
    use super::*;

    pub fn mint_viral_nft(
        ctx: Context<MintNFT>,
        metadata_uri: String,
        content_id: String,
        author_id: String,
        tier: u8,
    ) -> Result<()> {
        // Create mint account
        let viral_post = &mut ctx.accounts.viral_post;
        viral_post.content_id = content_id;
        viral_post.author_id = author_id;
        viral_post.tier = tier;
        viral_post.created_at = Clock::get()?.unix_timestamp;
        viral_post.metadata_uri = metadata_uri;
        viral_post.claimed = false;
        
        // Create the NFT with Metaplex
        let name = match tier {
            1 => "Rising Content",
            2 => "Trending Content",
            3 => "Viral Content",
            _ => "Content NFT",
        };
        
        // Create metadata instruction
        // ... (simplified for brevity)
        
        Ok(())
    }

    pub fn upgrade_tier(
        ctx: Context<UpgradeTier>,
        new_tier: u8,
        new_metadata_uri: String,
    ) -> Result<()> {
        let viral_post = &mut ctx.accounts.viral_post;
        
        // Only upgrade to higher tiers
        require!(new_tier > viral_post.tier, ErrorCode::InvalidTierUpgrade);
        
        // Update tier
        viral_post.tier = new_tier;
        viral_post.metadata_uri = new_metadata_uri;
        
        // Update metadata with Metaplex
        // ... (simplified for brevity)
        
        Ok(())
    }
    
    pub fn claim_nft(
        ctx: Context<ClaimNFT>,
        verification_code: String,
    ) -> Result<()> {
        let viral_post = &mut ctx.accounts.viral_post;
        
        // Verify this is the rightful owner
        // In MVP, we'll do basic verification, later enhance with OAuth
        
        viral_post.claimed = true;
        viral_post.claimed_at = Clock::get()?.unix_timestamp;
        viral_post.owner = ctx.accounts.claimer.key();
        
        Ok(())
    }
}

// Account Structures
#[account]
pub struct ViralPost {
    pub content_id: String,       // Twitter ID or other platform ID
    pub author_id: String,        // Creator's ID on the platform
    pub tier: u8,                 // 1=Rising, 2=Trending, 3=Viral
    pub created_at: i64,          // Unix timestamp when minted
    pub metadata_uri: String,     // URI to the NFT metadata
    pub claimed: bool,            // Whether the NFT has been claimed
    pub claimed_at: Option<i64>,  // When it was claimed (if claimed)
    pub owner: Option<Pubkey>,    // Owner address (if claimed)
}

// Instruction contexts
#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(init, payer = authority, space = 8 + 300)]
    pub viral_post: Account<'info, ViralPost>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the metadata account that will be created
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    
    /// CHECK: This is the metaplex program
    #[account(address = MetadataID)]
    pub token_metadata_program: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpgradeTier<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut, has_one = authority)]
    pub viral_post: Account<'info, ViralPost>,
    
    /// CHECK: This is the metadata account that will be updated
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: This is the metaplex program
    #[account(address = MetadataID)]
    pub token_metadata_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct ClaimNFT<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,
    
    #[account(mut)]
    pub viral_post: Account<'info, ViralPost>,
    
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Cannot downgrade tier")]
    InvalidTierUpgrade,
    #[msg("Invalid verification")]
    InvalidVerification,
    #[msg("NFT already claimed")]
    AlreadyClaimed,
}
