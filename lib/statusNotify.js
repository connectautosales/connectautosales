// Safe to import from client components: just the lists, no mailer.

// Statuses that are worth telling the customer about. Moving back to "new"
// or "closed" never offers an email.
export const NOTIFY_STATUSES = [
  'reviewed', 'contacted', 'approved', 'rejected',
  'scheduled', 'completed', 'documents-reviewed', 'confirmed', 'cancelled',
]

export const STATUS_LABELS = {
  new:                  'Received',
  reviewed:             'Under Review',
  contacted:            'We Have Contacted You',
  approved:             'Approved',
  rejected:             'Not Approved',
  scheduled:            'Scheduled',
  completed:            'Completed',
  closed:               'Closed',
  'documents-reviewed': 'Documents Reviewed',
  confirmed:            'Confirmed',
  cancelled:            'Cancelled',
}

export const TYPE_LABELS = {
  financing:  'Financing Application',
  auction:    'Auction Request',
  inspection: 'Salvage Inspection Request',
  contact:    'Contact Message',
  transport:  'Transport Quote Request',
  testDrive:  'Test Drive Request',
}
