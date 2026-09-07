import { useNavigate } from "react-router-dom";

import PaymentIcon from "@mui/icons-material/Payment";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

 
    const getStatus = {
      'PLACED': {
        status: "PLACED",
        color: 'bg-accent-500/15 text-accent-300 border-accent-500/30'
      },

      'PENDING': {
        status:"PENDING",
        color:'bg-accent-500/15 text-accent-300 border-accent-500/30'}
        ,
      'ORDER_CONFIRMED': {
        status:"CONFIRMED",
       color: 'bg-accent-500/15 text-zinc-200 border-white/15'}
        ,
      'SHIPPED':{ 
        status:"SHIPPED",
       color: 'bg-white/10 text-zinc-200 border-white/15'},
      'DELIVERED':{ 
        status:"DELIVERED",
       color: 'bg-white/10 text-zinc-200 border-white/15'},

      'OUT_FOR_DELIVERY':{ 
       status:"OUT_FOR_DELIVERY",
        color: 'bg-accent-500/15 text-accent-300 border-accent-500/30'},

      'CANCELLED':{ 
       status:"CANCELLED", 
       color: 'bg-accent-600/20 text-accent-300 border-accent-500/30'},
    };
   


  const getPaymentStatusColor = (status) => {
    return status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'paid'
      ? 'text-accent-400'
      : 'text-zinc-400';
  };

  return (
    <div
      onClick={() => navigate(`/account/order/${order.id}`)}
      className="group relative bg-zinc-900 rounded-xl shadow-sm border border-white/10 p-6 hover:shadow-xl hover:border-white/15 cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute text-left inset-0 bg-white/5 opacity-0 group-hover:opacity-50 rounded-xl transition-opacity duration-200"></div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">#{order.id.toString().slice(-2)}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
              <p className="text-sm text-zinc-500">
                Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatus[order.orderStatus]?.color}`}>
            {getStatus[order.orderStatus]?.status || 'Unknown Status'}
          </span>
        </div>

        <div className="grid grid-cols-1 text-left lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Order Details</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                <span className="text-sm text-zinc-400">
                  {order.totalItem} {order.totalItem === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                <span className="text-sm text-zinc-400">
                  Total: <span className="font-semibold text-white">₹{order.totalPrice.toLocaleString()}</span>
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span className="text-sm text-accent-400 font-medium">
                    Saved ₹{order.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <PaymentIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                <span className={`text-sm font-medium ${getPaymentStatusColor(order.paymentDetails.status)}`}>
                  Payment {order.paymentDetails.status}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Delivery Info</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-zinc-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="text-sm text-zinc-400">Expected Delivery</p>
                  <p className="text-sm font-medium text-white">
                    {order.deliveryDate 
                      ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Pending'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Shipping To</h4>
            <div className="min-w-0 bg-white/5 rounded-lg p-3 space-y-1 [overflow-wrap:anywhere]">
              <p className="text-sm font-medium text-white">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-sm text-zinc-400 [overflow-wrap:anywhere]">
                {order.shippingAddress.streetAddress}, {order.shippingAddress?.zipCode}
              </p>
              <p className="text-sm text-zinc-400">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="text-sm text-zinc-400">📱 {order.shippingAddress.mobile}</p>
            </div>
          </div>
        </div>

        {/* Footer with Action Hint */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-zinc-500 group-hover:text-zinc-400 transition-colors">
              <span className="text-sm">Click to view details</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-xs text-zinc-500">
              Order ID: {order.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
