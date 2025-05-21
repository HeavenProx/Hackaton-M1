'use client'

import React from "react";
import { useForm, Controller } from 'react-hook-form'
import { Input, Button, Switch, Select, SelectItem, Spacer, addToast } from '@heroui/react'
import { useState } from 'react'
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/icons/EyeIcons'
import { Link } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'

export default function UserPart({ onNext, defaultValues }) {
    const [isDriver, setIsDriver] = useState(defaultValues.isConducteur ?? true);
    const [isVisible, setIsVisible] = React.useState(false);
    const { register: registerUser } = useUser();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        setError,
        clearErrors,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ...defaultValues,
            isDriver: defaultValues?.isDriver ?? true,
        },
        mode: 'onSubmit',
    })

    const title = watch('title')

    const handleSwitch = (value: boolean) => {
        setValue('isDriver', value)
        setIsDriver(value)
    }

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Les mots de passe ne correspondent pas'
            });
            return;
        }

        clearErrors('confirmPassword');

        if (data.isDriver) {
            data.driverLastname = data.lastName;
            data.driverFirstname = data.firstName;
            data.driverPhone = data.phone;
        }

        try {
            await registerUser(data.email, data.password, data.firstName, data.lastName, data.phone, data.title, data.companyName, data.isDriver, data.driverFirstname, data.driverLastname, data.driverPhone);

            addToast({
                title: "Inscription réussie",
                description: "Votre compte a bien été créé.",
                color: "success",
            });

            onNext(data);
        } catch (err) {
            console.error("Erreur à l'inscription :", err);
            setError("email", {
                type: "manual",
                message: "Cette adresse mail est déjà utilisée par un utilisateur, veuillez la modifier !"
            });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {errors.email?.message && (
                <div className="text-red-600 text-sm font-medium mb-2">
                    {errors.email.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
                <div className={title === 'société' ? 'w-full md:flex-1' : 'w-full'}>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                label="Titre"
                                isRequired
                                selectedKeys={field.value ? [field.value] : []}
                                onChange={(e) => field.onChange(e.target.value)}
                            >
                                <SelectItem key="monsieur">Monsieur</SelectItem>
                                <SelectItem key="madame">Madame</SelectItem>
                                <SelectItem key="société">Société</SelectItem>
                            </Select>
                        )}
                    />
                </div>

                {title === 'société' && (
                    <div className="w-full md:flex-1">
                        <Input
                            {...register('companyName', { required: true })}
                            label="Nom de la société"
                            isRequired
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input {...register('lastName', { required: true })} label="Nom" isRequired />
                <Input {...register('firstName', { required: true })} label="Prénom" isRequired />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input {...register('email', { required: true })} label="Adresse email" type="email" isRequired />
                <Input {...register('phone', { required: true })} label="Téléphone" type="tel" isRequired maxLength={10} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        {...register('password', {
                            required: 'Ce champ ne peut pas être vide',
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                message: 'Doit contenir 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'
                            }
                        })}
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
                        isRequired
                        isInvalid={!!errors.password}
                        className={errors.password ? 'bg-red-100 border-red-500' : ''}
                    />
                    {errors.password?.message && (
                        <p className="p-1 text-danger text-tiny">{errors.password.message}</p>
                    )}
                </div>
                <div>
                    <Input
                        {...register('confirmPassword', {
                            required: 'Ce champ est requis'
                        })}
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
                        label="Confirmation du mot de passe"
                        type={isVisible ? "text" : "password"}
                        isRequired
                        isInvalid={!!errors.password}
                        className={errors.confirmPassword ? 'bg-red-100 border-red-500' : ''}
                    />
                    {errors.confirmPassword?.message && (
                        <p className="p-1 text-danger text-tiny">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Êtes-vous le conducteur du véhicule ?</span>
                <Switch
                    isSelected={isDriver}
                    onValueChange={(value) => {
                        handleSwitch(value);
                        setValue('isDriver', value);
                    }}
                >
                    {isDriver ? 'Oui' : 'Non'}
                </Switch>
            </div>

            {!isDriver && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input {...register('driverLastname', { required: true })} label="Nom du conducteur" isRequired />
                    <Input {...register('driverFirstname', { required: true })} label="Prénom du conducteur" isRequired />
                    <Input {...register('driverPhone', { required: true })} label="Téléphone du conducteur" type='tel' isRequired maxLength={10} />
                </div>
            )}

            <Spacer y={1} />

            <Button type="submit" color="primary" fullWidth> Suivant</Button>

            <p className="text-sm text-center text-gray-600">
                Vous avez déja un compte ?<br />
                <Link to="/login" className="text-primary hover:underline">Se connecter</Link>
            </p>
        </form>
    )
}
