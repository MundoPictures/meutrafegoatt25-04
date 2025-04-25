// Tipos para entidades do Facebook Ads

export interface AdAccount {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  amount_spent: number;
  balance: number;
  currency: string;
  business_name?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: number;
  lifetime_budget?: number;
  start_time: string;
  stop_time?: string;
  created_time: string;
  updated_time: string;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  daily_budget?: number;
  lifetime_budget?: number;
  targeting?: any;
  optimization_goal?: string;
  bid_amount?: number;
  billing_event?: string;
  start_time: string;
  end_time?: string;
  created_time: string;
  updated_time: string;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: string;
  creative?: any;
  created_time: string;
  updated_time: string;
}

export interface AdCreative {
  id: string;
  name: string;
  body?: string;
  title?: string;
  image_url?: string;
  video_id?: string;
  link_url?: string;
  call_to_action_type?: string;
}

export interface AdInsight {
  date_start: string;
  date_stop: string;
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  reach?: number;
  frequency?: number;
  unique_clicks?: number;
  cost_per_unique_click?: number;
  actions?: AdAction[];
  action_values?: AdActionValue[];
  conversions?: AdConversion[];
  conversion_values?: AdConversionValue[];
  // Novos campos para eventos do pixel
  pixel_purchases?: number;
  pixel_leads?: number;
  pixel_complete_registration?: number;
  messenger_replies?: number;
  objective?: string;
}

export interface AdAction {
  action_type: string;
  value: number;
}

export interface AdActionValue {
  action_type: string;
  value: number;
}

export interface AdConversion {
  action_type: string;
  value: number;
}

export interface AdConversionValue {
  action_type: string;
  value: number;
}

export interface DashboardMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  linkClicks?: number;
  // Métricas de conversão
  pixelPurchases?: number;
  pixelLeads?: number;
  pixelRegistrations?: number;
  messengerReplies?: number;
  // Métricas calculadas
  roi?: number;
  roas?: number;
  cpa?: number;
  objective?: string;
}