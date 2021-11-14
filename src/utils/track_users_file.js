let users = [];

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data

    if (!username || !room) {
        return {
            error: "Username and Room required!"
        }
    }

    const existed_user = users.find((user) => {
        return user.username === username && username.room === room;
    })

    if (existed_user) {
        return {
            message: "User is already in use!"
        }
    }

    const user = {
        id,
        username,
        room
    }

    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    })

    if (index !== -1) {
        return (users.splice(index, 1)[0]);
    }
}


//   FUNCTION 3 - getUser

const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    })
    if (index !== -1) {
        return users[index];
    }
    else {
        return undefined;
    }
}

const getUsersInRoom = (room) => {
    // cleaning the room data
    room = room.trim().toLowerCase();

    const new_array = [];
    users.forEach((user) => {
        if (user.room === room) {
            new_array.push(user);
        }
    })

    return new_array;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 101,
//     username: "mrityunjay",
//     room: 'Bagaha'
// })

// addUser({
//     id: 102,
//     username: "ravi",
//     room: 'Valmikinagar'
// })

// addUser({
//     id: 103,
//     username: "ranjan",
//     room: 'Bagaha'
// })

// /*const user = removeUser(101);
// console.log(user, users);
// */

// const user1 = getUser(103);
// console.log(user1);


// const room = getUsersinRoom('Valmikinagar');
// console.log(room);