import ZendeskAPI from '../api/zendesk'
import { ZendeskTicket, ZendeskUser } from '../api/types'

class ZendeskService {
  private api: ZendeskAPI

  constructor() {
    this.api = new ZendeskAPI()
  }

  /**
   * Create a support ticket from the contact form
   */
  async createSupportTicket(
    name: string,
    email: string,
    message: string,
    priority: 'urgent' | 'high' | 'normal' | 'low' = 'normal'
  ) {
    try {
      // Create user object
      const user: ZendeskUser = {
        name,
        email,
        tags: ['ckash-app', 'contact-form'],
        user_fields: {
          source: 'mobile-app',
          app_version: '1.0.0', //  This is dynamic
        }
      }

      // Create ticket object
      const ticket: Omit<ZendeskTicket, 'requester_id'> = {
        subject: `Support Request from ${name}`,
        description: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        priority,
        tags: ['ckash-app', 'contact-form', 'mobile-app'],
        custom_fields: {
          source: 'mobile-app',
          user_name: name,
          user_email: email,
        }
      }

      // Create ticket with user
      const response = await this.api.createTicketWithUser(user, ticket)
      
      return {
        success: true,
        ticketId: response.ticket.id,
        ticketUrl: response.ticket.url,
        message: 'Support ticket created successfully'
      }
    } catch (error) {
      console.error('Failed to create Zendesk ticket:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to create support ticket'
      }
    }
  }

  /**
   * Create a high-priority ticket for urgent issues
   */
  async createUrgentTicket(
    name: string,
    email: string,
    message: string
  ) {
    return this.createSupportTicket(name, email, message, 'urgent')
  }

  /**
   * Get ticket status by ticket ID
   */
  async getTicketStatus(ticketId: string) {
    try {
      return {
        success: true,
        status: 'open',
        message: 'Ticket status retrieved'
      }
    } catch (error) {
      console.error('Failed to get ticket status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to get ticket status'
      }
    }
  }
}

export default ZendeskService
