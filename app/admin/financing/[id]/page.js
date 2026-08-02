import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { decryptSSN } from '@/lib/encrypt'
import DetailView from '../../DetailView'

export default async function FinancingDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const { id } = await params
  const rows = await prisma.$queryRaw`SELECT * FROM financingapplication WHERE id = ${parseInt(id)} LIMIT 1`

  const a = rows[0]
  if (!a) notFound()

  const fields = [
    // Personal
    { label: 'First Name',          value: a.firstName },
    { label: 'Middle Name',         value: a.middleName },
    { label: 'Last Name',           value: a.lastName },
    { label: 'Date of Birth',       value: a.dob ? (() => { const [y,m,d] = String(a.dob).split('T')[0].split('-'); return `${m}/${d}/${y}` })() : null },
    { label: 'Cell Phone',          value: a.phone },
    { label: 'Home Phone',          value: a.homePhone },
    { label: 'Email',               value: a.email },
    { label: 'SSN',                 value: decryptSSN(a.ssn) },
    // ID
    { label: 'ID Type',             value: a.idType },
    { label: "Driver's License / ID #", value: a.driversLicense },
    { label: 'ID Expiration',       value: a.idExpiration ? (() => { const [y,m,d] = String(a.idExpiration).split('T')[0].split('-'); return `${m}/${d}/${y}` })() : null },
    { label: 'State of Issuance',   value: a.stateIssuance },
    // Residence
    { label: 'Street Address',       value: a.address },
    { label: 'City, State ZIP',     value: [a.city, a.state, a.zip].filter(Boolean).join(', ') },
    { label: 'Time at Address',     value: a.timeAtAddressYr != null ? `${a.timeAtAddressYr} yr ${a.timeAtAddressMo || 0} mo` : a.timeAtAddress },
    { label: 'Housing Status',      value: a.housingStatus },
    { label: 'Monthly Rent',        value: a.monthlyRent ? `$${a.monthlyRent}` : null },
    { label: 'Landlord Name',       value: a.landlordName },
    { label: 'Landlord Phone',      value: a.landlordPhone },
    { label: 'Prev Street Address',  value: a.prevAddress || null },
    { label: 'Prev City, State ZIP', value: [a.prevCity, a.prevState, a.prevZip].filter(Boolean).join(', ') || null },
    { label: 'Time at Prev Address', value: a.prevTimeAtAddressYr != null ? `${a.prevTimeAtAddressYr} yr ${a.prevTimeAtAddressMo || 0} mo` : null },
    { label: 'Prev Monthly Rent',    value: a.prevMonthlyRent ? `$${a.prevMonthlyRent}` : null },
    // Employment
    { label: 'Employment Status',   value: a.employmentStatus },
    { label: 'Occupation',          value: a.occupation || a.jobTitle },
    { label: 'Employer',             value: a.employer },
    { label: 'Employer Street',      value: a.employerAddress },
    { label: 'Employer City, State ZIP', value: [a.employerCity, a.employerState, a.employerZip].filter(Boolean).join(', ') },
    { label: 'Employer Phone',      value: a.employerPhone },
    { label: 'Supervisor',          value: a.supervisor },
    { label: 'Time Employed',        value: a.timeEmployedYr != null ? `${a.timeEmployedYr} yr ${a.timeEmployedMo || 0} mo` : a.timeEmployed },
    { label: 'Income Source',        value: a.incomeSource },
    { label: 'Income Amount',        value: a.monthlyIncome ? `$${a.monthlyIncome}` : null },
    { label: 'Income Frequency',     value: a.incomeFrequency },
    { label: 'Additional Income',    value: a.addlIncome },
    { label: 'Additional Income Source', value: a.addlIncomeSource },
    { label: 'Additional Income Amount', value: a.addlIncomeAmount ? `$${a.addlIncomeAmount}` : null },
    { label: 'Additional Income Frequency', value: a.addlIncomeFreq },
    // Vehicle
    { label: 'Vehicle Interest',    value: [a.vehicleYear, a.vehicleMake, a.vehicleModel].filter(Boolean).join(' ') || null },
    { label: 'Vehicle Mileage',     value: a.vehicleMileage },
    { label: 'Stock #',             value: a.stockNumber },
    // Trade-In
    { label: 'Trade-In',            value: a.tradeIn },
    { label: 'Trade-In Paid Off',   value: a.tradeInPaidOff },
    { label: 'Trade-In Payoff',     value: a.tradeInPayoff ? `$${a.tradeInPayoff}` : null },
    { label: 'Trade-In Vehicle',    value: [a.tradeInYear, a.tradeInMake, a.tradeInModel].filter(Boolean).join(' ') || null },
    { label: 'Trade-In Mileage',    value: a.tradeInMileage },
    { label: 'Trade-In VIN',        value: a.tradeInVin },
    // Payment
    { label: 'Loan Amount',         value: a.loanAmount ? `$${a.loanAmount}` : null },
    { label: 'Down Payment',        value: a.downPayment ? `$${a.downPayment}` : null },
    { label: 'Desired Monthly',     value: a.desiredMonthly ? `$${a.desiredMonthly}` : null },
    { label: 'Additional Comments', value: a.additionalComments },
    { label: 'Referral Source',     value: a.referralSource },
    // References
    { label: 'Reference Name',      value: a.refName },
    { label: 'Reference Phone',     value: a.refPhone },
    { label: 'Reference Relation',  value: a.refRelation },
    { label: 'Reference Address',   value: a.refAddress },
    // Agreement
    { label: 'Signature',           value: a.signature },
    { label: 'Agreed to Terms',     value: a.agreeTerms ? 'Yes' : 'No' },
  ]

  return (
    <DetailView
      type="financing"
      item={{ ...a, id: Number(a.id) }}
      fields={fields}
      title={`Financing — ${a.firstName} ${a.lastName}`}
      backHref="/admin/financing"
      showPriority={true}
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
