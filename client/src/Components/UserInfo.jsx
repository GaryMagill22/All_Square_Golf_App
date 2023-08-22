import React, { useState, useEffect } from 'react'
import axios from "axios"


const UserInfo = () => {
    // NOT RECOMMENDED TO SET THE WHOLE USER DUE TO PASSWORD
    const [user, setUser] = useState()


    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch()
    }, [])

    return (
        <div>UserInfo
            <h1> Username : {user && user.username}</h1>

        </div>

    )
}

export default UserInfo


// import React, { useState, useEffect } from 'react'
// import axios from "axios"


// const UserInfo = () => {
//     // NOT RECOMMENDED TO SET THE WHOLE USER DUE TO PASSWORD
//     const [loggedInUser, setLoggedInUser] = useState(null)


//     useEffect(() => {
//         axios.get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
//             .then(res => {
//                 console.log(res)
//                 setLoggedInUser(res.data.user)
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }, [])

//     return (

//         <div>

//             {loggedInUser ? <h1> Username: {loggedInUser.data.username}</h1> : <h1>Please log in first</h1>}

//         </div>

//     )
// }

// export default UserInfo;
