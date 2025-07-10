import Footer from './_components/footer'
import { Heading } from './_components/heading'

const MarketingPage = () => {
  return (
    <div className='flex h-full flex-col overflow-x-hidden'>
      <div className='flex flex-1 flex-col items-center justify-center gap-y-6 px-4 pb-8 text-center md:justify-start md:gap-y-8 md:px-6 md:pb-10'>
        <Heading />
      </div>
      <Footer />
    </div>
  )
}

export default MarketingPage
