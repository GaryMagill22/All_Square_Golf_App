import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
    const navigate = useNavigate();

    const [formInfo, setFormInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        handicap: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({});




    const changeHandler = (e) => {
        setFormInfo({
            ...formInfo,
            [e.target.name]: e.target.value
        })
    }






    const submitHandler = (e) => {
        e.preventDefault()
        // console.log(user); // check the data being sent to the server
        axios.post(`http://localhost:8000/api/users/register`, formInfo, { withCredentials: true })
            .then(res => {
                // if (err.res.status)
                if (res.data.errors) {
                    setErrors(res.data.errors)
                } else {
                    navigate('/users')
                }
            })
            .catch(err => {

                // console.log(err); // Log entire error object to help debug
                // console.log(err.res.data)
                // const errorResponse = err.response.data.errors;
                // const errMsgArr = []
                // if (errorResponse) {
                //     for (const key of Object.keys(errorResponse)) {
                //         errMsgArr.push(errorResponse[key].message);
                //     }
                // }
                // setErrorsLog(errMsgArr);
            })

    }


    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="firstName" >Firstname: </label>
                    <input type="text" name="firstName" value={formInfo.firstName} onChange={changeHandler} />
                    {errors.firstName ? <p className="text-danger" >{errors.firstName.message}</p> : ""}
                </div>

                <div>
                    <label htmlFor="lastName" >Lastname</label>
                    <input type="text" name="lastName" value={formInfo.lastName} onChange={changeHandler} />
                    {errors.lastName ? <p className="text-danger"  >{errors.lastName.message}</p> : ""}
                </div>
                <div>
                    <label htmlFor="email" >Email</label>
                    <input type="text" name="email" value={formInfo.email} onChange={changeHandler} />
                    {errors.email ? <p className="text-danger"  >{errors.email.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="username" >Username: </label>
                    <input type="text" name="username" value={formInfo.username} onChange={changeHandler} />
                    {errors.username ? <p className="text-danger"  >{errors.username.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="password" >Password</label>
                    <input type="password" name="password" value={formInfo.password} onChange={changeHandler} />
                    {errors.password ? <p className="text-danger"  >{errors.password.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="confirmPassword" >Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formInfo.confirmPassword} onChange={changeHandler} />
                    {errors.confirmPassword ? <p className="text-danger"  >{errors.confirmPassword.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="handicap" name="handicap" className="form-label">Handicap: </label>
                    <input onChange={changeHandler} // Call the changeHandler function here
                        type="number"
                        className="form-control"
                        id="handicap"
                        name="handicap" // Add the name attribute to match the state key
                        placeholder="Enter your handicap"
                        value={formInfo.handicap} />
                    {errors.handicap ? <p className="text-danger"  >{errors.handicap.message}</p> : ""}

                </div>



                <button type="submit" className="btn btn-outline-danger">Register</button>
                <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>
            </form >

        </div >
    )
}

export default Register






// const Register = () => {

//     const [user, setUser] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         username: "",
//         handicap: "",
//         password: "",
//         confirmPassword: ""
//     })
//     const navigate = useNavigate();
//     const [errorsLog, setErrorsLog] = useState([]);


//     const changeHandler = (e) => {
//         let { name, value } = e.target
//         setUser({
//             ...user,
//             [name]: value

//         })
//     }






//     const submitHandler = (e) => {
//         e.preventDefault()
//         // console.log(user); // check the data being sent to the server
//         axios.post(`http://localhost:8000/api/users/register/new`, user, { withCredentials: true })
//             .then(res => {
//                 // if (err.res.status)
//                 console.log("in.then");
//                 console.log(res);
//                 navigate('/users')
//             })
//             .catch(err => {
//                 console.log(".catch");

//                 // console.log(err); // Log entire error object to help debug
//                 // console.log(err.res.data)
//                 const errorResponse = err.response.data.errors;
//                 const errMsgArr = []
//                 if (errorResponse) {
//                     for (const key of Object.keys(errorResponse)) {
//                         errMsgArr.push(errorResponse[key].message);
//                     }
//                 }
//                 setErrorsLog(errMsgArr);
//             })

//     }


//     return (
//         <div>
//             <form onSubmit={submitHandler}>
//                 <div>
//                     <label htmlFor="firstName" >Firstname: </label>
//                     <input type="text" name="firstName" value={user.firstName} onChange={changeHandler} />
//                 </div>

//                 <div>
//                     <label htmlFor="lastName" >Lastname</label>
//                     <input type="text" name="lastName" value={user.lastName} onChange={changeHandler} />
//                 </div>
//                 <div>
//                     <label htmlFor="email" >Email</label>
//                     <input type="text" name="email" value={user.email} onChange={changeHandler} />
//                 </div>
//                 <div>
//                     <label htmlFor="username" >Username: </label>
//                     <input type="text" name="username" value={user.username} onChange={changeHandler} />
//                 </div>
//                 <div>
//                     <label htmlFor="password" >Password</label>
//                     <input type="password" name="password" value={user.password} onChange={changeHandler} />
//                 </div>
//                 <div>
//                     <label htmlFor="confirmPassword" >Confirm Password</label>
//                     <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={changeHandler} />
//                 </div>
//                 <div>
//                     <label htmlFor="handicap" name="handicap" className="form-label">Handicap: </label>
//                     <input onChange={changeHandler} // Call the changeHandler function here
//                         type="number"
//                         className="form-control"
//                         id="handicap"
//                         name="handicap" // Add the name attribute to match the state key
//                         placeholder="Enter your handicap"
//                         value={user.handicap} />
//                 </div>
//                 {errorsLog.map((err, index) => <p style={{ color: "red" }} key={index}>{err}</p>)}

//                 <button type="submit" className="btn btn-outline-danger">Register</button>
//                 <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>
//             </form>

//         </div>
//     )
// }

// export default Register