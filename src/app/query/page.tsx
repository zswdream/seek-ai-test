/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Query() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(false);

  const formik = useFormik({
    initialValues: {
      query: '',
    },
    onSubmit: async (values) => {
      setQueryLoading(true);
      const credentials = JSON.parse(localStorage.getItem('credentials')!);
      const data = {
        ...credentials,
        ...values,
      };
      const response = await axios.post('/api/query', data);
      setQueryLoading(false);
      if (response.data.isError) {
        // toast.error('Error: Incorrect Query');
        setQueryError(response.data.error);
        setData([]);
        setHeaders([]);
      } else {
        setQueryError(false);
        toast.success('Data Fetched');
        setData(response.data.rows);
        const keys: any = Object.keys(response.data.rows[0]);
        setHeaders(keys);
      }
    },
  });

  return (
    <div className="h-screen overflow-hidden">
      <ToastContainer />
      {
        <div className=" flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-full pb-2">
            <form className="px-4 py-2 w-full" onSubmit={formik.handleSubmit}>
              <textarea
                id="query"
                name="query"
                onChange={formik.handleChange}
                value={formik.values.query}
                className="px-4 py-2 w-full"
                placeholder="Enter your sql query"
              />
              <div className="flex items-center justify-start">
                <button
                  className="disabled:bg-blue-400 px-3 mt-2 text-white text-center py-2 bg-blue-700 rounded-md"
                  type="submit"
                  disabled={queryLoading}
                >
                  Fetch Query
                </button>
                {queryError && (
                  <p className=" text-red-600 ms-4 text-sm">{queryError}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      }
      {!data.length && ''}
      {data.length > 0 && (
        <div className="flex justify-center items-center h-100">
          <div className="px-5 custom-height overflow-y-auto border-black border">
            <div className="overflow-x-auto">
              <table className=" table-fixed min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    {headers.map((header: any, index) => {
                      return (
                        <th
                          key={index}
                          className="py-4 px-2 bg-gray-200 border"
                        >
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any, index) => {
                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                      >
                        {headers.map((header: any, index) => {
                          return (
                            <td
                              key={index}
                              className="py-4 px-2 border border-gray-200"
                            >
                              <div className=" truncate">{item[header]}</div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
