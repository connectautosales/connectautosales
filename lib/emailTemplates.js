const BRAND_RED  = '#e50202'
const BRAND_DARK = '#0f172a'
const SITE_URL   = 'https://connectautosales.com'

const ICONS = {
  car:       'TEST DRIVE',
  clipboard: 'FINANCING',
  search:    'INSPECTION',
  mail:      'CONTACT',
  hammer:    'AUCTION',
  truck:     'TRANSPORT',
  warning:   'IMPORTANT',
}

function baseLayout({ preheader = '', body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Connect Auto Sales</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr>
        <td style="background:${BRAND_DARK};border-radius:10px 10px 0 0;padding:26px 36px;text-align:center;">
          <a href="${SITE_URL}" style="text-decoration:none;">
            <span style="color:#fff;font-size:24px;font-weight:900;letter-spacing:0.06em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">CONNECT AUTO SALES</span>
          </a>
        </td>
      </tr>

      <!-- RED LINE -->
      <tr><td style="background:${BRAND_RED};height:4px;"></td></tr>

      <!-- BODY -->
      <tr>
        <td style="background:#ffffff;padding:36px 36px 28px;border-radius:0 0 10px 10px;">
          ${body}
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding:24px 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:13px;color:#64748b;">4413 S Beech Daly St, Dearborn Heights, MI 48125</p>
          <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
            <a href="tel:3134133400" style="color:${BRAND_RED};text-decoration:none;font-weight:600;">(313) 413-3400</a>
            &nbsp;&middot;&nbsp;
            <a href="mailto:Sales@connectautosales.com" style="color:${BRAND_RED};text-decoration:none;">Sales@connectautosales.com</a>
          </p>
          <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">&copy; ${new Date().getFullYear()} Connect Auto Sales. All rights reserved.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

function detailsTable(rows) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;margin:20px 0;overflow:hidden;">
    ${rows.filter(Boolean).map(([label, value], i) => `
    <tr style="background:${i % 2 === 0 ? '#f8fafc' : '#ffffff'};">
      <td style="padding:11px 18px;font-size:12px;font-weight:700;color:#64748b;width:38%;border-bottom:1px solid #e2e8f0;white-space:nowrap;text-transform:uppercase;letter-spacing:0.03em;">${label}</td>
      <td style="padding:11px 18px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;">${value || '&mdash;'}</td>
    </tr>`).join('')}
  </table>`
}

function ctaButton(text, href) {
  return `<div style="text-align:center;margin:28px 0 10px;">
    <a href="${href}" style="background:${BRAND_RED};color:#fff;text-decoration:none;padding:14px 36px;border-radius:6px;font-size:15px;font-weight:800;letter-spacing:0.06em;display:inline-block;">${text}</a>
  </div>`
}

function iconCircle(label) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td align="center">
      <span style="background:#e50202;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.1em;padding:6px 18px;border-radius:4px;display:inline-block;">${label}</span>
    </td></tr>
  </table>`
}

function adminHeader(emoji, title, subtitle) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-left:4px solid ${BRAND_RED};border-radius:4px;margin-bottom:20px;">
    <tr>
      <td style="padding:14px 16px;font-size:26px;width:48px;vertical-align:middle;">${emoji}</td>
      <td style="padding:14px 16px 14px 0;vertical-align:middle;">
        <p style="margin:0;font-size:17px;font-weight:800;color:#1e293b;">${title}</p>
        <p style="margin:3px 0 0;font-size:13px;color:#64748b;">${subtitle}</p>
      </td>
    </tr>
  </table>`
}

// ─── TEST DRIVE ───────────────────────────────────────────

export function testDriveCustomer({ firstName, vehicle, preferredDate, preferredTime }) {
  return baseLayout({
    preheader: `We got it, ${firstName}! Your test drive request is confirmed.`,
    body: `
      ${iconCircle(ICONS.car)}
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:${BRAND_DARK};text-align:center;">You're all set, ${firstName}!</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;text-align:center;">We received your test drive request.</p>
      <p style="font-size:15px;color:#1e293b;line-height:1.7;margin:0 0 20px;">
        Great news — one of our team members will be reaching out to you shortly to lock in your appointment. We're excited to get you behind the wheel!
      </p>
      ${detailsTable([
        ['Vehicle',        vehicle],
        ['Preferred Date', preferredDate],
        ['Preferred Time', preferredTime],
      ])}
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:16px 0 0;">
        Need to change the date or time? No problem at all — just give us a call or reply to this email and we'll make it work.
      </p>
      ${ctaButton('BROWSE MORE VEHICLES', `${SITE_URL}/inventory`)}
      <p style="text-align:center;font-size:13px;color:#94a3b8;margin:10px 0 0;">Or call us directly at <a href="tel:3134133400" style="color:${BRAND_RED};font-weight:600;">(313) 413-3400</a></p>
    `,
  })
}

export function testDriveAdmin({ firstName, lastName, phone, email, vehicle, preferredDate, preferredTime, notes }) {
  return baseLayout({
    body: `
      ${adminHeader(ICONS.car, 'New Test Drive Request', `Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`)}
      ${detailsTable([
        ['Name',     `${firstName} ${lastName}`],
        ['Phone',    phone],
        ['Email',    email],
        ['Vehicle',  vehicle],
        ['Date',     preferredDate],
        ['Time',     preferredTime],
        ['Notes',    notes],
      ])}
      ${ctaButton('VIEW IN DASHBOARD', `${SITE_URL}/admin/test-drives`)}
    `,
  })
}

// ─── FINANCING ───────────────────────────────────────────

export function financingCustomer({ firstName }) {
  return baseLayout({
    preheader: `${firstName}, your financing application is in — we'll be in touch soon!`,
    body: `
      ${iconCircle(ICONS.clipboard)}
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:${BRAND_DARK};text-align:center;">Application submitted, ${firstName}!</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;text-align:center;">We're reviewing it now.</p>
      <p style="font-size:15px;color:#1e293b;line-height:1.7;margin:0 0 20px;">
        Thank you for taking the time to fill out your financing application. Our team will carefully go through everything and get back to you within <strong>1&ndash;2 business days</strong> to walk you through your options.
      </p>
      <div style="background:#fef9ec;border-left:4px solid #f59e0b;border-radius:4px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#92400e;">What happens next?</p>
        <p style="margin:0;font-size:14px;color:#78350f;line-height:1.6;">One of our financing specialists will reach out to you personally to discuss your approval options and help get you into the right vehicle.</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        In the meantime, feel free to browse our inventory. If you have any questions, we're just a call away.
      </p>
      ${ctaButton('BROWSE INVENTORY', `${SITE_URL}/inventory`)}
      <p style="text-align:center;font-size:13px;color:#94a3b8;margin:10px 0 0;">Questions? Call us at <a href="tel:3134133400" style="color:${BRAND_RED};font-weight:600;">(313) 413-3400</a></p>
    `,
  })
}

