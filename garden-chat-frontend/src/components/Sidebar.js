import React, { useState } from 'react';

function Sidebar({ groups, selectGroup, onlineUsers, createGroup }) {
    const [selectedGroup, setSelectedGroup] = useState(groups[0]); // Default to the first group
    const [showModal, setShowModal] = useState(false); // Manage modal visibility
    const [newGroupName, setNewGroupName] = useState(''); // New group input state

    const handleGroupClick = (group) => {
        setSelectedGroup(group); // Update selected group in state
        selectGroup(group); // Notify parent about selection
    };

    const handleCreateGroup = () => {
        if (newGroupName.trim() && !groups.includes(newGroupName)) {
            createGroup(newGroupName); // Create the new group
            setNewGroupName(''); // Reset input
            setShowModal(false); // Close modal
        }
    };

    return (
        <div className="sidebar">
            <h3>Channels</h3>
            <div className="group-list">
                {groups.map((group, index) => (
                    <p
                        key={index}
                        className={`group-item ${selectedGroup === group ? 'selected' : ''}`}
                        onClick={() => handleGroupClick(group)}
                    >
                        #{group}
                    </p>
                ))}
            </div>
            <button onClick={() => setShowModal(true)} className="create-group-btn">
                + Create Group
            </button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Create New Group</h4>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <button onClick={handleCreateGroup}>Create</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Sidebar;
