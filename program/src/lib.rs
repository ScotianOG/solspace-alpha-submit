use anchor_lang::prelude::*;

declare_id!("9C2HRbrbvf3baZ8vXhQgiDjJRU1K6JoxUSBhpQsuPW3");

#[program]
pub mod solspace {
    use super::*;

    // Initialize the program with a platform state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = ctx.accounts.authority.key();
        counter.count = 0;
        counter.viral_posts_minted = 0;
        counter.viral_posts_claimed = 0;
        
        msg!("Counter initialized with explicit space: {} bytes", Counter::SPACE);
        Ok(())
    }

    // Mint a new viral post NFT
    pub fn mint_viral_post(ctx: Context<MintViralPost>, content_id: String, author_id: String) -> Result<()> {
        // Optionally increment the counter if it exists
        if let Some(counter) = ctx.accounts.counter.as_mut() {
            counter.viral_posts_minted += 1;
            msg!("Total minted: {}", counter.viral_posts_minted);
        } else {
            msg!("No counter account provided - stats will not be tracked");
        }
        
        let viral_post = &mut ctx.accounts.viral_post;
        viral_post.authority = ctx.accounts.authority.key();
        viral_post.content_id = content_id;
        viral_post.author_id = author_id;
        viral_post.created_at = Clock::get()?.unix_timestamp;
        viral_post.claimed = false;
        viral_post.tier = 1; // Start at tier 1 (Rising)
        
        msg!("Viral post minted with ID: {}", viral_post.content_id);
        msg!("Author ID: {}", viral_post.author_id);
        
        Ok(())
    }

    // Upgrade a viral post to a higher tier
    pub fn upgrade_tier(ctx: Context<UpgradeTier>, new_tier: u8) -> Result<()> {
        let viral_post = &mut ctx.accounts.viral_post;
        
        // Only allow upgrades, not downgrades
        require!(new_tier > viral_post.tier, ErrorCode::InvalidTierUpgrade);
        
        let old_tier = viral_post.tier;
        viral_post.tier = new_tier;
        viral_post.last_upgraded = Some(Clock::get()?.unix_timestamp);
        
        // Optionally update counter if it exists
        if let Some(counter) = ctx.accounts.counter.as_mut() {
            msg!("Counter updated for tier upgrade");
        }
        
        msg!("Viral post upgraded from tier {} to tier {}", old_tier, new_tier);
        
        Ok(())
    }
    
    // Claim a viral post NFT
    pub fn claim_viral_post(ctx: Context<ClaimViralPost>) -> Result<()> {
        let viral_post = &mut ctx.accounts.viral_post;
        
        // Ensure it's not already claimed
        require!(!viral_post.claimed, ErrorCode::AlreadyClaimed);
        
        // Mark as claimed
        viral_post.claimed = true;
        viral_post.claimed_at = Some(Clock::get()?.unix_timestamp);
        viral_post.claimer = Some(ctx.accounts.claimer.key());
        
        // Optionally increment claimed counter if it exists
        if let Some(counter) = ctx.accounts.counter.as_mut() {
            counter.viral_posts_claimed += 1;
            msg!("Total claimed: {}", counter.viral_posts_claimed);
        } else {
            msg!("No counter account provided - claim stats will not be tracked");
        }
        
        msg!("Viral post claimed by: {}", ctx.accounts.claimer.key());
        
        Ok(())
    }
}


#[account]
pub struct Counter {
    pub authority: Pubkey,    // 32 bytes
    pub count: u64,           // 8 bytes
    pub viral_posts_minted: u64, // 8 bytes
    pub viral_posts_claimed: u64, // 8 bytes
}

impl Counter {
    pub const SPACE: usize = 8 + // discriminator
                            32 + // authority: Pubkey
                            8 +  // count: u64
                            8 +  // viral_posts_minted: u64
                            8;   // viral_posts_claimed: u64
}

#[account]
pub struct ViralPost {
    pub authority: Pubkey,
    pub content_id: String,
    pub author_id: String,
    pub created_at: i64,
    pub tier: u8,
    pub claimed: bool,
    pub claimed_at: Option<i64>,
    pub last_upgraded: Option<i64>,
    pub claimer: Option<Pubkey>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = Counter::SPACE,
    )]
    pub counter: Account<'info, Counter>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintViralPost<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    // Make counter optional
    #[account(mut)]
    pub counter: Option<Account<'info, Counter>>,
    
    // Discriminator (8) + authority pubkey (32) + contentId string (4+256) + 
    // authorId string (4+256) + created_at (8) + tier (1) + claimed (1) + 
    // claimed_at option (1+8) + last_upgraded option (1+8) + claimer option (1+32)
    #[account(init, payer = authority, space = 8 + 32 + (4+256) + (4+256) + 8 + 1 + 1 + (1+8) + (1+8) + (1+32))]
    pub viral_post: Account<'info, ViralPost>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpgradeTier<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    // Make counter optional
    #[account(mut)]
    pub counter: Option<Account<'info, Counter>>,
    
    #[account(mut, constraint = viral_post.authority == authority.key())]
    pub viral_post: Account<'info, ViralPost>,
}

#[derive(Accounts)]
pub struct ClaimViralPost<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,
    
    // Make counter optional
    #[account(mut)]
    pub counter: Option<Account<'info, Counter>>,
    
    #[account(mut)]
    pub viral_post: Account<'info, ViralPost>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Cannot downgrade tier")]
    InvalidTierUpgrade,
    
    #[msg("Post already claimed")]
    AlreadyClaimed,
}
