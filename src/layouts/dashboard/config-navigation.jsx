import SvgColor from '../..//components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = (role) => {
  const allConfig = [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {
      title: 'Employees',
      path: '/employees',
      icon: icon('ic_user'),
    },
    {
      title: 'Products',
      path: '/products',
      icon: icon('ic_user'),
    },
    {
      title: 'Reporting',
      path: '/reporting',
      icon: icon('ic_analytics'),
    }
  ];

  switch (role) {
    case 'Admin':
      return allConfig.filter((item) => !['dashboard'].includes(item.title));
    case 'Manager':
      return allConfig.filter((item) => !['dashboard'].includes(item.title));
    case 'Sales Assistant':
      return allConfig.filter((item) => item.title === 'dashboard')
    default:
      return allConfig;
      // return <div>No dashboard available for this role.</div>;
  }
} 

export default navConfig;
