/* AmbuAfrica Paystack adapter
   Card/bank transfer details are handled by the payment provider.
   Secret keys and transaction verification belong on the server/Edge Function.
*/
window.AmbuPayments = {
  async loadPaystack() {
    if (window.PaystackPop) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://js.paystack.co/v2/inline.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("Payment service failed to load."));
      document.head.appendChild(s);
    });
  },

  async checkout({email, amountNaira, reference, onSuccess, onCancel}) {
    const key = window.AMBU_CONFIG?.paystackPublicKey;
    if (!key || key.startsWith("YOUR_")) {
      throw new Error("Paystack public key is not configured yet.");
    }
    await this.loadPaystack();
    const popup = new PaystackPop();
    popup.newTransaction({
      key,
      email,
      amount: Math.round(Number(amountNaira) * 100),
      currency: "NGN",
      reference,
      onSuccess,
      onCancel
    });
  }
};
