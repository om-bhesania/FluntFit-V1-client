import { Button, Card, Image, Input } from "@nextui-org/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { ArrowRight, EyeClosedIcon, EyeIcon, Key, Mail } from "lucide-react";
import React, { useState } from "react";
import * as Yup from "yup";
import Loader from "../../../components/loader/Loader";

interface LoginProps {
  variant?:
    | "bordered"
    | "faded"
    | "flat"
    | "solid"
    | "light"
    | "ghost"
    | "shadow";
  color?: "default" | "primary" | "secondary" | "danger" | "success";
  handleSubmit: (data: any) => void;
  errorMessage?: string;
  loading: boolean;
}

const LoginPage: React.FC<LoginProps> = ({
  variant = "solid",
  color = "primary",
  handleSubmit,
  errorMessage,
  loading,
}) => {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const handleTogglePassword = () => {
    setTogglePassword(!togglePassword);
  };
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  const onSubmit = async (values: any): Promise<void> => {
    await handleSubmit(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 dark">
      <div className="max-w-5xl w-full space-y-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="https://mixbunch.in/cdn/shop/files/logo4.png?v=1703583291&width=120"
            alt="Login illustration"
            width={120}
            height={120}
            className="mx-auto invert"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2"
        >
          <Card className="p-8 bg-gray-800/20 shadow-xl">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-center text-3xl font-extrabold text-gray-300 bg-transparent"
            >
              Admin Login
            </motion.h2>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  await onSubmit(values); // Call your submit handler
                  resetForm(); // Reset the form after successful submission
                } catch {
                } finally {
                  setSubmitting(false); // Set submitting state back to false
                }
              }}
            >
              {() => (
                <Form className="mt-8 space-y-6">
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div className="mb-4">
                      <Field name="email">
                        {({ field }: any) => (
                          <Input
                            variant="flat"
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            startContent={<Mail className="text-gray-300" />}
                            className="w-full"
                            classNames={{
                              input: "!text-gray-300",
                            }}
                            autoComplete="email"
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>
                    <div>
                      <Field name="password">
                        {({ field }: any) => (
                          <Input
                            variant="flat"
                            {...field}
                            type={togglePassword ? "text" : "password"}
                            placeholder="Enter your password"
                            startContent={<Key className="text-gray-300" />}
                            className="w-full"
                            autoComplete="current-password"
                            endContent={
                              <>
                                {togglePassword === false && (
                                  <EyeClosedIcon
                                    className="text-gray-400 cursor-pointer"
                                    onClick={handleTogglePassword}
                                  />
                                )}
                                {togglePassword === true && (
                                  <EyeIcon
                                    className="text-gray-400 cursor-pointer"
                                    onClick={handleTogglePassword}
                                  />
                                )}
                              </>
                            }
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    {errorMessage && (
                      <div className="text-red-500 text-sm mt-2">
                        {errorMessage}
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={loading}
                      color={color}
                      variant={variant}
                      className="w-full"
                      endContent={
                        loading ? (
                          <Loader size="sm" />
                        ) : (
                          <ArrowRight className="ml-2" />
                        )
                      }
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
