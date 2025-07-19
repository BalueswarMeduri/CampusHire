import React from 'react'
import Hero from '../../components/Hero/Hero'
import Herotwo from '../../components/Herotwo/Herotwo'
import Herothree from '../../components/Herothree/Herothree'
import Herofour from '../../components/Herofour/Herofour'
import Herofive from '../../components/Herofive/Herofive'


const Homepage = () => {
  return (
    <div className='relative flex size-full min-h-screen flex-col bg-[#fcfbf8] group/design-root overflow-x-hidden '>
        <Hero/>
        <Herotwo/>
        <Herothree/>
        <Herofour/>
        <Herofive/>
    </div>
  )
}

export default Homepage