export function financingAdmin(d) {
  return baseLayout({
    body: `
      ${adminHeader(ICONS.clipboard, 'New Financing Application', `Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`)}
      ${detailsTable([
        ['Name',                `${d.firstName} ${d.middleName || ''} ${d.lastName}`.trim()],
        ['Date of Birth',       d.dob],
        ['Cell Phone',          d.phone],
        ['Home Phone',          d.homePhone],
        ['Email',               d.email],
        ['ID Type',             d.idType],
        ["Driver's License / ID #", d.driversLicense],
        ['ID Expiration',       d.idExpiration],
        ['State of Issuance',   d.stateIssuance],
        ['Address',             [d.address, d.city, d.state, d.zip].filter(Boolean).join(', ')],
        ['Housing Status',      d.housingStatus],
        ['Monthly Rent',        d.monthlyRent ? `$${d.monthlyRent}` : null],
        ['Landlord Name',       d.landlordName],
        ['Landlord Phone',      d.landlordPhone],
        ['Previous Address',    [d.prevAddress, d.prevCity, d.prevState, d.prevZip].filter(Boolean).join(', ') || null],
        ['Employment Status',   d.employmentStatus],
        ['Occupation',          d.occupation || d.jobTitle],
        ['Employer',            d.employer],
        ['Employer City',       d.employerCity],
        ['Employer State',      d.employerState],
        ['Employer Phone',      d.employerPhone],
        ['Supervisor',          d.supervisor],
        ['Income Source',       d.incomeSource],
        ['Monthly Income',      d.monthlyIncome ? `$${d.monthlyIncome}` : null],
        ['Income Frequency',    d.incomeFrequency],
        ['Additional Income',   d.addlIncome],
        ['Addl Income Source',  d.addlIncomeSource],
        ['Addl Income Amount',  d.addlIncomeAmount ? `$${d.addlIncomeAmount}` : null],
        ['Vehicle Interest',    [d.vehicleYear, d.vehicleMake, d.vehicleModel].filter(Boolean).join(' ') || null],
        ['Vehicle Mileage',     d.vehicleMileage],
        ['Stock #',             d.stockNumber],
        ['Trade-In',            d.tradeIn],
        ['Trade-In Paid Off',   d.tradeInPaidOff],
        ['Trade-In Vehicle',    [d.tradeInYear, d.tradeInMake, d.tradeInModel].filter(Boolean).join(' ') || null],
        ['Trade-In Mileage',    d.tradeInMileage],
        ['Trade-In VIN',        d.tradeInVin],
        ['Loan Amount',         d.loanAmount ? `$${d.loanAmount}` : null],
        ['Down Payment',        d.downPayment ? `$${d.downPayment}` : null],
        ['Desired Monthly',     d.desiredMonthly ? `$${d.desiredMonthly}` : null],
        ['Referral Source',     d.referralSource],
        ['Reference Name',      d.refName],
        ['Reference Phone',     d.refPhone],
        ['Reference Relation',  d.refRelation],
        ['Reference Address',   d.refAddress],
        ['Additional Comments', d.additionalComments],
      ])}
      ${ctaButton('VIEW IN DASHBOARD', `${SITE_URL}/admin/financing`)}
    `,
  })
}

