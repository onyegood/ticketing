import React,{useState} from 'react';
import Router from 'next/router';
import useRequest from '../../../hooks/use-request';

const CreateNewTicket = () => {
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [focus, setFocus] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
  
    doRequest();
  };

  const {doRequest, errors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess:() => Router.push('/')
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if(isNaN(value)){
      return;
    }

    setPrice(value.toFixed(2));
  }

  const onFocus = (field) => {
    setFocus(field);
  }

  return (
    <div className="col-md-4 mx-auto card mt-4 p-4">
      <h1>Create New Ticket</h1>
      <hr />
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            name="title"
            onFocus={() => onFocus('title')}
            onChange={e => setTitle(e.target.value)}
          />
          {focus === 'title' && <p>Title is onFocus</p>}
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            name="price"
            onBlur={onBlur}
            onFocus={() => onFocus('price')}
            onChange={e => setPrice(e.target.value)}
          />
          {focus === 'price' && <p>Price is onFocus</p>}
        </div>

        {errors}

        <div className="form-group">
          <button className="btn btn-success">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewTicket;
