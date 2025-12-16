/**
 * Get or create a session ID for tracking recently viewed items
 * Stored in localStorage to persist across page reloads
 */
export function getSessionId(): string {
  const SESSION_KEY = "wdbc_session_id";
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}