// ─── SALVAGE INSPECTION ───────────────────────────────────

export function inspectionCustomer({ firstName }) {
  return baseLayout({
    preheader: `Got your documents, ${firstName}! We'll schedule your inspection soon.`,
    body: `
      ${iconCircle(ICONS.search)}
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:${BRAND_DARK};text-align:center;">Documents received, ${firstName}!</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;text-align:center;">We'll be in touch to schedule your inspection.</p>
      <p style="font-size:15px;color:#1e293b;line-height:1.7;margin:0 0 20px;">
        We've received all your paperwork and our team will review everything shortly. Once we've gone through your documents, we'll reach out to set up a convenient inspection time for you.
      </p>
      <div style="background:#fef9ec;border-left:4px solid #f59e0b;border-radius:4px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#92400e;">Please hold off for now</p>
        <p style="margin:0;font-size:14px;color:#78350f;line-height:1.6;">Do <strong>not</strong> bring your vehicle to us yet. We will contact you directly once your inspection appointment is confirmed.</p>
      </div>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Have a question in the meantime? Don't hesitate to reach out &mdash; we're happy to help.
      </p>
      ${ctaButton('LEARN MORE ABOUT INSPECTIONS', `${SITE_URL}/salvage-inspections`)}
      <p style="text-align:center;font-size:13px;color:#94a3b8;margin:10px 0 0;">Or call us at <a href="tel:3134133400" style="color:${BRAND_RED};font-weight:600;">(313) 413-3400</a></p>
    `,
  })
}

