// ProfileSettings.js
import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import ProfileCard from '../Components/ProfileCard';

const ProfileSettings = () => {

    // const [avatar, setAvatar] = useState(null);
    // const [avatarPreview, setAvatarPreview] = useState(null);


    // const handleAvatarChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setAvatar(file);
    //             setAvatarPreview(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const handleSaveAvatar = async () => {
    //     const formData = new FormData();
    //     formData.append('avatar', avatar);

    //     try {
    //         const response = await axios.post('https://allsquare.club/api/upload-avatar', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });

    //         // Update avatar URL here if you're receiving it from the server
    //         setAvatarPreview(response.data.avatarUrl);
    //     } catch (error) {
    //         console.error("Error uploading avatar:", error);
    //     }
    // };



    return (
        <div className="profile-settings">
            <form>
                {/* Avatar Update Section */}
                <div>
                    <label htmlFor="avatar">Change Avatar:</label>
                    <input type="file" id="avatar" name="avatar" accept="image/*" />
                </div>

                {/* Password Update Section */}
                <div>
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input type="password" id="currentPassword" />

                    <label htmlFor="newPassword">New Password:</label>
                    <input type="password" id="newPassword" />
                </div>

                {/* Other settings can be added here... */}

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ProfileSettings;
