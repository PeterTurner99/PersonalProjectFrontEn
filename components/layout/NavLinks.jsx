import { send_notification } from "@/lib/push"
import { Button } from "../ui/button"

export const NavLinks = [
  {
    label: 'Dashboard',
    authRequired: false,
    href: '/',
    linkName: 'Dashboard',
    subLinks: [ ],
    buttons: []

  },
  {
    label: 'Push Notifications',
    authRequired: false,
    href: '/push/',
    linkName: 'Push',
    subLinks: [],
    buttons: [
    <Button onClick={()=>send_notification('New page link recieved', 'sent a new page')} className="">
                      Send this page
    </Button>
    
    ]

  },
  {
    label: 'Recipes',
    authRequired: true,
    href: '/recipes/',
    linkName: 'recipes',
    subLinks: [{
      'href' : '/recipes/upload',
      'label' : 'Add new'
  }],
    buttons: []
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
    }],
    buttons: []
  },
  {
    label: 'Calendar',
    authRequired: true,
    href: '/calendar/quickview/',
    linkName: 'calendar',
    subLinks: [{
        'href' : '/calendar/',
        'label': 'Edit'
    },
    {
        'href' : '/calendar/recurring',
        'label': 'Add Recurring Task'
    },
    {
        'href' : '/calendar/week',
        'label': 'Weekly tasks'
    }
],
    buttons: []
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