"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Spacer,
} from "@heroui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons/EyeIcons";

export default function UserPart({ onNext, defaultValues }) {
  const [isDriver, setIsDriver] = useState(defaultValues.isConducteur ?? true);
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onSubmit",
  });

  const title = watch("title");

  const handleSwitch = (value: boolean) => {
    setValue("isDriver", value);
    setIsDriver(value);
  };

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Les mots de passe ne correspondent pas",
      });

      return;
    }

    clearErrors("confirmPassword");

    if (data.isDriver) {
      data.driverLastname = data.lastName;
      data.driverFirstname = data.firstName;
      data.driverPhone = data.phone;
    }

    onNext(data);
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className={title === "société" ? "w-full md:flex-1" : "w-full"}>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Select
                isRequired
                label="Titre"
                selectedKeys={field.value ? [field.value] : []}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <SelectItem key="monsieur">Monsieur</SelectItem>
                <SelectItem key="madame">Madame</SelectItem>
                <SelectItem key="société">Société</SelectItem>
              </Select>
            )}
            rules={{ required: true }}
          />
        </div>

        {title === "société" && (
          <div className="w-full md:flex-1">
            <Input
              {...register("companyName", { required: true })}
              isRequired
              label="Nom de la société"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("lastName", { required: true })}
          isRequired
          label="Nom"
        />
        <Input
          {...register("firstName", { required: true })}
          isRequired
          label="Prénom"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("email", { required: true })}
          isRequired
          label="Adresse email"
          type="email"
        />
        <Input
          {...register("phone", { required: true })}
          isRequired
          label="Téléphone"
          maxLength={10}
          type="tel"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            {...register("password", {
              required: "Ce champ ne peut pas être vide",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message:
                  "Doit contenir 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial",
              },
            })}
            isRequired
            className={errors.password ? "bg-red-100 border-red-500" : ""}
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
            isInvalid={!!errors.password}
            label="Mot de passe"
            type={isVisible ? "text" : "password"}
          />
          {errors.password?.message && (
            <p className="p-1 text-danger text-tiny">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <Input
            {...register("confirmPassword", {
              required: "Ce champ est requis",
            })}
            isRequired
            className={
              errors.confirmPassword ? "bg-red-100 border-red-500" : ""
            }
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
            isInvalid={!!errors.password}
            label="Confirmation du mot de passe"
            type={isVisible ? "text" : "password"}
          />
          {errors.confirmPassword?.message && (
            <p className="p-1 text-danger text-tiny">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-gray-700">
          Êtes-vous le conducteur du véhicule ?
        </span>
        <Switch isSelected={isDriver} onValueChange={handleSwitch}>
          {isDriver ? "Oui" : "Non"}
        </Switch>
      </div>

      {!isDriver && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            {...register("driverLastname", { required: true })}
            isRequired
            label="Nom du conducteur"
          />
          <Input
            {...register("driverFirstname", { required: true })}
            isRequired
            label="Prénom du conducteur"
          />
          <Input
            {...register("driverPhone", { required: true })}
            isRequired
            label="Téléphone du conducteur"
            maxLength={10}
            type="tel"
          />
        </div>
      )}

      <Spacer y={1} />

      <Button fullWidth color="primary" type="submit">
        {" "}
        Suivant
      </Button>

      <p className="text-sm text-center text-gray-600">
        Vous avez déja un compte ?<br />
        <Link className="text-primary hover:underline" to="/login">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
