import { useState } from 'react'
import { Form, Formik } from 'formik'
import { UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../components/Button'
import FormField from '../components/FormField'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

const schema = Yup.object({
  name: Yup.string().min(2, 'Name is too short').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Use at least 6 characters').required('Password is required')
})

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-10 transition-colors duration-300 dark:from-[#0B1F17] dark:via-black dark:to-black">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-3">
            <img src="/logo.svg" alt="EcoResume" className="h-11 w-11 rounded-2xl shadow-md" />
            <span className="text-xl font-extrabold text-gray-950 dark:text-white">EcoResume</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="verdant-panel rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Start with secure auth, resume history, AI guidance, and template export.
          </p>

          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={schema}
            onSubmit={async (values) => {
              setError('')
              try {
                await register(values)
                navigate('/dashboard')
              } catch (err) {
                setError(err.message)
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="mt-7 space-y-5">
                <FormField
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                />
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                  </div>
                ) : null}
                <Button type="submit" className="w-full" loading={loading}>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </Button>
              </Form>
            )}
          </Formik>
          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-verdant-primary dark:text-green-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
