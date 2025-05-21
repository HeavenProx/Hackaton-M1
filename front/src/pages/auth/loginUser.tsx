"use client";

import React from "react";
import { Input, Button, Spacer } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons/EyeIcons";

export default function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = (data) => {
    console.log("Tentative de connexion avec :", data);
    // TODO : requête vers l'API d'authentification
  };

  return (
    <form
      className="flex flex-col gap-6 max-w-md mx-auto mt-10 bg-white p-6 shadow-xl rounded-2xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Connexion à votre compte
      </h2>

      <Input
        {...register("email", { required: "Adresse email requise" })}
        isRequired
        label="Adresse email"
        type="email"
      />

      <Input
        {...register("password")}
        isRequired
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

      <Button fullWidth color="primary" type="submit">
        Se connecter
      </Button>

      <p className="text-sm text-center text-gray-600">
        Pas encore de compte ?<br />
        <Link className="text-primary hover:underline" to="/register">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
