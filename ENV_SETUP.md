# Environment Variables Setup

Create a `.env.local` file in the frontend directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=923332211186
```

This configures the frontend to connect to the backend API and sets the public site URL and WhatsApp contact used in the storefront.

- `NEXT_PUBLIC_API_URL` should point to your backend API URL, including `/api`.
- `NEXT_PUBLIC_SITE_URL` should be the public URL of your frontend.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` is used for payment instructions and contact links.
