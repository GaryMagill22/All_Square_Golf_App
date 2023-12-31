import React from 'react'
import ScoreCard from '../Components/ScoreCard';

const PlayGolf = () => {
    const [user, setUser] = useState([]);

    // Grabbing user that is logged in and using data in session
    useEffect(() => {
        axios.get(`https://allsquare.club/api/getUser`, { withCredentials: true })
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