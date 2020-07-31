import React, {useEffect, useState} from 'react';
import Router from 'next/router';
// import StripeCheckout from 'react-stripe-checkout';
// import { usePaystackPayment, PaystackButton, PaystackConsumer } from 'react-paystack';
import useRequest from '../../../hooks/use-request';

const config = {
  reference: (new Date()).getTime(),
  email: "user@example.com",
  amount: 20000,
  publicKey: 'pk_test_dsdfghuytfd2345678gvxxxxxxxxxx',
};

const PaystackHookExample = () => {
  const initializePayment = usePaystackPayment(config);
  return (
      <div>
          <button onClick={() => {
              initializePayment()
          }}>Paystack Hooks Implementation</button>
      </div>
  );
};

const OrderDetails = ({ order, currentUser }) => {

  const componentProps = {
    ...config,
    text: 'Paystack Button Implementation',
    onSuccess: () => null,
    onClose: () => null
};
  

  const [timer, setTimer] = useState(0);
  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => Router.push('/orders')
  });
  
  useEffect(() => {
    const handleTimerInterval = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      const time = Math.round(msLeft / 1000);
      setTimer(time);
    }

    handleTimerInterval();
    const timerId = setInterval(handleTimerInterval, 1000);
    return () => {
      clearInterval(timerId);
    }
  }, [order]);

  if (timer < 0) {
    return (<div>Order expired</div>)
  }

  return (
    <div>
      <h2>Purchasing {order.ticket.title} - ${order.ticket.price}</h2>
      <p>You have {timer} seconds to pay for this ticket until order expires</p>

      {/*<PaystackHookExample />
      <PaystackButton {...componentProps} />
      <PaystackConsumer {...componentProps} >
      {({initializePayment}) => <button onClick={() => initializePayment()}>Paystack Consumer Implementation</button>}
      </PaystackConsumer>*/}

      {/*<StripeCheckout
        token={({id}) => doRequest({ token: id })} 
        stripeKey="pk_test_ifGTKImvB4YknczS5x9OT7Ub"
        amout={order.ticket.price * 100}
        email={currentUser.email}
      />*/}
      {errors}
    </div>
  );
}

OrderDetails.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return {order: data};
};

export default OrderDetails;