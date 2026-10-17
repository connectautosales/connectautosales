import { OG_IMAGE } from '@/lib/seo'

export const metadata = {
  title: 'Auto Financing in Dearborn Heights, MI - All Credit Welcome',
  description: 'Get approved for auto financing at Connect Auto Sales in Dearborn Heights, Michigan. Bad credit, no credit and first-time buyers welcome. Apply online in minutes.',
  alternates: { canonical: '/financing' },
  openGraph: {
    images: [OG_IMAGE],
    url: '/financing',
    title: 'Auto Financing in Dearborn Heights, MI | Connect Auto Sales',
    description: 'Get approved for auto financing in Dearborn Heights. Bad credit, no credit and first-time buyers welcome. Apply online in minutes.',
  },
}

export default function FinancingLayout({ children }) {
  return children
}
