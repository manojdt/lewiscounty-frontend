export const loginUser = [{
        email: 'tsubramaniyan2@gmail.com',
        password: '12345'
    },
    {
        email: 'subramaniyant@dataterrain.com',
        password: '12345'
    },
]




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

export const menteeColumns = [{
    field: 'name',
    headerName: 'Name',
    width: 200,
    id: 0,
},
{
    field: 'professional',
    headerName: 'Professional',
    width: 200,
    id: 1,
},
{
    field: 'contact',
    headerName: 'Contact',
    width: 150,
    id: 2,
}, {
    field: 'email',
    headerName: 'Email',
    width: 250,
    id: 1,
},
{
    field: 'location',
    headerName: 'Location',
    width: 400,
    id: 2,
},
{
    field: 'attn_program',
    headerName: 'Attended Programs',
    width: 250,
    id: 2,
}, {
    field: 'last_attn_program',
    headerName: 'Last Attend Program',
    width: 250,
    id: 1,
},
];

function menteesListData(id, name, professional, contact, email, location, attn_program, last_attn_program) {
    return {
        id,
        name,
        professional,
        contact,
        email,
        location,
        attn_program,
        last_attn_program
    };
}


const menteeRowData = () => {
    const data = []
    for (let a = 1; a <= 100000; a++) {
        data.push(menteesListData(a, `Name ${a}`, `Student `, '1234567890', 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..','Teaching program','Teaching program'))
    }
    return data
}

export const menteeRow = menteeRowData();



export const menteeMoreMenu = [{
        name: 'Edit',
        onClickEvent: (data) => console.log('Edit Event', data)
    },
    {
        name: 'Delete',
        onClickEvent: (data) => console.log('Delete Event', data)
    },
]


export const assignMenteeColumns = [{
        field: 'first_name',
        headerName: 'first_name',
        width: 140,
        id: 0,
    },
    {
        field: 'professional',
        headerName: 'Professional',
        width: 150,
        id: 1,
    },
    {
        field: 'contact',
        headerName: 'Contact',
        width: 150,
        id: 2,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 150,
        id: 3,
    },
    {
        field: 'location',
        headerName: 'Location',
        width: 150,
        id: 4,
    },
    {
        field: 'certificates',
        headerName: 'Certificates',
        width: 150,
        id: 5,
    },
    {
        field: 'view',
        headerName: 'View',
        width: 200,
        id: 6,
    },
];


function addignCreateData(name, professional, contact, email, location, certificates, view) {
    return {
        name,
        professional,
        contact,
        email,
        location,
        certificates,
        view
    };
}
export const assignMenteeRows = [
    addignCreateData('Name 1', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 2', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 3', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 4', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 5', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 6', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 7', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 8', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 9', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 10', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 11', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 12', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 13', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 14', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 15', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 16', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 17', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 18', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 19', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
    addignCreateData('Name 20', 'Freelancer', 1324171354, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..', '06', 3287263),
];



function materialData(material_name, material_type, material_size, action) {
    return {
        material_name,
        material_type,
        material_size,
        action,
    };
}

const createMaterialRow = () => {
    const data = []
    for (let a = 1; a <= 20; a++) {
        data.push(materialData(`Materials Name ${a}`, 'Video.mp4', '5MB', 3287263))
    }

    // console.log('data', data)
    return data
}

export const createMaterialsRows = createMaterialRow()

export const MaterialColumns = [{
        field: 'name',
        headerName: 'Material Name',
        width: 400,
        id: 0,
    },
    {
        field: 'material_type',
        headerName: 'Material Type',
        width: 250,
        id: 1,
    },
    {
        field: 'material_size',
        headerName: 'Material Size',
        width: 200,
        id: 2,
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 200,
        id: 3,
        renderCell: (params) => {
            return <button style = {
                {
                    background: 'rgb(29, 91, 191)',
                    color: 'rgb(255, 255, 255)',
                    padding: '2px 20px',
                    height: '32px',
                    margin: '9px 0px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '3px'
                }
            }
            onClick = {
                () => console.log('click')
            } > View Details </button>;
        }
    },
];


export const MemberColumns = [{
        field: 'full_name',
        headerName: 'Full Name',
        width: 400,
        id: 0,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 250,
        id: 1,
    },
    {
        field: 'dob',
        headerName: 'DOB',
        width: 200,
        id: 2,
    },
    {
        field: 'gender',
        headerName: 'Gender',
        width: 200,
        id: 3,
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 200,
        id: 4,
    },
];



function skillData(name, skills_desc, action) {
    return {
        name,
        skills_desc,
        action,
    };
}
const createSkillsRow = () => {
    const data = []
    for (let a = 1; a <= 20; a++) {
        data.push(skillData(`Skills Name ${a}`, 'test', 3287263))
    }

    // console.log('data', data)
    return data
}


export const createSkillsRows = createSkillsRow()

export const SkillsColumns = [{
        field: 'name',
        headerName: 'Skills Name',
        width: 400,
        id: 0,
    },
    {
        field: 'desc',
        headerName: 'Skills Description',
        width: 400,
        id: 1,
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 200,
        id: 3,
        renderCell: (params) => {
            return <button style = {
                {
                    background: 'rgb(29, 91, 191)',
                    color: 'rgb(255, 255, 255)',
                    padding: '2px 20px',
                    height: '32px',
                    margin: '9px 0px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '3px'
                }
            }
            onClick = {
                () => console.log('click')
            } > View Details </button>;
        }
    },
];


function certificateData(name, action) {
    return {
        name,
        action,
    };
}

const certificateRow = () => {
    const data = []
    for (let a = 1; a <= 20; a++) {
        data.push(certificateData(`Certificate Name ${a}`, 3287263))
    }

    // console.log('data', data)
    return data
}

export const certificateRows = certificateRow()

export const CertificateColumns = [{
        field: 'name',
        headerName: 'Certificate Name',
        width: 600,
        id: 0,
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 200,
        id: 3,
        renderCell: (params) => {
            return <button style = {
                {
                    background: 'rgb(29, 91, 191)',
                    color: 'rgb(255, 255, 255)',
                    padding: '2px 20px',
                    height: '32px',
                    margin: '9px 0px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '3px'
                }
            }
            onClick = {
                () => console.log('click')
            } > View Details </button>;
        }
    },
];




function topMentorData(id, name, designation, skills, ratings) {
    return {
        id,
        name,
        designation,
        skills,
        ratings
    };
}
const topMentorRow = () => {
    const data = []
    for (let a = 1; a <= 10; a++) {
        data.push(topMentorData(a, `Test ${a}`, 'Developer', 'Teaching', '4.5'))
    }
    return data
}


export const topMentorRows = topMentorRow()


function programActivityData(id, name, manager, start_date, end_date, admin) {
    return {
        id,
        name,
        manager,
        start_date,
        end_date,
        admin
    };
}

const programActivityRow = () => {
    const data = []
    for (let a = 1; a <= 10; a++) {
        data.push(programActivityData(a, `Program Name ${a}`, `Johnson ${a}`, '04/23/2024', '04/23/2024', 'Admin'))
    }
    return data
}

export const programActivityRows = programActivityRow()





export const mentorColumns = [{
        field: 'name',
        headerName: 'Name',
        width: 250,
        id: 0,
    },
    {
        field: 'designation',
        headerName: 'Designation',
        width: 250,
        id: 1,
    },
    {
        field: 'skills',
        headerName: 'Skills',
        width: 250,
        id: 2,
    }, {
        field: 'email',
        headerName: 'Email',
        width: 250,
        id: 1,
    },
    {
        field: 'location',
        headerName: 'Location',
        width: 400,
        id: 2,
    }
];

function mentorListData(id, name, designation, skills, email, location) {
    return {
        id,
        name,
        designation,
        skills,
        email,
        location
    };
}


const mentorData = () => {
    const data = []
    for (let a = 1; a <= 30; a++) {
        data.push(mentorListData(a, `Name ${a}`, `Developer`, `Teaching ${a}`, 'John Doe@gmail.com', 'Lorem ipsum dolor sit amet..'))
    }
    return data
}

export const mentorRows = mentorData();


const taskData = () => {
    const data = []
    for (let a = 1; a <= 30; a++) {
        data.push({
            id: a,
            assigned_date: '02/05/2024',
            task_name: `Task Name ${a+1}`,
            program_name: `Teaching Program ${a+1}`,
            task_description: 'Lorem ipsum dolor......',
            start_date: '02/05/2024',
            completed_date: '02/05/2024',
            task_sent: 'Mentor',
            status: 'Done',
            file_size: '5mb',
            mark: '09'
        })
    }
    return data
}

export const taskRows = taskData();

export const taskColumns = [{
        field: 'assigned_date',
        headerName: 'Assigned Date',
        width: 150,
        id: 0,
    },
    {
        field: 'task_name',
        headerName: 'Task Name',
        width: 150,
        id: 1,
    },
    {
        field: 'program_name',
        headerName: 'Program Name',
        width: 200,
        id: 2,
    }, {
        field: 'task_description',
        headerName: 'Task Description',
        width: 200,
        id: 1,
    },
    {
        field: 'start_date',
        headerName: 'Start Date',
        width: 150,
        id: 2,
    },
    {
        field: 'completed_date',
        headerName: 'Completed  Date',
        width: 150,
        id: 2,
    },
    {
        field: 'task_sent',
        headerName: 'Task Sent by',
        width: 150,
        id: 2,
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 100,
        id: 2,
    },
    {
        field: 'file_size',
        headerName: 'File Size',
        width: 100,
        id: 2,
    },
    {
        field: 'mark',
        headerName: 'Mark',
        width: 100,
        id: 2,
    }
];



const mentorTaskData = () => {
    const data = []
    for (let a = 1; a <= 30; a++) {
        data.push({
            id: a,
            program_name: `Teaching Program ${a+1}`,
            mentee_name: `Mentee ${a+1}`,
            task_description: 'Lorem ipsum dolor......',
            create_date: '02/05/2024',
            sub_date: '02/05/2024',
            task_status: 'Done',
            mark: '09',
            file_by: '5mb'
        })
    }
    return data
}

export const mentorTaskRows = mentorTaskData();

export const mentorTaskColumns = [{
    field: 'program_name',
    headerName: 'Program Name',
    width: 250,
    id: 0,
},
{
    field: 'mentee_name',
    headerName: 'Mentee Name',
    width: 200,
    id: 1,
},
{
    field: 'task_description',
    headerName: 'Task description',
    width: 250,
    id: 2,
},
{
    field: 'create_date',
    headerName: 'Create Date',
    width: 150,
    id: 2,
},
{
    field: 'sub_date',
    headerName: 'Sub. Date',
    width: 150,
    id: 2,
},
{
    field: 'task_status',
    headerName: 'Task Status',
    width: 150,
    id: 2,
},
{
    field: 'mark',
    headerName: 'Mark',
    width: 100,
    id: 2,
},
{
    field: 'file_by',
    headerName: 'File by',
    width: 100,
    id: 2,
}
];





export const goalsColumns = [{
    field: 'goal_name',
    headerName: 'Goals Name',
    width: 400,
    id: 0,
},
{
    field: 'start_date',
    headerName: 'Start Date',
    width: 300,
    id: 1,
},
{
    field: 'period',
    headerName: 'Period',
    width: 250,
    id: 2,
}
];


function goalsListData(id, goal_name, start_date, period) {
    return {
        id,
        goal_name,
        start_date,
        period,
    };
}


const goalsRowData = () => {
    const data = []
    for (let a = 1; a <= 30; a++) {
        data.push(goalsListData(a, `Name ${a}`, `Student `, '03/24/2024', '3 Months'))
    }
    return data
}

export const goalsRow = goalsRowData();
