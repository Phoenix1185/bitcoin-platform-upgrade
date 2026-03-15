// Supabase Edge Function: process-investment
// Called when a user starts a new investment
// Handles: balance deduction, investment record creation, transaction logging, notification

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Get user from JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  try {
    const body = await req.json();
    const { planId, amount } = body;

    if (!planId || !amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid investment parameters' }), { status: 400 });
    }

    // Fetch the investment plan
    const { data: plan, error: planError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: 'Investment plan not found' }), { status: 404 });
    }

    // Validate amount against plan limits
    if (amount < plan.min_amount) {
      return new Response(JSON.stringify({ error: `Minimum investment is $${plan.min_amount}` }), { status: 400 });
    }
    if (amount > plan.max_amount) {
      return new Response(JSON.stringify({ error: `Maximum investment is $${plan.max_amount}` }), { status: 400 });
    }

    // Fetch user profile and check balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance, total_invested, is_frozen')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    if (profile.is_frozen) {
      return new Response(JSON.stringify({ error: 'Your account is frozen. Please contact support.' }), { status: 403 });
    }

    if ((profile.balance || 0) < amount) {
      return new Response(JSON.stringify({ error: 'Insufficient balance' }), { status: 400 });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create investment record
    const { data: investment, error: invError } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        plan_id: planId,
        plan_name: plan.name,
        amount: amount,
        daily_return: plan.daily_return,
        duration: plan.duration,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        total_earned: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (invError) throw invError;

    // Deduct from balance and update total_invested
    const newBalance = (profile.balance || 0) - amount;
    const newTotalInvested = (profile.total_invested || 0) + amount;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        balance: newBalance,
        total_invested: newTotalInvested,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Record investment transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'investment',
      amount: amount,
      status: 'completed',
      method: 'balance',
      notes: `Invested in ${plan.name}`,
      created_at: new Date().toISOString(),
    });

    // Send notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'investment',
      title: 'Investment Started',
      message: `Your $${amount.toFixed(2)} investment in ${plan.name} has started. Expected daily return: $${(amount * plan.daily_return / 100).toFixed(2)}.`,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      success: true,
      investment: {
        id: investment.id,
        planName: plan.name,
        amount,
        dailyReturn: plan.daily_return,
        duration: plan.duration,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
      },
      newBalance,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
