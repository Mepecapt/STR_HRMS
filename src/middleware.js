import { getAuth, onAuthStateChanged } from "firebase/auth";
import Cookies from 'js-cookie'

// export const middleware = (navigate, pathname) => {
//     const auth = getAuth();
//     const user = auth.currentUser
    
//     if (user) {
//         // If a user is authenticated and tries to access login or register, redirect to home
//         if (pathname === '/register' && pathname === '/') {
//             navigate('/');
//         }
//     } else {
//         // If no user is authenticated and tries to access any route other than login or register, redirect to login
//         if (pathname !== '/register' && pathname !== '/') {
//             navigate('/');
//         }
//     }
// };


export const middleware = (navigate, pathname) => {
    const user = Cookies.get('user')

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const user_cred = {email: user.email, password: user.password, uid: user.uid}
            Cookies.set('user', JSON.stringify(user_cred))
            // ...
        }
    });//

    const admin = Cookies.get('admin')
    const only_admin_route = [
       'roles-permissions',
       'adminleaves',
       'employees',
    ]

    const not_user_routes = [
        '/',
        'signup',
    ]

    if(user || !admin){
        if (not_user_routes.includes(pathname)) {
            navigate('/profile')
        }
    }

    if(!admin) {
        if (only_admin_route.includes(pathname)) {
            console.log('Admin not found');
            navigate('/profile')
        }
    }

}