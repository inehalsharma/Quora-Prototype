const initialState = {
    loggedin: 0,
    username: "",
    password: "",
    role: "",
    email: "",
    mobile: "",
    about: "",
    city: "",
    country: "",
    company: "",
    school: "",
    hometown: "",
    languages: "",
    gender: "",
    new_username: "",
    new_password: "",
    new_type: "",
    new_name: "",

};

const reducer = (state = initialState, action) => {
    const newState = { ...state };

    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                loggedin: 1,
                username: action.username,
                password: action.password,
                role: action.role,


            }
            break;


        case 'PROFILE_LOAD':
            return {
                ...state,
                email: action.email,
                mobile: action.mobile,
                about: action.about,
                city: action.city,
                country: action.country,
                company: action.company,
                school: action.school,
                hometown: action.hometown,
                languages: action.languages,
                gender: action.gender,
            }
            break;


        case 'NEW_USER':
            return {
                ...state,
                loggedin: 0,
                username: "",
                password: "",
                role: "",
                email: "",
                mobile: "",
                about: "",
                city: "",
                country: "",
                company: "",
                school: "",
                hometown: "",
                languages: "",
                gender: "",
                new_username: action.email,
                new_password: action.password,
                new_type: action.type_role,
                new_name: action.name,
            }
            break;

        case 'LOGOUT':
            return {
                ...state,
                loggedin: 0,
                username: "",
                password: "",
                role: "",
                email: "",
                mobile: "",
                about: "",
                city: "",
                country: "",
                company: "",
                school: "",
                hometown: "",
                languages: "",
                gender: "",
                new_username: "",
                new_password: "",
                new_type: "",
                new_name: "",
            }
            break;
    }
    return newState;
};

export default reducer;