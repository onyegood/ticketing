import Link from 'next/link';

export default ({currentUser}) => {
  const links = [
    !currentUser && {label: 'Sign Up', href: '/auth/signup'},
    !currentUser && {label: 'Sign In', href: '/auth/signin'},
    currentUser && {label: 'All Tickets', href: '/'},
    currentUser && {label: 'My Orders', href: '/orders'},
    currentUser && {label: 'Create Ticket', href: '/tickets/new'},
    currentUser && {label: 'Sign Out', href: '/auth/signout'},
  ]
    .filter((linkConfig) => linkConfig)
    .map(({label, href}) => {
      return (
        <li className="nav-item" key={href}>
          <Link href={href}>
            <a className="nav-link">
              {label}
            </a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">LOGO</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-item-center">{links}</ul>
      </div>
    </nav>
  );
};
