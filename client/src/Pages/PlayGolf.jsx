import React from 'react'
import ScoreCard from '../Components/ScoreCard';

const PlayGolf = () => {
    const [user, setUser] = useState([]);

    // Grabbing user that is logged in and using data in session
    useEffect(() => {
        axios.get(`http://localhost:8000/api/getUser`, { withCredentials: true })
            .then(res => setUser(res.data))

            .catch()
    }, [])


    return (
        <div>
            <ScoreCard />


        </div>
    )
}

export default PlayGolf