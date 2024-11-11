// src/components/Sidebar.js
import React, { useState } from 'react';

// Sidebar component to display chat groups and online users, as well as options to create new groups
function Sidebar({ groups, selectGroup, onlineUsers, createGroup }) {
    // State to control the visibility of the "Create Group" modal
    const [showModal, setShowModal] = useState(false);

    // State to hold the new group name entered by the user in the modal
    const [newGroupName, setNewGroupName] = useState('');

    // Function to handle the creation of a new group
    const handleCreateGroup = () => {
        createGroup(newGroupName);   // Call the provided createGroup function with the new group name
        setShowModal(false);         // Close the modal after creating the group
        setNewGroupName('');         // Reset the input field for group name
    };

    return (
        <div className="sidebar">
            {/* Displaying the list of chat groups */}
            <h3>Channels</h3>
            {groups.map((group, index) => (
                <p key={index} onClick={() => selectGroup(group)}>
                    #{group}    {/* Display each group name prefixed with "#" */}
                </p>
            ))}

            {/* Button to open the "Create Group" modal */}
            <button onClick={() => setShowModal(true)} className="create-group-btn">
                + Create Group
            </button>

            {/* Modal to input the name for a new group */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Create New Group</h4>
                        {/* Input for the new group name */}
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}   // Update state as user types
                        />
                        {/* Button to create the group */}
                        <button onClick={handleCreateGroup}>Create</button>
                        {/* Button to cancel and close the modal */}
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Displaying the list of online users */}
            <h3>Online Users</h3>
            {onlineUsers.map((user, index) => (
                <p key={index} className="online-user">
                    {user}  {/* Display each online user's name */}
                </p>
            ))}
        </div>
    );
}

export default Sidebar;
