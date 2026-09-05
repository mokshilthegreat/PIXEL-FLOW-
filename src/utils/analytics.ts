/**
 * Lightweight Analytics Events Abstraction
 * Ready for future production telemetry/telemetry providers without external dependencies.
 */

export type AnalyticsEventName =
  | 'game_started'
  | 'level_started'
  | 'level_completed'
  | 'level_failed'
  | 'level_retried'
  | 'hint_used'
  | 'new_best'
  | 'daily_completed'
  | 'weekly_completed'
  | 'streak_updated'
  | 'chapter_completed'
  | 'cosmetic_unlocked'
  | 'theme_equipped';

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  payload?: Record<string, unknown>;
  timestamp: number;
};

class AnalyticsManager {
  private recentEvents: AnalyticsEvent[] = [];
  private readonly MAX_EVENTS = 50;

  public track(name: AnalyticsEventName, payload?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      name,
      payload,
      timestamp: Date.now(),
    };

    this.recentEvents.push(event);
    if (this.recentEvents.length > this.MAX_EVENTS) {
      this.recentEvents.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] ${name}`, payload ?? '');
    }
  }

  public getRecentEvents(): AnalyticsEvent[] {
    return [...this.recentEvents];
  }
}

export const analytics = new AnalyticsManager();
