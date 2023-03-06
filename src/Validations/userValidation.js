import yup from 'yup';

const userRegisterSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required('Password is required'),
    email: yup.string().email().required('Email is required'),

})

const userLoginSchema = yup.object({
    password: yup.string().required('Password is required'),
    email: yup.string().email().required('Email is required'),
})

export { userRegisterSchema, userLoginSchema };