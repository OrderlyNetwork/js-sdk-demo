"use client";
import {
  LeaderboardPage,
  CampaignConfig,
} from "@orderly.network/trading-leaderboard";
import { PathEnum } from "@/constant";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const leaderboardCampaigns: CampaignConfig[] = [
  // {
  //   campaign_id: '116',
  //   title: 'DAWN OF DOMINANCE',
  //   description: 'A new era begins. Outtrade the competition. Climb the ranks. Secure your legacy.',
  //   image: '/leaderboard/woofi_leaderboard_test.jpeg',
  //   start_time: new Date('2025-06-18T00:00:00Z').toISOString(),
  //   end_time: new Date('2025-07-04T23:59:59Z').toISOString(),
  //   reward_distribution_time: undefined,
  //   volume_scope: undefined,
  //   prize_pools: [
  //     {
  //       pool_id: 'trading',
  //       label: 'Trading volume pool',
  //       total_prize: 20000,
  //       currency: 'USDC',
  //       metric: 'volume' as const,
  //       tiers: [
  //         { position: 1, amount: 1400 },
  //         { position: 2, amount: 1200 },
  //         { position: 3, amount: 1000 },
  //         { position_range: [4, 5], amount: 750 },
  //         { position_range: [6, 10], amount: 440 },
  //         { position_range: [11, 15], amount: 340 },
  //         { position_range: [16, 25], amount: 275 },
  //         { position_range: [26, 50], amount: 180 },
  //         { position_range: [51, 75], amount: 75 },
  //         { position_range: [76, 100], amount: 50 },
  //         { position_range: [101, 125], amount: 25 },
  //       ],
  //     },
  //     {
  //       pool_id: 'raffle',
  //       label: 'Raffle',
  //       total_prize: 2500,
  //       currency: 'USDC',
  //       metric: 'volume' as const,
  //       tiers: [],
  //     },
  //     {
  //       pool_id: 'pnl',
  //       label: 'Realized PnL',
  //       total_prize: 1500,
  //       currency: 'USDC',
  //       metric: 'pnl' as const,
  //       tiers: [],
  //     },
  //     {
  //       pool_id: 'social',
  //       label: 'Social ',
  //       total_prize: 1000,
  //       currency: 'USDC',
  //       metric: 'volume' as const,
  //       tiers: [],
  //     },
  //   ],
  //   ticket_rules: {
  //     total_prize: 2500,
  //     currency: 'USDC',
  //     metric: 'volume',
  //     mode: 'tiered',
  //     tiers: [
  //       { value: 5000, tickets: 1 },
  //       { value: 10000, tickets: 5 },
  //       { value: 50000, tickets: 30 },
  //       { value: 100000, tickets: 70 },
  //       { value: 250000, tickets: 200 },
  //     ],
  //   },
  //   rule_url: 'https://mirror.xyz/0x0a9eEddaa65546Ad35D3F0Ac9E6F09575E4C9297/y6MWoJ2gykjMCNlwRci4BgWYqlXN1O5wUs1tFQDxcmw',
  //   trading_url: 'https://pro.woofi.com/en/trade/ETH_PERP',
  // },
];

export default function LeaderboardView() {
  const [campaignId, setCampaignId] = useState<string | undefined>();
  const searchParams = useSearchParams();

  useEffect(() => {
    const campaign_id = searchParams.get("campaign_id");
    const campaign = leaderboardCampaigns.find(
      (campaign) => campaign.campaign_id === String(campaign_id)
    );
    if (campaign_id && campaign) {
      setCampaignId(campaign_id);
    } else {
      const now = new Date().toISOString();
      const campaign = leaderboardCampaigns.find(
        (campaign) => campaign.start_time < now && campaign.end_time > now
      );
      if (campaign) {
        setCampaignId(String(campaign.campaign_id));
      }
    }
  }, []);

  return (
    <LeaderboardPage
      campaignId={campaignId}
      // @ts-expect-error - onCampaignChange is not typed correctly
      onCampaignChange={setCampaignId}
      campaigns={leaderboardCampaigns}
      href={{
        trading: PathEnum.Root,
      }}
      backgroundSrc="/leaderboard/background.webm"
      className="oui-py-5"
    />
  );
}
