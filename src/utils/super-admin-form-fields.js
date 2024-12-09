export const NewTicketFields = [
  {
    type: 'input',
    name: 'first_name',
    fieldtype: 'text',
    label: 'First Name',
    placeholder: 'Enter First Name',
    inputRules: {
      required: 'This field is required',
    },
    size: true,
    disable: true,
  },
  {
    type: 'input',
    name: 'last_name',
    fieldtype: 'text',
    label: 'Last Name',
    placeholder: 'Enter Last Name',
    inputRules: {
      // required: "This field is required",
    },
    size: true,
    disable: true,
  },
  {
    type: 'input',
    name: 'subject_name',
    fieldtype: 'text',
    label: 'Subject Name',
    placeholder: 'Enter Subject Name',
    inputRules: {
      // required: "This field is required",
    },
    size: true,
    disable: true,
  },
  {
    type: 'radio',
    name: 'gender',
    label: 'Gender',
    placeholder: '',
    options: [
      {
        key: 'admin',
        value: 'Admin',
      },
      {
        key: 'mentor',
        value: 'Mentor',
      },
      {
        key: 'Mentee',
        value: 'Mentee',
      },
    ],
    inputRules: {
      // required: "This field is required",
    },
    size: true,
  },
  {
    type: 'input',
    name: 'email',
    fieldtype: 'email',
    label: 'E-mail',
    placeholder: 'Enter Email',
    inputRules: {
      required: 'This field is required',
    },
    size: true,
    disable: true,
  },

  {
    type: 'input',
    name: 'due_date',
    fieldtype: 'text',
    label: 'Due date',
    placeholder: 'Enter Due date',
    inputRules: {
      // required: "This field is required",
    },
    size: true,
  },
  {
    type: 'file',
    name: 'documents',
    fieldtype: 'file',
    label: 'Document Upload',
    placeholder: '',
    inputRules: {
      required: 'This field is required',
    },
    size: false,
    width: 'col-span-2',
  },
  {
    type: 'textbox',
    name: 'description',
    fieldtype: 'text',
    label: 'Description',
    placeholder: 'Enter Description',
    inputRules: {
      // required: "This field is required",
    },
    size: true,
    width: 'col-span-2',
  },
];
