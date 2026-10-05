import NotFoundView from '@/components/NotFoundView/NotFoundView'

export const metadata = {
  title: 'Vehicle No Longer Available',
  robots: { index: false },
}

export default function VehicleNotFound() {
  return (
    <NotFoundView
      heading="This vehicle is no longer available"
      text="Our inventory changes every week. Browse what's in stock now, or call us and we'll help you find something similar."
    />
  )
}
