import React from "react"
import { Formik } from 'formik';
import { makeTransference } from '_api'
import { history } from '../_helpers';

function TransferForm(props) {
    return (
        <Formik
            initialValues={{ emailReceiver: '', amount: '', redirect: false }}
            onSubmit={(values, { setSubmitting }) => {
                makeTransference(values)
               
                //history.go(0)
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,

            }) => (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="emailReceiver"
                            placeholder="destinatario"
                            onChange={handleChange}
                            value={values.emailReceiver}
                        />
                        <input
                            type="text"
                            name="amount"
                            placeholder="cantidad"
                            onChange={handleChange}
                            value={values.amount}
                        />
                        <button type="submit" disabled={isSubmitting}>
                            Hacer Transferencia
                        </button>
                    </form>



                )


            }
        </Formik>


    )
}

export default TransferForm

