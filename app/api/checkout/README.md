# PayU Payment Integration Setup

## Environment Variables
Add the following to your `.env.local` file:

```env
# Merchant Configuration
MERCHANT_NAME="Anveda Farms"
MERCHANT_LOGO="/logo.png"

# PayU Credentials
NEXT_PUBLIC_PAYU_MERCHANT_KEY=your_merchant_key
PAYU_MERCHANT_SALT=your_merchant_salt

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # Change in production
CURRENCY=INR
CURRENCY_SYMBOL=₹
```

## Integration Steps

1. Get your PayU credentials:
   - Merchant Key
   - Merchant Salt
   - Test/Production URLs

2. Set up success and failure endpoints:
   - `/api/checkout/success`
   - `/api/checkout/failure`

3. Form Fields Required for PayU:
   - key (Merchant Key)
   - txnid (Unique Transaction ID)
   - amount
   - productinfo
   - firstname
   - email
   - phone
   - surl (Success URL)
   - furl (Failure URL)
   - hash (Generated using all parameters and salt)

4. Hash Generation:
   - Parameters must be in specific order
   - Uses SHA512 algorithm
   - Includes merchant salt

## Testing
Use these test card details in the test environment:
- Card Number: 4012001037141112
- CVV: 123
- Expiry: Any future date

## Security Notes
- Never expose the Merchant Salt on the client side
- Always validate the response hash
- Store transaction details securely
- Use HTTPS in production
