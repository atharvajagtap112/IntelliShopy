import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { getOrderById } from "../../../State/Order/Action";
import { updatePayment } from "../../../State/Payment/Action";
import OrderTracker from "../Order/OrderTracker";
import AddressCard from "../AddressCard/adddressCard";
import Loading from "../Loading/loading";

const EASE = [0.16, 1, 0.3, 1];

const PaymentSucess = () => {
  const [paymentId, setPaymentId] = React.useState();
  const [paymentStatus, setPaymentStatus] = React.useState();
  const { orderId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setPaymentId(searchParams.get("razorpay_payment_id"));
    setPaymentStatus(searchParams.get("razorpay_payment_link_status"));
  }, []);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId, dispatch]);

  useEffect(() => {
    if (paymentId) {
      dispatch(updatePayment({ orderId, paymentId }));
    }
  }, [orderId, paymentId, dispatch]);

  const o = order.order;
  const inr = (n) => "₹" + Number(n ?? 0).toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* A success page's job is to confirm WHAT was bought, for how much, and
            where it is going - so lead with those facts. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-300">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8.5l3.5 3.5L13 5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {paymentStatus === "paid" ? "Payment received" : "Order placed"}
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-tighter text-white sm:text-5xl">
            Thank you{o?.user?.firstName ? ", " + o.user.firstName : ""}.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
            Your order is confirmed. We have emailed the receipt and will let you
            know the moment it ships.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-left">
            {[
              ["Order", o?.orderId ? "#" + o.orderId : "#" + orderId],
              ["Items", o?.totalItem ?? o?.orderItems?.length ?? "-"],
              ["Total paid", inr(o?.totalDiscountedPrice)],
              ["Payment ID", paymentId || "-"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-1 max-w-[16rem] truncate text-sm font-semibold text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mb-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 sm:px-8">
          <OrderTracker activeStep={1} />
        </div>

        {order.loading ? (
          <Loading variant="rows" />
        ) : !o ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-[15px] font-medium text-white">
              Your payment went through.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              We could not load the order details just now, but the order is
              recorded. You can see it in your orders.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => navigate("/account/order")}
                className="w-full rounded-full bg-white py-3 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98]"
              >
                Go to my orders
              </button>
              <button
                onClick={() => dispatch(getOrderById(orderId))}
                className="w-full rounded-full border border-white/15 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-white/35 hover:text-white active:scale-[0.98]"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="space-y-3">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
                In this order
              </h2>

              {o?.orderItems?.map((item, i) => (
                <motion.div
                  key={item.id ?? i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                  onClick={() =>
                    item?.product?.id && navigate("/product/" + item.product.id)
                  }
                  className="flex cursor-pointer gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <img
                    className="h-28 w-24 shrink-0 rounded-xl object-cover object-top"
                    src={item?.product?.imageUrl}
                    alt={item?.product?.title}
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                      {item?.product?.brand}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[15px] font-medium text-white">
                      {item?.product?.title}
                    </p>
                    <p className="mt-1.5 text-[13px] text-zinc-500">
                      Size {item?.size} &middot; Qty {item?.quantity ?? 1}
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-tight text-white">
                      {inr(item?.discountedPrice)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order-level details. The address belongs to the ORDER, not to each
                item - it used to sit inside the item loop and repeated itself
                once per product. */}
            <motion.aside
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="space-y-4 lg:sticky lg:top-24 lg:self-start"
            >
              <AddressCard address={o?.shippingAddress} />

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>{inr(o?.totalPrice)}</span>
                  </div>
                  {!!o?.discount && (
                    <div className="flex justify-between text-accent-400">
                      <span>Discount</span>
                      <span>-{inr(o?.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery</span>
                    <span className="text-accent-400">Free</span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                    <span className="font-semibold text-white">Total paid</span>
                    <span className="text-xl font-semibold tracking-tight text-white">
                      {inr(o?.totalDiscountedPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Without these a success page is a dead end. */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => navigate("/account/order")}
                  className="w-full rounded-full bg-white py-3 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98]"
                >
                  Track this order
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full rounded-full border border-white/15 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-white/35 hover:text-white active:scale-[0.98]"
                >
                  Continue shopping
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSucess;
