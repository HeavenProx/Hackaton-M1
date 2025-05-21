'use client'

import { Input, Button, Spacer, addToast, Spinner } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom'

type Props = {
    onPrevious: () => void
    formData: any
}

export default function CarPart({ onPrevious, formData }: Props) {
    const [brands, setBrands] = useState<string[]>([])
    const [filteredBrands, setFilteredBrands] = useState<string[]>([])
    const [brandInput, setBrandInput] = useState("")
    const [models, setModels] = useState<string[]>([])
    const [filteredModels, setFilteredModels] = useState<string[]>([])
    const [modelInput, setModelInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { user, token } = useUser()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        setValue
    } = useForm({ mode: 'onSubmit' })

    const onSubmit = async (data) => {
        const finalData = { ...formData, ...data }
        setIsLoading(true)

        try {
            const res = await fetch('http://127.0.0.1:8000/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user: `/users/${user?.id}`,
                    brand: finalData.carBrand,
                    model: finalData.carModel,
                    registration: finalData.carLicence,
                    vin: finalData.carVin,
                    entryCirculationDate: finalData.carCirculationDate,
                    distance: parseFloat(finalData.carDistance)
                }),
            })

            if (!res.ok) throw new Error('Erreur lors de la sauvegarde du véhicule')

            addToast({
                title: "Véhicule enregistré",
                description: "Votre véhicule a bien été enregistré, vous pourrez en ajouter d'autres depuis la page 'Mon compte'",
                color: "success",
            })

            navigate('/login')
        } catch (err) {
            console.error("Erreur à l'enregistrement du véhicule :", err)
        } finally {
            setIsLoading(false)
        }
    }

    const skipStep = async () => {
        setIsLoading(true)
        try {
            navigate('/login')
        } catch (err) {
            console.error("Erreur lors du skip :", err)
        } finally {
            setIsLoading(false)
        }
    }

    const dateToday = new Date().toISOString().split('T')[0]

    useEffect(() => {
        fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?limit=100')
            .then(res => res.json())
            .then(data => {
                const brandList = Array.from(new Set(data.results.map((item: any) => item.make).filter(Boolean))).sort()
                setBrands(brandList)
            })
            .catch(err => console.error('Erreur API marques :', err))
    }, [])

    useEffect(() => {
        if (!brandInput) {
            setModels([])
            return
        }

        fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?where=make%3D%22${encodeURIComponent(brandInput)}%22&limit=100`)
            .then(res => res.json())
            .then(data => {
                const modelList = Array.from(new Set(data.results.map((item: any) => item.model).filter(Boolean))).sort()
                setModels(modelList)
            })
            .catch(err => console.error('Erreur API modèles :', err))
    }, [brandInput])

    const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setBrandInput(value)
        setValue('carBrand', value)
        setFilteredBrands(value.trim() === '' ? brands : brands.filter((b) => b.toLowerCase().includes(value.toLowerCase())))
    }

    const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setModelInput(value)
        setValue('carModel', value)
        setFilteredModels(value.trim() === '' ? models : models.filter((m) => m.toLowerCase().includes(value.toLowerCase())))
    }

    return (
        <>
            {isLoading && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <Spinner variant="wave" size="lg" color="white" />
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`relative ${!brandInput ? 'md:col-span-2' : ''}`}>
                        <Input
                            label="Marque"
                            isRequired
                            value={brandInput}
                            onChange={handleBrandChange}
                        />
                        {filteredBrands.length > 0 && (
                            <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto text-sm">
                                {filteredBrands.map((brand, i) => (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            setBrandInput(brand)
                                            setValue('carBrand', brand)
                                            setFilteredBrands([])
                                            setModelInput("")
                                            setModels([])
                                        }}
                                        className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                                    >
                                        {brand}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {brandInput && (
                        <div className="relative">
                            <Input
                                label="Modèle"
                                isRequired
                                value={modelInput}
                                onChange={handleModelChange}
                            />
                            {filteredModels.length > 0 && (
                                <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto text-sm">
                                    {filteredModels.map((model, i) => (
                                        <li
                                            key={i}
                                            onClick={() => {
                                                setModelInput(model)
                                                setValue('carModel', model)
                                                setFilteredModels([])
                                            }}
                                            className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                                        >
                                            {model}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input {...register('carLicence')} label="Immatriculation" isRequired />
                    <Input {...register('carVin')} label="Numéro VIN" isRequired />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input {...register('carCirculationDate')} label="Date de mise en circulation" type="date" isRequired max={dateToday} />
                    <Input {...register('carDistance')} label="Kilométrage" type="number" min={0} isRequired />
                </div>

                <Spacer y={1} />

                <div className="flex justify-between pt-4">
                    <Button type="button" onClick={onPrevious} variant="light">Retour</Button>
                    <div className="flex gap-2">
                        <Button type="button" onClick={skipStep} variant="ghost">Passer cette étape</Button>
                        <Button type="submit" color="primary">Créer mon compte</Button>
                    </div>
                </div>
            </form>
        </>
    )
}