export function inspectionAdmin({ firstName, lastName, phone, email }) {
  return baseLayout({
    body: `
      ${adminHeader(ICONS.search, 'New Salvage Inspection Request', `Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`)}
      ${detailsTable([
        ['Name',  `${firstName} ${lastName}`],
        ['Phone', phone],
        ['Email', email],
      ])}
      <p style="font-size:13px;color:#475569;margin:0 0 16px;">Documents (Salvage Title, Valid ID, Receipts) have been uploaded and are available in the dashboard.</p>
      ${ctaButton('VIEW IN DASHBOARD', `${SITE_URL}/admin/inspections`)}
    `,
  })
}

// ─── CONTACT ─────────────────────────────────────────────

export function contactCustomer({ name }) {
  return baseLayout({
    preheader: `Hey ${name}, we got your message and we'll get back to you soon!`,
    body: `
      ${iconCircle(ICONS.mail)}
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:${BRAND_DARK};text-align:center;">We got your message, ${name}!</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;text-align:center;">We'll get back to you within 1 business day.</p>
      <p style="font-size:15px;color:#1e293b;line-height:1.7;margin:0 0 20px;">
        Thanks for reaching out! We've received your message and someone from our team will personally follow up with you as soon as possible.
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">
        Can't wait? Give us a call &mdash; we'd love to chat and help you out right away.
      </p>
      ${ctaButton('BROWSE INVENTORY', `${SITE_URL}/inventory`)}
      <p style="text-align:center;font-size:13px;color:#94a3b8;margin:10px 0 0;">Or call us at <a href="tel:3134133400" style="color:${BRAND_RED};font-weight:600;">(313) 413-3400</a></p>
    `,
  })
}

export function contactAdmin({ name, phone, email, subject, message }) {
  return baseLayout({
    body: `
      ${adminHeader(ICONS.mail, 'New Contact Message', `Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`)}
      ${detailsTable([
        ['Name',    name],
        ['Phone',   phone],
        ['Email',   email],
        ['Subject', subject],
      ])}
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 18px;margin:0 0 20px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
        <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.65;">${message || '&mdash;'}</p>
      </div>
      ${ctaButton('VIEW IN DASHBOARD', `${SITE_URL}/admin/contacts`)}
    `,
  })
}

// ─── AUCTION ─────────────────────────────────────────────

export function auctionCustomer({ firstName }) {
  return baseLayout({
    preheader: `We're on it, ${firstName}! Your auction request is being reviewed.`,
    body: `
      ${iconCircle(ICONS.hammer)}
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:${BRAND_DARK};text-align:center;">Request received, ${firstName}!</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;text-align:center;">Our team is looking into it now.</p>
      <p style="font-size:15px;color:#1e293b;line-height:1.7;margin:0 0 20px;">
        Thanks for submitting your auction purchase request! We've got all the details and our team will review the vehicle and reach out to you with pricing, availability, and next steps.
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">
        We typically follow up within 1 business day. If you need a quicker answer, feel free to call us directly.
      </p>
      ${ctaButton('LEARN MORE ABOUT AUCTION SERVICES', `${SITE_URL}/auction-services`)}
      <p style="text-align:center;font-size:13px;color:#94a3b8;margin:10px 0 0;">Questions? Call us at <a href="tel:3134133400" style="color:${BRAND_RED};font-weight:600;">(313) 413-3400</a></p>
    `,
  })
}

export function auctionAdmin({ firstName, lastName, phone, email, auctionLink, lotNumber, notes }) {
  return baseLayout({
    body: `
      ${adminHeader(ICONS.hammer, 'New Auction Request', `Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`)}
      ${detailsTable([
        ['Name',         `${firstName} ${lastName}`],
        ['Phone',        phone],
        ['Email',        email],
        ['Lot Number',   lotNumber],
        ['Auction Link', auctionLink ? `<a href="${auctionLink}" style="color:${BRAND_RED};">${auctionLink}</a>` : null],
        ['Notes',        notes],
      ])}
      ${ctaButton('VIEW IN DASHBOARD', `${SITE_URL}/admin/auction`)}
    `,
  })
}

// ─── TRANSPORT ───────────────────────────────────────────

