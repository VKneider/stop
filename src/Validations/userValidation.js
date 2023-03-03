import yup from 'yup';

const userSchema = yup.object({
    name: yup.string().required(),
    password: yup.string().required('Password is required'),
    email: yup.string().email().required('Email is required'),

})


export default userSchema;