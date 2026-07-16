import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const d = await req.json()

    await prisma.$executeRaw`
      INSERT INTO FinancingApplication (
        firstName, middleName, lastName, dob, phone, homePhone, email, ssn,
        idType, driversLicense, idExpiration, stateIssuance,
        address, city, state, zip,
        timeAtAddressYr, timeAtAddressMo, housingStatus, monthlyRent,
        landlordName, landlordPhone,
        prevAddress, prevCity, prevState, prevZip,
        employmentStatus, incomeSource, incomeAmount, incomeFrequency, hoursPerWeek,
        occupation, employer, employerCity, employerState, employerPhone, supervisor,
        timeEmployedYr, timeEmployedMo, jobTitle, monthlyIncome, prevEmployer,
        addlIncome, addlIncomeSource, addlIncomeAmount, addlIncomeFreq,
        vehicleYear, vehicleMake, vehicleModel, vehicleMileage, stockNumber,
        tradeIn, tradeInPaidOff, tradeInPayoff,
        tradeInYear, tradeInMake, tradeInModel, tradeInMileage, tradeInVin,
        loanAmount, downPayment, desiredMonthly,
        additionalComments, referralSource,
        hasReference, refName, refPhone, refRelation, refAddress,
        signature, agreeTerms, status, createdAt
      ) VALUES (
        ${d.firstName || ''}, ${d.middleName || null}, ${d.lastName || ''}, ${d.dob || ''}, ${d.phone || ''}, ${d.homePhone || null}, ${d.email || ''}, ${d.ssn || ''},
        ${d.idType || null}, ${d.driversLicense || ''}, ${d.idExpiration || null}, ${d.stateIssuance || ''},
        ${d.address || ''}, ${d.city || ''}, ${d.state || ''}, ${d.zip || ''},
        ${d.timeAtAddressYr || null}, ${d.timeAtAddressMo || null}, ${d.housingStatus || null}, ${d.monthlyRent || null},
        ${d.landlordName || null}, ${d.landlordPhone || null},
        ${d.prevAddress || null}, ${d.prevCity || null}, ${d.prevState || null}, ${d.prevZip || null},
        ${d.employmentStatus || ''}, ${d.incomeSource || null}, ${d.incomeAmount || null}, ${d.incomeFrequency || null}, ${d.hoursPerWeek || null},
        ${d.occupation || null}, ${d.employer || null}, ${d.employerCity || null}, ${d.employerState || null}, ${d.employerPhone || null}, ${d.supervisor || null},
        ${d.timeEmployedYr || null}, ${d.timeEmployedMo || null}, ${d.jobTitle || null}, ${d.monthlyIncome || ''}, ${d.prevEmployer || null},
        ${d.addlIncome || null}, ${d.addlIncomeSource || null}, ${d.addlIncomeAmount || null}, ${d.addlIncomeFreq || null},
        ${d.vehicleYear || null}, ${d.vehicleMake || null}, ${d.vehicleModel || null}, ${d.vehicleMileage || null}, ${d.stockNumber || null},
        ${d.tradeIn || null}, ${d.tradeInPaidOff || null}, ${d.tradeInPayoff || null},
        ${d.tradeInYear || null}, ${d.tradeInMake || null}, ${d.tradeInModel || null}, ${d.tradeInMileage || null}, ${d.tradeInVin || null},
        ${d.loanAmount || ''}, ${d.downPayment || ''}, ${d.desiredMonthly || null},
        ${d.additionalComments || null}, ${d.referralSource || null},
        ${d.hasReference || null}, ${d.refName || null}, ${d.refPhone || null}, ${d.refRelation || null}, ${d.refAddress || null},
        ${d.signature || ''}, ${d.agreeTerms ? 1 : 0}, 'new', NOW()
      )
    `

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Financing submit error:', e)
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 })
  }
}
