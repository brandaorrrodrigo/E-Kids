// STRIPE ROUTES - E-KIDS PRO
// Rotas da API de pagamentos Stripe

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function setupStripeRoutes(app, db, authenticate) {

  // ============================================
  // CREATE CHECKOUT SESSION
  // ============================================
  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    try {
      const { priceId, successUrl, cancelUrl, customerEmail } = req.body;

      if (!priceId || !successUrl || !cancelUrl) {
        return res.status(400).json({
          error: 'Missing required fields: priceId, successUrl, cancelUrl'
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
        locale: 'pt-BR',
        billing_address_collection: 'required',
        metadata: {
          product: 'ekids-pro'
        }
      });

      res.json({
        sessionId: session.id,
        url: session.url
      });
    } catch (error) {
      console.error('Erro ao criar checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // WEBHOOK - Receive Stripe Events
  // ============================================
  app.post('/api/stripe/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      // For webhook, we need raw body, but express.json() already parsed it
      // In production, you may need to configure this route separately
      event = stripe.webhooks.constructEvent(
        JSON.stringify(req.body),
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('✅ Checkout session completed:', session.id);

        // TODO: Save subscription to database
        // const customerId = session.customer;
        // const subscriptionId = session.subscription;

        break;

      case 'customer.subscription.created':
        const subscription = event.data.object;
        console.log('✅ Subscription created:', subscription.id);

        // TODO: Activate subscription in database
        // db.prepare(`
        //   INSERT INTO subscriptions (customer_id, subscription_id, status, plan_id)
        //   VALUES (?, ?, 'active', ?)
        // `).run(subscription.customer, subscription.id, subscription.items.data[0].price.id);

        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        console.log('📝 Subscription updated:', updatedSubscription.id);

        // TODO: Update subscription status in database
        // db.prepare(`
        //   UPDATE subscriptions
        //   SET status = ?
        //   WHERE subscription_id = ?
        // `).run(updatedSubscription.status, updatedSubscription.id);

        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('❌ Subscription cancelled:', deletedSubscription.id);

        // TODO: Deactivate subscription in database
        // db.prepare(`
        //   UPDATE subscriptions
        //   SET status = 'cancelled'
        //   WHERE subscription_id = ?
        // `).run(deletedSubscription.id);

        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('💰 Payment succeeded:', invoice.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log('⚠️ Payment failed:', failedInvoice.id);
        // TODO: Notify customer about payment failure
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  });

  // ============================================
  // GET SUBSCRIPTION STATUS (for authenticated users)
  // ============================================
  app.get('/api/stripe/subscription-status', authenticate, async (req, res) => {
    try {
      const { customerId } = req.query;

      if (!customerId) {
        return res.status(400).json({ error: 'customerId is required' });
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length === 0) {
        return res.json({ active: false, subscription: null });
      }

      res.json({
        active: true,
        subscription: subscriptions.data[0]
      });
    } catch (error) {
      console.error('Erro ao buscar status da assinatura:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // CANCEL SUBSCRIPTION
  // ============================================
  app.post('/api/stripe/cancel-subscription', authenticate, async (req, res) => {
    try {
      const { subscriptionId } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'subscriptionId is required' });
      }

      const subscription = await stripe.subscriptions.cancel(subscriptionId);

      res.json({
        success: true,
        subscription
      });
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      res.status(500).json({ error: error.message });
    }
  });

  console.log('✅ Stripe Payment routes configuradas');
}

module.exports = setupStripeRoutes;
