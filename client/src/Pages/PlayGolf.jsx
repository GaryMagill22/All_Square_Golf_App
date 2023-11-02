import React from 'react'
import ScoreCard from '../Components/ScoreCard';

const PlayGolf = () => {
    const [user, setUser] = useState([]);

    // Grabbing user that is logged in and using data in session
    useEffect(() => {

        // variable for deployment and local development
        const apiURL = process.env.REACT_APP_API_URL;

        axios.get(`${apiURL}/api/getUser`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch()
    }, [])


    return (
        <div>
            <ScoreCard />


        </div>
    )
}

export default PlayGolf;