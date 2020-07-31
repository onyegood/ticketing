import Router from "next/router";
import Link from "next/link";

const OrdersPage = ({ orders }) => {

  const renderOrders = () => {
    if (orders && orders.length > 0) {
      return orders.map((order) => (
        <div className="col-md-4 mt-4" key={order.id}>
          <div className="card">
            <div className="card-body">
              <p>{order.ticket.title} - {order.ticket.price}</p>
              <p>{order.status}</p>
              <Link 
                href="/orders/[ticketId]" 
                as={`/orders/${order.id}`}>
                <a className="btn-sm btn-success mr-2">View</a>
              </Link>
            </div>
          </div>
        </div>
      ));
    }else{
      return <p>No data</p>
    }
  };
  return (
    <div className="container-fluid">
      <div className="container">
        <h3 className="mt-4">All Orders</h3>
        <div className="row mt-4">
        {renderOrders()}
        </div>
      </div>
    </div>
  );
};

OrdersPage.getInitialProps = async (context, client, currentUser) => {
  const {data} = await client.get('/api/orders');
  return {orders: data};
};

export default OrdersPage;
