import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ModalComponent from "../../../components/modal/Modal";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginModal({ variant, color }: any) {
  const handleOpen = () => {};
  const handleClose = () => {};

  const handleSubmit = () => {
     return
  };

  return (
    <div>
      <ModalComponent
        triggerLabel="Login"
        variant={variant}
        color={color}
        bodyContent={
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium mb-1">
                    Email*
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium mb-1"
                  >
                    Password*
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </Form>
            )}
          </Formik>
        }
        footerButtons={[
          {
            label: "Close",
            color: "danger",
            variant: "light",
            onPress: handleClose,
          },
          {
            label: "Login",
            color: "primary",
            onPress: () => handleSubmit,
          },
        ]}
        onOpen={handleOpen}
        onClose={handleClose}
      />
    </div>
  );
}
