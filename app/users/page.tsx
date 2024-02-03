'use client'
import EmptyState from "../components/EmptyState";

import { signOut } from "next-auth/react";

const Users = () =>{
    return(

        <div className=" lg:block lg:pl-80 h-full">
             <EmptyState />
        </div>

    );
}

export default Users;