import React from 'react'

import auth from "../app/api-services/authService"
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const ProtectedRoute = ({ link, ...rest }) => {
    const pathname = usePathname();
    const router = useRouter()

    return  (<Link href={link.path} target={link.isPathNew && "_blank"} className={`font-bold mb-9 ${pathname === link.path && 'text-yellow-500'}`} prefetch={false}>
//            {link.title}
//         </Link>)

//     return () => {
//         if (!auth.getUserData())
//             return (
//                 router.push({
//                     pathname: '/guest/login',
//                     state: { from: props.location }, // pass state obj to next in the redirect
//                 })     
//           )

//         return (
//         <Link href={link.path} target={link.isPathNew && "_blank"} className={`font-bold mb-9 ${pathname === link.path && 'text-yellow-500'}`} prefetch={false}>
//            {link.title}
//         </Link>)
//   }
}

export default ProtectedRoute