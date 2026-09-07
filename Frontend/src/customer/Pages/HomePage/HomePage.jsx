import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import MainCarousel from '../../HomeCarosal/MainCarosel'
import HomeSectionCarosel from '../../components/HomeSectionCarosel/HomeSectionCarosel'
import Loading from '../../components/Loading/loading'
import { findProductsByCategories } from '../../../State/Product/Action'

const CATEGORIES = [
  { categoryTitle: "Men's Kurta", categoryName: 'mens_kurta' },
  { categoryTitle: 'Sarees', categoryName: 'saree' },
  { categoryTitle: 'Tops', categoryName: 'top' },
]

const HomePage = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((store) => store)

  useEffect(() => {
    dispatch(findProductsByCategories(CATEGORIES))
  }, [dispatch])

  return (
    <div className="relative bg-zinc-950">
      {/* Immersive canvas: one very low-opacity accent bloom for depth, plus grain
          so the large dark fills never read as flat empty space. Both decorative
          and fixed, so they cost nothing on scroll. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            "radial-gradient(60rem 40rem at 15% 12%, rgba(225,29,84,0.10), transparent 60%), radial-gradient(50rem 35rem at 85% 70%, rgba(63,63,70,0.35), transparent 65%)",
        }}
      />
      <div aria-hidden className="grain-layer fixed inset-0 z-0 opacity-[0.09]" />

      <div className="relative z-10">
        <MainCarousel />

      {products.loading ? (
        <Loading />
      ) : (
        <div className="py-10 md:py-20 space-y-14 md:space-y-24">
          {CATEGORIES.map((_, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <HomeSectionCarosel
                data={products?.productsByCategories[i]?.products}
                sectionName={products?.productsByCategories[i]?.categoryName}
              />
            </motion.section>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

export default HomePage
