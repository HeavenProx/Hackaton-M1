'use client'

import { Input, Button, Spacer } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

type VehicleForm = {
    marque: string
    modele: string
    immatriculation: string
    vin: string
    dateCirculation: string
    kilometrage: number
}

const schema = yup.object({
    marque: yup.string().required('La marque est requise'),
    modele: yup.string().required('Le modèle est requis'),
    immatriculation: yup.string().required('L\'immatriculation est requise'),
    vin: yup.string().required('Le numéro VIN est requis'),
    dateCirculation: yup.string().required('La date de circulation est requise'),
    kilometrage: yup
        .number()
        .typeError('Le kilométrage doit être un nombre')
        .positive('Le kilométrage doit être positif')
        .required('Le kilométrage est requis')
})

type Props = {
    onPrevious: () => void
    formData: any
}

export default function CarPart({ onPrevious, formData }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<VehicleForm>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })

    const onSubmit = (data: VehicleForm) => {
        const finalData = { ...formData, ...data }
        console.log('Soumission finale :', finalData)
        // Ici, requête POST vers serveur API
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input {...register('marque')} label="Marque" isRequired />
                <Input {...register('modele')} label="Modèle" isRequired />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input {...register('immatriculation')} label="Immatriculation" isRequired />
                <Input {...register('vin')} label="Numéro VIN" isRequired />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input {...register('dateCirculation')} label="Date de mise en circulation" type="date" isRequired />
                <Input {...register('kilometrage')} label="Kilométrage" type="number" min={0} isRequired />
            </div>

            <Spacer y={1} />

            <div className="flex justify-between pt-4">
                <Button type="button" onClick={onPrevious} variant="light">Retour</Button>
                <Button type="submit" color="primary">Créer mon compte</Button>
            </div>
        </form>
    )
}
