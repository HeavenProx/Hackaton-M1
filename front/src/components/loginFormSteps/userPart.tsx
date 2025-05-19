'use client'

import { useForm, Controller } from 'react-hook-form'
import { Input, Button, Switch, Select, SelectItem, Spacer } from '@heroui/react'
import { useState } from 'react'

export default function UserPart({ onNext, defaultValues }) {
    const [isDriver, setIsDriver] = useState(defaultValues.estConducteur ?? true)

    const {
        register,
        handleSubmit,
        setValue,
        control,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onSubmit',
    })

    const handleSwitch = (value: boolean) => {
        setValue('estConducteur', value)
        setIsDriver(value)
    }

    const onSubmit = (data) => {

        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Les mots de passe ne correspondent pas'
            })
            return
        }

        clearErrors('confirmPassword')
        onNext(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                        label="Mot de passe"
                        type="password"
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
                        label="Confirmation du mot de passe"
                        type="password"
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
                <Switch isSelected={isDriver} onValueChange={handleSwitch}>
                    {isDriver ? 'Oui' : 'Non'}
                </Switch>
            </div>

            {!isDriver && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input {...register('driverNom', { required: true })} label="Nom du conducteur" isRequired />
                    <Input {...register('driverPrenom', { required: true })} label="Prénom du conducteur" isRequired />
                    <Input {...register('driverTel', { required: true })} label="Téléphone du conducteur" type='tel' isRequired maxLength={10} />
                </div>
            )}

            <Spacer y={1} />

            <Button type="submit" color="primary" fullWidth> Suivant</Button>
        </form>
    )
}
