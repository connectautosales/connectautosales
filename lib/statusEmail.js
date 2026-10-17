import { statusUpdateCustomer } from '@/lib/emailTemplates'
import { NOTIFY_STATUSES, STATUS_LABELS, TYPE_LABELS } from '@/lib/statusNotify'

// One place builds the status-update email, so what the admin previews is
// exactly what the single save and the bulk update send. The admin's internal
// notes are never part of it; only the optional message typed for the customer.
export function buildStatusEmail({ type, record, status, message }) {
  if (!record?.email || !NOTIFY_STATUSES.includes(status)) return null
  const firstName = record.firstName || record.name || 'there'
  const typeLabel = TYPE_LABELS[type] || 'Request'
  const statusLabel = STATUS_LABELS[status] || status
  return {
    to: record.email,
    subject: `${typeLabel} Update — ${statusLabel} | Connect Auto Sales`,
    html: statusUpdateCustomer({ firstName, type, status, message }),
  }
}
