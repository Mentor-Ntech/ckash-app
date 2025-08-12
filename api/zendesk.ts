import { ZendeskTicket, ZendeskUser, ZendeskTicketResponse, ZendeskUserResponse } from './types'
import { ZENDESK_CONFIG } from '../constants/constant'

class ZendeskAPI {
  private baseURL: string
  private apiToken: string
  private email: string

  constructor() {
    this.baseURL = ZENDESK_CONFIG.baseUrl
    this.apiToken = ZENDESK_CONFIG.apiToken
    this.email = ZENDESK_CONFIG.email
  }

  private getHeaders(): HeadersInit {
    const auth = Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseURL}/api/v2${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Zendesk API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Zendesk API request failed:', error)
      throw error
    }
  }

  // Create or find existing user
  async createOrFindUser(user: ZendeskUser): Promise<ZendeskUserResponse> {
    const payload = {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        tags: user.tags || ['ckash-app'],
        user_fields: user.user_fields || {},
      }
    }

    return this.makeRequest<ZendeskUserResponse>('/users/create_or_update.json', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // Create support ticket
  async createTicket(ticket: ZendeskTicket): Promise<ZendeskTicketResponse> {
    const payload = {
      ticket: {
        subject: ticket.subject,
        description: ticket.description,
        requester_id: ticket.requester_id,
        submitter_id: ticket.submitter_id,
        priority: ticket.priority || 'normal',
        tags: ticket.tags || ['ckash-app', 'contact-form'],
        custom_fields: ticket.custom_fields || {},
      }
    }

    return this.makeRequest<ZendeskTicketResponse>('/tickets.json', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // Create ticket with user (creates user first, then ticket)
  async createTicketWithUser(
    user: ZendeskUser, 
    ticket: Omit<ZendeskTicket, 'requester_id'>
  ): Promise<ZendeskTicketResponse> {
    try {
      // First create or find the user
      const userResponse = await this.createOrFindUser(user)
      
      // Then create the ticket with the user ID
      const ticketWithUser: ZendeskTicket = {
        ...ticket,
        requester_id: userResponse.user.id.toString(),
      }
      
      return await this.createTicket(ticketWithUser)
    } catch (error) {
      console.error('Failed to create ticket with user:', error)
      throw error
    }
  }
}

export default ZendeskAPI
