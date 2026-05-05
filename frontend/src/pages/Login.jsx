import { useState } from 'react'
import { Form, Formik } from 'formik'
import { Leaf, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../components/Button'
import FormField from '../components/FormField'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required')
})

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  return (
    <main className="grid min-h-screen grid-cols-1 bg-gradient-to-br from-green-50 via-white to-green-100 transition-colors duration-300 dark:from-[#0B1F17] dark:via-black dark:to-black lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex min-h-screen flex-col px-6 py-6 lg:px-12">
        <div className="flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-3">
            <img src="/logo.svg" alt="EcoResume" className="h-11 w-11 rounded-2xl shadow-md" />
            <span className="text-xl font-extrabold text-gray-950 dark:text-white">EcoResume</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-8">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-xs font-bold text-verdant-primary shadow-sm dark:border-emerald-900 dark:bg-gray-950 dark:text-green-300">
              <Leaf className="h-4 w-4" />
              AI Resume Builder
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-950 dark:text-white">Welcome back</h1>
            <p className="mt-3 text-base leading-7 text-gray-500 dark:text-gray-400">
              Sign in to continue building role-ready resumes.
            </p>
          </div>

          <Formik
            initialValues={{ email: 'demo@verdantai.dev', password: 'password123' }}
            validationSchema={schema}
            onSubmit={async (values) => {
              setError('')
              try {
                await login(values)
                navigate('/dashboard')
              } catch (err) {
                setError(err.message)
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="verdant-panel rounded-2xl p-6">
                <div className="space-y-5">
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
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Button>
                </div>
                <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  New here?{' '}
                  <Link to="/register" className="font-bold text-verdant-primary dark:text-green-300">
                    Create account
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      <section className="hidden min-h-screen border-l border-green-100 bg-verdant-dark p-10 text-white dark:border-emerald-950 lg:block">
        <div className="flex h-full flex-col justify-between rounded-[2rem] border border-green-300/20 bg-gradient-to-br from-emerald-900 via-verdant-dark to-black p-10 shadow-glow">
          <div>
            <p className="text-sm font-bold uppercase text-green-300">Premium SaaS Project</p>
            <h2 className="mt-5 max-w-xl text-5xl font-extrabold leading-tight">
              Grow every resume toward the exact role.
            </h2>
          </div>
          <div className="grid gap-4">
            {['JWT-secured Spring Boot APIs', 'MongoDB resume history', 'AI suggestions and JD matching'].map((item) => (
              <div key={item} className="rounded-2xl border border-green-300/20 bg-white/10 p-5 backdrop-blur">
                <p className="font-bold text-green-100">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
