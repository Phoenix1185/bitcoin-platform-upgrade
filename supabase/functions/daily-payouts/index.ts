// Supabase Edge Function: daily-payouts
// Triggered by a cron job every day at midnight UTC
// Processes all active investments and credits daily returns to user balances

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (req) => {
  // Verify this is a cron call or an authorized request
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${SUPABASE_SERVICE_KEY}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  const results = {
    processed: 0,
    completed: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    // Fetch all active investments that haven't been paid out today
    const { data: investments, error: fetchError } = await supabase
      .from('investments')
      .select('*')
      .eq('status', 'active')
      .or(`last_payout_date.is.null,last_payout_date.lt.${today}`);

    if (fetchError) throw fetchError;
    if (!investments || investments.length === 0) {
      return new Response(JSON.stringify({ message: 'No investments to process', ...results }), { status: 200 });
    }

    for (const inv of investments) {
      try {
        const startDate = new Date(inv.start_date);
        const endDate = new Date(inv.end_date);
        const now = new Date();

        // Skip if investment hasn't started yet
        if (now < startDate) {
          results.skipped++;
          continue;
        }

        // Calculate daily return amount
        const dailyReturnAmount = inv.amount * (inv.daily_return / 100);
        const newTotalEarned = (inv.total_earned || 0) + dailyReturnAmount;

        // Check if investment is complete
        const isComplete = now >= endDate;

        // Update investment record
        const { error: invUpdateError } = await supabase
          .from('investments')
          .update({
            total_earned: newTotalEarned,
            last_payout_date: today,
            status: isComplete ? 'completed' : 'active',
          })
          .eq('id', inv.id);

        if (invUpdateError) throw invUpdateError;

        // Credit the daily return to the user's balance
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance, total_returns')
          .eq('id', inv.user_id)
          .single();

        if (profileError) throw profileError;

        const newBalance = (profile.balance || 0) + dailyReturnAmount;
        const newTotalReturns = (profile.total_returns || 0) + dailyReturnAmount;

        const { error: balanceError } = await supabase
          .from('profiles')
          .update({
            balance: newBalance,
            total_returns: newTotalReturns,
          })
          .eq('id', inv.user_id);

        if (balanceError) throw balanceError;

        // Record the return as a transaction
        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            user_id: inv.user_id,
            type: 'return',
            amount: dailyReturnAmount,
            status: 'completed',
            method: 'system',
            notes: `Daily return from ${inv.plan_name} investment`,
            created_at: new Date().toISOString(),
          });

        if (txError) throw txError;

        // Send notification to user
        await supabase.from('notifications').insert({
          user_id: inv.user_id,
          type: 'investment',
          title: 'Daily Return Credited',
          message: `$${dailyReturnAmount.toFixed(2)} has been credited to your account from your ${inv.plan_name} investment.`,
          is_read: false,
          created_at: new Date().toISOString(),
        });

        // If investment completed, send completion notification
        if (isComplete) {
          await supabase.from('notifications').insert({
            user_id: inv.user_id,
            type: 'investment',
            title: 'Investment Completed',
            message: `Your ${inv.plan_name} investment has completed. Total earned: $${newTotalEarned.toFixed(2)}.`,
            is_read: false,
            created_at: new Date().toISOString(),
          });
          results.completed++;
        }

        results.processed++;
      } catch (err: any) {
        results.errors.push(`Investment ${inv.id}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      date: today,
      ...results,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      ...results,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
