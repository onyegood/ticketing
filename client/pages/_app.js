// import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';
import buildClient from '../api/build-client';

const AppComponent = ({Component, pageProps, currentUser}) => {
  return (
    <div className="container-fluid">
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get(`/api/users/me`);

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }
  
  return { 
    pageProps,
    ...data
  };

}
export default AppComponent;