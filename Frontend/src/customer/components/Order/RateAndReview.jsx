import { Rating } from '@mui/material'
import React, { use } from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, TextField, Box, Typography, Paper } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addReview } from '../../../State/Order/Action'

const RateAndReview = () => {
    const param = useParams();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [formData, setFormData] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (formData) {
            dispatch(addReview(formData))
                
            setRating(0);
            setReview('');
            setFormData(null);
            
                  
               
        }
    }, [formData, param.productId])

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData({
            productId: Number(param.productId),
            review: review,
            rating: rating
        });
    }

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Rate & Review Product
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Rating 
                    precision={.5}
                    value={rating}
                    onChange={(e, newValue) => setRating(newValue)}
                />
                <TextField
                    multiline
                    rows={4}
                    label="Write your review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <Button 
                    variant="contained" 
                    type="submit"
                    disabled={!rating || !review}
                >
                    Submit Review
                </Button>
            </Box>
        </Paper>
    )
}

export default RateAndReview