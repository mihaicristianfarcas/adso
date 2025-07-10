import NavBar from './_components/navbar'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen w-full flex-col overflow-x-hidden dark:bg-[#1F1F1F]'>
      <NavBar />
      <main className='w-full flex-1 pt-24 md:pt-40'>{children}</main>
    </div>
  )
}

export default MarketingLayout
