import 'dotenv/config';
import express, { Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import Razorpay from 'razorpay';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

// Initialize Razorpay SDK
const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

// Endpoint: GET /api/config/razorpay
app.get('/api/config/razorpay', (_req: Request, res: Response) => {
  res.json({ key_id: keyId });
});

// Endpoint: POST /api/create-order
app.post('/api/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Minimum amount: 100 paise (₹1)
    if (!amount || typeof amount !== 'number' || amount < 100) {
      return res.status(400).json({ 
        error: 'Invalid amount. Minimum amount is 100 paise (₹1).' 
      });
    }

    if (!keyId || !keySecret) {
      return res.status(401).json({ 
        error: 'Razorpay API credentials not configured.' 
      });
    }

    const options = {
      amount: Math.round(amount),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR') {
      return res.status(error.statusCode || 400).json({
        error: error?.error?.description || 'Razorpay authentication / request failed'
      });
    }
    return res.status(500).json({ 
      error: error?.message || 'Failed to create Razorpay order' 
    });
  }
});

// Endpoint: POST /api/verify-payment
app.post('/api/verify-payment', (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields (order_id, payment_id, or signature).' 
      });
    }

    if (!keySecret) {
      return res.status(500).json({ 
        success: false, 
        error: 'Razorpay secret key not configured on server.' 
      });
    }

    // HMAC-SHA256 signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const isMatch = expectedSignature === razorpay_signature;

    if (!isMatch) {
      console.warn('Razorpay signature mismatch:', {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Payment signature verification failed. Transaction may be compromised.' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    });
  } catch (error: any) {
    console.error('Error verifying payment signature:', error);
    return res.status(500).json({ 
      success: false, 
      error: error?.message || 'Internal server error verifying signature.' 
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
