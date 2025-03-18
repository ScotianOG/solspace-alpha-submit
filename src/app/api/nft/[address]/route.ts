import { NextRequest, NextResponse } from "next/server";
import { api } from "@/services/api";

export async function GET(
  request: NextRequest,
  context: unknown
) {
  const { params } = context as { params: { address: string } };
  try {
    const nftAddress = params.address;

    if (!nftAddress) {
      return NextResponse.json(
        { error: "NFT address is required" },
        { status: 400 }
      );
    }

    const nftDetails = await api.getNFTDetails(nftAddress);

    return NextResponse.json(nftDetails);
  } catch (error) {
    console.error("Error fetching NFT details:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFT details" },
      { status: 500 }
    );
  }
}
