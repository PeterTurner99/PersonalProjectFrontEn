export const NavLinks = [
  {
    label: 'Dashboard',
    authRequired: false,
    href: '/',
    linkName: 'Dashboard',
    subLinks: [{

    }]

  },
  {
    label: 'Recipes',
    authRequired: true,
    href: '/recipes/',
    linkName: 'recipes',
    subLinks: [{
      'href' : '/recipes/upload',
      'label' : 'Add new'
  }]
  },
  {
    label: 'Ingredients',
    authRequired: true,
    href: '/ingredients/',
    linkName: 'ingredients',
    subLinks: [{
        'href' : '/ingredients/upload',
        'label' : 'Add new'
    },
    {
        'href' : '/ingredients/shopping',
        'label': 'Shopping List'
    }]
  },
  {
    label: 'Calendar',
    authRequired: true,
    href: '/calendar/quickview/',
    linkName: 'calendar',
    subLinks: [{
        'href' : '/calendar/',
        'label': 'Edit'
    }]
  },
]


export const NonUserLinks = [
  {
    label: 'Signup',
    authRequired: false,
    href: '/signup'
  },
  {
    label: 'Login',
    authRequired: false,
    href: '/login'
  },
]


export default NavLinks