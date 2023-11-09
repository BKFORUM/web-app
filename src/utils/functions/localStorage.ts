const setUserLocalStorage = (user: any): void => {
    const users = localStorage.getItem('users');
    let usersArray = [];
    if (users) {
        usersArray = JSON.parse(users);
    }
    const index = usersArray.findIndex((item: any) => item.masv === user.masv)
    if (index === -1) {
        usersArray.push(user);
        localStorage.setItem('users', JSON.stringify(usersArray));
    }
}

const removeUserLocalStorage = (user: any): void => {
    const users = localStorage.getItem('users');
    let usersArray = [];
    if (users) {
        usersArray = JSON.parse(users);
    }
    const index = usersArray.findIndex((item: any) => item.masv === user.masv)
    if (index === -1) {
        const newUsersArray = usersArray.filter((item: any) => item.masv !== user.masv)
        localStorage.setItem('users', JSON.stringify(newUsersArray));
    }
}


export { setUserLocalStorage, removeUserLocalStorage }