// Default "message to the customer" text, written by the owner. Selecting one
// of these statuses on an application pre-fills the message box; the admin
// edits it per customer before saving. Anything in [square brackets] is a
// blank that must be filled in, and the admin page won't send until it is.
export const CUSTOMER_MESSAGE_TEMPLATES = {
  financing: {
    approved: `Your financing application has been preapproved under the following terms:
Down payment: [Down Payment]
Monthly payment: [Monthly Payment]
Financing term: [Number of Months] months

To proceed, please provide the following required documents:
- Driver's license or government-issued ID
- Proof of residence
- Approved phone bill
- Social Security card
- Turbopass report`,
    rejected: `Unfortunately, the financing company was unable to approve your application at this time. If your circumstances change or you have a co-signer available, we would be happy to assist you with a new application. Please contact us if you have any questions. Thank you.`,
  },
  inspection: {
    'documents-reviewed': `Thank you for submitting your documents. We are currently processing them and will contact you if any additional information is needed. We will also notify you once your next inspection is scheduled and keep you updated throughout the process.`,
    scheduled: `Your inspection is scheduled for [Date] at [Time]. We will contact you the day before to confirm the appointment and let you know of any changes. Thank you!`,
    completed: `Your inspection is complete, and we have sent you the required form. Thank you for choosing us and trusting us throughout the process. We look forward to assisting you with any future needs.`,
  },
}

export function templateFor(type, status) {
  return CUSTOMER_MESSAGE_TEMPLATES[type]?.[status] || ''
}

// The [bracketed] blanks still left in a message.
export function unfilledBlanks(message) {
  return [...new Set(String(message || '').match(/\[[^\]\n]+\]/g) || [])]
}