export function transportCustomer({ name }) {
  return baseLayout({
    preheader: `We got your quote request, ${name}! We'll have pricing for you soon.`,
    body: `
      ${iconCircle(ICONS.truck)}
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:${BRAND_DARK};text-align:center;">Quote request received, ${name}!</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;text-align:center;">We're putting your estimate together.</p>
      <p style="font-size:15px;color:#1e293b;line-height:1.7;margin:0 0 20px;">
        Thanks for reaching out about vehicle transportation! We've received all your details and our team will get back to you with a quote as quickly as possible.
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">
        We know timing matters when it comes to transport, so we'll do our best to respond promptly. Have an urgent need? Give us a call and we'll prioritize it.
      </p>
      ${ctaButton('LEARN MORE ABOUT TRANSPORT', `${SITE_URL}/transportation`)}
      <p style="text-align:center;font-size:13px;color:#94a3b8;margin:10px 0 0;">Questions? Call us at <a href="tel:3134133400" style="color:${BRAND_RED};font-weight:600;">(313) 413-3400</a></p>
    `,
  })
}

export function transportAdmin({ name, phone, email, from, to, vehicle, notes }) {
  return baseLayout({
    body: `
      ${adminHeader(ICONS.truck, 'New Transport Quote Request', `Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`)}
      ${detailsTable([
        ['Name',    name],
        ['Phone',   phone],
        ['Email',   email],
        ['From',    from],
        ['To',      to],
        ['Vehicle', vehicle],
        ['Notes',   notes],
      ])}
      ${ctaButton('VIEW IN DASHBOARD', `${SITE_URL}/admin/transport`)}
    `,
  })
}

const STATUS_LABELS = {
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

const TYPE_LABELS = {
  financing:  'Financing Application',
  auction:    'Auction Request',
  inspection: 'Salvage Inspection Request',
  contact:    'Contact Message',
  transport:  'Transport Quote Request',
  testDrive:  'Test Drive Request',
}

export function statusUpdateCustomer({ firstName, type, status, adminNotes }) {
  const typeLabel = TYPE_LABELS[type] || 'Request'
  const statusLabel = STATUS_LABELS[status] || status

  const statusColor = status === 'approved' || status === 'scheduled' || status === 'completed'
    ? '#16a34a'
    : status === 'rejected'
    ? '#e50202'
    : '#0369a1'

  return baseLayout({
    preheader: `Update on your ${typeLabel} — ${statusLabel}`,
    body: `
      <div style="width:48px;height:4px;background:${BRAND_RED};margin:0 auto 28px;border-radius:2px;"></div>
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#0f172a;text-align:center;">Update on Your ${typeLabel}</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#475569;text-align:center;">Hello ${firstName || 'there'},</p>

      <p style="margin:0 0 20px;font-size:15px;color:#334155;">We wanted to let you know that the status of your ${typeLabel.toLowerCase()} has been updated.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
          <td align="center">
            <span style="background:${statusColor};color:#fff;padding:10px 28px;border-radius:20px;font-size:15px;font-weight:800;letter-spacing:0.04em;display:inline-block;">${statusLabel}</span>
          </td>
        </tr>
      </table>

      ${adminNotes ? `
      <div style="background:#f8fafc;border-left:4px solid #e2e8f0;border-radius:4px;padding:16px 20px;margin:0 0 24px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Note from Our Team</p>
        <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.6;">${adminNotes}</p>
      </div>
      ` : ''}

      <p style="margin:0 0 8px;font-size:15px;color:#334155;">If you have any questions, don't hesitate to reach out to us directly.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
        <tr>
          <td width="48%" align="center">
            <a href="tel:3134133400" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.04em;">CALL US</a>
          </td>
          <td width="4%"></td>
          <td width="48%" align="center">
            <a href="mailto:Sales@connectautosales.com" style="display:inline-block;background:${BRAND_RED};color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.04em;">EMAIL US</a>
          </td>
        </tr>
      </table>

      <p style="margin:28px 0 0;font-size:14px;color:#64748b;text-align:center;">Thank you for choosing Connect Auto Sales.</p>
    `,
  })
}

