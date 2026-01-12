/**
 * API-related types and interfaces for message operations
 */

export interface GetMessagesParams {
  after?: string;
  before?: string;
  limit?: number;
}
