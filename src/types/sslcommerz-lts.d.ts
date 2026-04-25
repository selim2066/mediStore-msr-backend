declare module 'sslcommerz-lts' {
  interface SSLCommerzInitPayload {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_phone: string;
    shipping_method: string;
    num_of_item: number;
    [key: string]: unknown;
  }

  interface SSLCommerzInitResponse {
    status: string;
    GatewayPageURL: string;
    sessionkey: string;
    [key: string]: unknown;
  }

  interface SSLCommerzValidationResponse {
    status: string;
    tran_id: string;
    val_id: string;
    amount: string;
    currency: string;
    store_id: string;
    [key: string]: unknown;
  }

  class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, isLive: boolean);
    init(payload: SSLCommerzInitPayload): Promise<SSLCommerzInitResponse>;
    validate(payload: { val_id: string }): Promise<SSLCommerzValidationResponse>;
  }

  export default SSLCommerzPayment;
}