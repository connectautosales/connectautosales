import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DetailView from '../../DetailView'

export default async function FinancingDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const rows = await prisma.$queryRaw`SELECT * FROM financingapplication WHERE id = ${parseInt(id)} LIMIT 1`
  const a = rows[0]
  if (!a) notFound()

  const fields = [
    { label: 'Full Name', value: `${a.firstName} ${a.middleName || ''} ${a.lastName}`.trim() },
    { label: 'Date of Birth', value: a.dob },
    { label: 'Phone', value: a.phone },
    { label: 'Email', value: a.email },
    { label: 'SSN', value: a.ssn },
    { label: "Driver's License", value: a.driversLicense },
    { label: 'State of Issuance', value: a.stateIssuance },
    { label: 'Address', value: `${a.address}, ${a.city}, ${a.state} ${a.zip}` },
    { label: 'Housing Status', value: a.housingStatus },
    { label: 'Monthly Rent', value: a.monthlyRent ? `$${a.monthlyRent}` : null },
    { label: 'Time at Address', value: a.timeAtAddress },
    { label: 'Employment Status', value: a.employmentStatus },
    { label: 'Employer', value: a.employer },
    { label: 'Job Title', value: a.jobTitle },
    { label: 'Monthly Income', value: `$${a.monthlyIncome}` },
    { label: 'Time Employed', value: a.timeEmployed },
    { label: 'Vehicle Interest', value: [a.vehicleYear, a.vehicleMake, a.vehicleModel].filter(Boolean).join(' ') || null },
    { label: 'Stock #', value: a.stockNumber },
    { label: 'Trade-In', value: a.tradeIn },
    { label: 'Loan Amount', value: `$${a.loanAmount}` },
    { label: 'Down Payment', value: `$${a.downPayment}` },
    { label: 'Desired Monthly', value: a.desiredMonthly ? `$${a.desiredMonthly}` : null },
    { label: 'Reference Name', value: a.refName },
    { label: 'Reference Phone', value: a.refPhone },
    { label: 'Reference Relation', value: a.refRelation },
    { label: 'Signature', value: a.signature },
    { label: 'Agreed to Terms', value: a.agreeTerms ? 'Yes' : 'No' },
  ]

  return (
    <DetailView
      type="financing"
      item={a}
      fields={fields}
      title={`Financing — ${a.firstName} ${a.lastName}`}
      backHref="/admin/financing"
      statusOptions={[
        { value: 'new',       label: 'New' },
        { value: 'reviewed',  label: 'Reviewed' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'approved',  label: 'Approved' },
        { value: 'rejected',  label: 'Rejected' },
      ]}
    />
  )
}
