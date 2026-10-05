import NotFoundView from '@/components/NotFoundView/NotFoundView'

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <NotFoundView
      heading="We couldn't find that page"
      text="The page may have moved. Browse our current inventory, or call us and we'll point you in the right direction."
    />
  )
}
