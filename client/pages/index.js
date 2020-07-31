import Router from "next/router";
import Link from "next/link";

const LandingPage = ({ tickets }) => {

  const renderTickets = () => {
    if (tickets && tickets.length > 0) {
      return tickets.map((ticket) => (
        <div className="col-md-4 mt-4" key={ticket.id}>
          <div className="card">
            <div className="card-body">
              <p>{ticket.title} - {ticket.price}</p>
              <Link 
                href="/tickets/[ticketId]" 
                as={`/tickets/${ticket.id}`}>
                <a className="btn-sm btn-success mr-2">View</a>
              </Link>

              <button
                onClick={() => Router.push(`/orders/${ticket.id}`)} 
                className="btn-sm btn-primary mr-2"
                >Buy now
              </button>
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
        <h3 className="mt-4">All Tickets</h3>
        <div className="row mt-4">
        {renderTickets()}
        </div>
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const {data} = await client.get('/api/tickets');
  return {tickets: data};
};

export default LandingPage;
