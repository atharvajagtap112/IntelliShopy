import { Avatar, Box, Grid, Rating } from '@mui/material'
import React from 'react'
import dayjs from 'dayjs';

function ProductReviewsCard({item}) {
  return (
    <Grid container spacing={2} gap={3}>
        <Grid item xs={1}>
            <Box>
            <Avatar sx={{ width: 56, height: 56, bgcolor: '#9155fd' }}>{item?.user.firstName.charAt(0)}{item?.user.lastName.charAt(0) }</Avatar>
            </Box>
        </Grid>

        <Grid xs={9} item textAlign={'left'} >

            <div className='space-y-2'>
            <p className='font-semibold text-lg'>{item?.user.firstName} {item?.user.lastName}</p>
            <p className='opacity-70'> {dayjs(item?.createdAt).format('MMMM D YYYY')}</p>
            </div>

            <Rating name="read-only" value={item?.rating} readOnly precision={.5}/>
            <p>
                {item?.review}
            </p>
        </Grid>
    </Grid>
  )
}

export default ProductReviewsCard