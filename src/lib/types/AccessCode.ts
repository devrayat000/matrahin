// Generated by https://quicktype.io

export interface TransactionSuccess {
  status: number;
  invoice: string;
  tranx: Tranx;
}

export interface Tranx {
  _id: string;
  status: string;
  tran_id: string;
  sessionkey: string;
  currency_amount: number;
  Coupon: string;
  discount_percentage: string;
  discount_remarks: string;
  ProductName: string;
  Product: Product;
  uid: string;
  Name: string;
  Email: string;
  Phone: string;
  Institution: string;
  HSC: string;
  affiliate: string;
  utm_id: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  lead: string;
  Referrer: string;
  Ip: string;
  Platform: string;
  gw: string;
  value_a: string;
  value_b: string;
  value_c: string;
  Timestamp: string;
  __v: number;
  bank_tran_id: string;
  card_issuer: string;
  card_no: string;
  card_type: string;
  discount_amount: string;
  store_amount: number;
  tran_date: string;
  val_id: string;
  validated_on: string;
}

export interface Product {
  productId: string;
  productName: string;
  Platform: string;
  status: string;
  Cycle: string;
  fb_Link: string;
  Webapp: string;
  Permalink: string;
  _id: string;
}

// Generated by https://quicktype.io

export interface TransactionFailure {
  APIConnect: string;
  no_of_trans_found: number;
  element: Element[];
}

export interface Element {
  tran_id: string;
  status: string;
}

export type TransactionCheck = TransactionSuccess | TransactionFailure;
