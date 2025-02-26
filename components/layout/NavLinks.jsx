export const NavLinks = [
    {
        label: 'Dashboard',
        authRequired: false,
        href: '/',
        linkName: 'Dashboard',

    },
    {
        label: 'Recipes',
        authRequired: true,
        href: '/recipes/',
        linkName: 'recipes',
    },
    {
        label: 'Ingredients',
        authRequired: true,
        href: '/ingredients/',
        linkName: 'ingredients',
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