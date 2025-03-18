import Link from 'next/link'
import { headers } from 'next/headers'
 
export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('host')
  return (
    <div>
      <h2 className='font-semibold text-xl'>Хуудас олдсонгүй: {domain}</h2>
      <p className='text-sm text-muted-foreground  mb-2'>Та өөр хуудсанд зочилно уу!</p>
      <p className='text-sm font-semibold text-blue-500'>
        <Link href="/">Нүүр хуудас</Link>
      </p>
    </div>
  )
}