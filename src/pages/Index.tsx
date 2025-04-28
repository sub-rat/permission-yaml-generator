
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Login } from "@/lib/types/Login";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card"
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api/login";

const Index = () => {
  const navigate = useNavigate()
  const methods = useForm<Login>()

  const handleLogin = async (formData: Login) => {
    const loginRes = await login(formData)

    if (loginRes.data.access_token) {
      localStorage.setItem('accessToken', loginRes.data.access_token)

      navigate('/permissions')
    }
  }

  return (
    <FormProvider {...methods}>
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-slate-700 p-6">
        <Card
          className="max-w-lg w-full p-6 text-center shadow-md">
          <h1
            className="text-4xl font-bold mb-4"
          >Welcome to Permission Manager</h1>
          <form onSubmit={methods.handleSubmit(handleLogin)}>
            <Input
              {...methods.register('identity')}
              className="mb-4"
              placeholder="Username"
              type="text"
              required
            />
            <Input
              {...methods.register('password')}
              className="mb-4"
              placeholder="Password"
              type="password"
              required
            />
            <Button type="submit">
              Login
            </Button>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
};

export default Index;

