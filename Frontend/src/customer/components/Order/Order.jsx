import { Grid } from '@mui/material'
import  { useEffect } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux'
import { getOrders } from '../../../State/Order/Action'
import { useLocation, useNavigate } from 'react-router-dom'
const orderStatus=[
    {label:"On The Way", value:"OUT_FOR_DELIVERY"},
    {label:"Delivered", value:"DELIVERED"},
    {label:"Shipped", value:"SHIPPED"},
    {label:"Confirmed", value:"ORDER_CONFIRMED"},
    {label:"Cancelled",value:"CANCELLED"},
    {label:"Returned", value:"RETURNED"},
 ]

const Order = () => {
  const dispatch = useDispatch();
  const { order } = useSelector(store => store);

  const location=useLocation();

  const navigation = useNavigate();
   
  const searchParams = new URLSearchParams(location.search);

const onHandleFilter = (value) => {
  const param = searchParams.get('status'); // use get instead of getAll
  let params = [];

  if (param) {
    // Decode the value to prevent %2C issues
    params = decodeURIComponent(param).split(',');

    if (params.includes(value)) {
      params = params.filter((item) => item !== value);
      if (params.length === 0) {
        searchParams.delete('status');
      } else {
        searchParams.set('status', params.join(','));
      }
    } else {
      params.push(value);
      searchParams.set('status', params.join(','));
    }
  } else {
    searchParams.set('status', value);
  }

  const newUrl = searchParams.toString();
  navigation({
    search: `?${newUrl}`
  });
};




  useEffect(() => {
      const status = searchParams.get('status');
      var params=[]
     params= decodeURIComponent(status).split(',')
    const data= {
        status:  params[0]!=="null"?params:["ALL"]
      }
     
      console.log("data", data);

    dispatch(getOrders(data))
  }, [searchParams.get('status')])



  return (
    <div className='px-5 lg:px-20 py-8 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-8 text-gray-800'>My Orders</h1>
      <Grid container spacing={3} sx={{ justifyContent: "space-between" }}></Grid>
        <Grid container spacing={2} sx={{justifyContent:"space-between"}}>
             
             <Grid item xs={2.5}  flex={0.25}>  
                <div className='h-auto shadow-lg bg-white p-5 sticky top-5 text-left'>
                    <h1 className='font-bold text-lg'>Filter</h1>
                    <div className='space-y-4 mt-10'>
                        <h1 className='font-semibold'>ORDER STATUS</h1> 
                         
                         {orderStatus.map((option)=>  
                        <div className='flex items-center'> 
                          <input type="checkbox" defaultValue={option.value} onChange={(e) => {onHandleFilter(option.value)}}
                          className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500' />
                            <label className='ml-3 text-sm text-gray-600'>{option.label}</label>
                        </div>
                        )}
                    </div>

                </div>
             </Grid>
             <Grid item xs={9} flex={0.9} spacing={1} margin={2} >
              <div className='space-y-5'>
               { order.orders?.length===0?  
                     
              <div className='flex items-center justify-center h-full'>
                  <h1 className='text-2xl font-bold text-gray-500'>No Orders Found</h1> </div>
               : order.orders?.map((item)=>  <OrderCard order={item} />) 
             
             }
               </div>
              
             </Grid>
            
            </Grid>
    </div>
  )
}

export default Order