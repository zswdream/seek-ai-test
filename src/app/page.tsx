/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      account: '',
    },
    onSubmit: async (values) => {
      const response = await axios.post('/api/connection', { ...values });
      if (response.data.isError) {
        toast.error('Error: Connection not made');
      } else {
        toast.success('Success: Connection made successfully');
        localStorage.setItem('credentials', JSON.stringify(values));
        router.push('/query');
      }
    },
  });

  return (
    <>
      <ToastContainer />
      {
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center w-1/3 border px-5 py-4 border-black rounded-lg shadow-lg">
            <p className="text-lg">Enter Details to Connect to Snowflake</p>
            <form
              className="mt-5 flex flex-col justify-center"
              onSubmit={formik.handleSubmit}
            >
              <label htmlFor="username">User Name:</label>
              <input
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.username}
                className="px-2 py-1"
              />

              <label className="mt-4" htmlFor="password">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="px-2 py-1"
              />

              <label className="mt-4" htmlFor="account">
                Account URL:
              </label>
              <input
                id="account"
                name="account"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.account}
                className="px-2 py-1"
              />

              <button
                className="px-1 mt-8 text-white  py-2 bg-blue-700 rounded-md"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      }
    </>
  );
}
