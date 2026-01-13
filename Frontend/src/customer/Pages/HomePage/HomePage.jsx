import React, { use, useEffect } from 'react'
import MainCarousel from '../../HomeCarosal/MainCarosel'
import HomeSectionCarosel from '../../components/HomeSectionCarosel/HomeSectionCarosel'
import { mens_kurta } from '../../Data/Men/men_kurta'
import { kurtaPage1 } from '../../Data/Kurta/kurta'
import { dressPage1 } from '../../Data/dress/page1'
import { mensShoesPage1 } from '../../Data/shoes'
import Footer from '../../components/Footer/Footer'
import Product from '../../components/Product/Product'
import { findProducts, findProductsByCategories } from '../../../State/Product/Action'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '../../../State/store'
import Loading from '../../components/Loading/loading'

const HomePage = () => {

  const dispatch = useDispatch();

  const {products} =useSelector(store =>store) 
 

 

    useEffect(() => {
           
       const data=[
            {
              categoryTitle:"Men's Kurta",
              categoryName:"mens_kurta"
            },

             {
              categoryTitle:"Sarees",
              categoryName:"saree"
            }
            ,
            { 
               categoryTitle:"Tops",
              categoryName:"top"

            }

       ]

          
      dispatch(findProductsByCategories(data));
    },[
     
  ])   
    

  
  return (
    <div>

         
        <MainCarousel />
         {products.loading?

            <Loading/>

    :
        <div className=' py-3 md:py-6'>
           < HomeSectionCarosel data={products?.productsByCategories[0]?.products} sectionName={products?.productsByCategories[0]?.categoryName} />
           < HomeSectionCarosel data={products?.productsByCategories[1]?.products } sectionName={products?.productsByCategories[1]?.categoryName}/>
           < HomeSectionCarosel data={products?.productsByCategories[2]?.products }  sectionName={products?.productsByCategories[2]?.categoryName }/>
        </div>}
       
    </div>
  )
}

export default HomePage