export const loginUser = [{
        email: 'tsubramaniyan2@gmail.com',
        password: '12345'
    },
    {
        email: 'subramaniyant@dataterrain.com',
        password: '12345'
    },
]


export const menteeColumns = [{
        id: 'name',
        label: 'Name',
        minWidth: 140
    },
    {
        id: 'professional',
        label: 'Professional',
        minWidth: 150
    },
    {
        id: 'contact',
        label: 'Contact',
        minWidth: 150,
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 150,
    },
    {
        id: 'location',
        label: 'Location',
        minWidth: 150,
    },
    {
        id: 'attended_programs',
        label: 'Attended Programs',
        minWidth: 150
    },
    {
        id: 'last_attended_programs',
        label: 'Last Attend Program',
        minWidth: 200
    },
];

function createData(name, professional, contact, email, location, attended_programs, last_attended_programs) {
    return {
        name,
        professional,
        contact,
        email,
        location,
        attended_programs,
        last_attended_programs
    };
}

export const menteeRows = [
    createData('India', 'IN', 1324171354, 3287263, 3287263, 3287263, 3287263),
    createData('Italy', 'IT', 60483973, 301340, 3287263, 3287263, 3287263),
    createData('United States', 'US', 327167434, 9833520, 3287263, 3287263, 3287263),
    createData('Canada', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada2', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada3', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada4', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada5', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada6', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada7', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada8', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada9', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada1', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada10', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada54', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada32', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada86', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
    createData('Canada95', 'CA', 37602103, 9984670, 3287263, 3287263, 3287263),
];

export const menteeMoreMenu = [
    {
        name: 'Edit',
        onClickEvent : (data) => console.log('Edit Event', data)
    },
    {
        name: 'Delete',
        onClickEvent : (data) => console.log('Delete Event', data)
    },
]