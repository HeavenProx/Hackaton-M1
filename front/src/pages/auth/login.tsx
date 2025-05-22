"use client";

import React, { useState } from "react";
import { Input, Button, Spacer, addToast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons/EyeIcons";
import { useUser } from "@/contexts/UserContext";
import DefaultLayout from "@/layouts/default";

export default function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const { login } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await login(data.email, data.password);

      addToast({
        title: "Connexion réussie",
        description:
          "Bienvenue sur notre chatbot, n'hésitez pas à lui expliquer votre problème!",
        color: "primary",
      });

      navigate("/");
    } catch (err) {
      setLoginError("Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <form
        className="flex flex-col gap-6 max-w-md mx-auto mt-10 bg-default-50 p-6 shadow-xl rounded-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold text-default-800">
          Connexion à votre compte
        </h2>

        {loginError && (
          <div className="text-danger text-sm font-medium">{loginError}</div>
        )}

        <Input
          {...register("email", { required: "Adresse email requise" })}
          isRequired
          color="default"
          label="Adresse email"
          type="email"
        />

        <Input
          {...register("password", { required: "Mot de passe requis" })}
          isRequired
          color="default"
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-blue-500 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-blue-500 pointer-events-none" />
              )}
            </button>
          }
          label="Mot de passe"
          type={isVisible ? "text" : "password"}
        />

        <Spacer y={1} />

        <Button fullWidth color="primary" isLoading={isLoading} type="submit">
          Se connecter
        </Button>

        <p className="text-sm text-center text-default-600">
          Pas encore de compte ?<br />
          <Link className="text-primary hover:underline" to="/register">
            Créer un compte
          </Link>
        </p>
      </form>
    </DefaultLayout>
  );
}
