import { createClient } from '@supabase/supabase-js';

      // =========================================
      // CONVICTION REFINEMENT
      // =========================================

      if (momentum.momentum_state === 'EARLY IGNITION') {
        conviction = 'HIGH CONVICTION';
      }

      if (momentum.momentum_state === 'BASE BUILDING') {
        conviction = 'BUILDING';
      }

      if (momentum.momentum_state === 'CONTROLLED EXPANSION') {
        conviction = 'STRONG';
      }

      if (momentum.momentum_state === 'EXTENDED') {
        conviction = 'CAUTION';
      }

      if (momentum.momentum_state === 'EXHAUSTED') {
        conviction = 'WEAK';
      }

      // =========================================
      // RECOMMENDATION ENGINE
      // =========================================

      const recommendation = getRecommendation({
        cycle_2027: cycle2027.cycle_2027,
        pressure_score: pressure.pressure_score,
        momentum_state: momentum.momentum_state,
        position_action: finalAction,
        astro_window: result.astro_window,
        pmp: result.pmp
      });

      // =========================================
      // DATABASE UPDATE
      // =========================================

      const { error: updateError } = await supabase
        .from('stocks')
        .update({

          // Astro Layer
          week_bias: result.week_bias,
          action_plan: result.action_plan,

          // Positioning
          position_action: finalAction,
          positioning: positionMap[finalAction] || '15–40%',

          // Timing
          astro_window: result.astro_window,
          pmp_forecast: result.pmp,

          // Signal
          signal: result.signal,

          // Long-Term Thesis
          long_term: cycle.long_term,
          cycle_2027: cycle2027.cycle_2027,

          // Recommendation
          recommendation,

          // Early Warning
          early_signal: earlySignal,

          // Next Week
          next_week_signal: nextWeekSignal,

          // Pressure Engine
          pressure_score: pressure.pressure_score,

          // Momentum Engine
          momentum_state: momentum.momentum_stat
