<?php

namespace App\DataFixtures;

use App\Entity\Car;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use League\Csv\Reader;

class CarFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Chemin vers le fichier CSV
        $path = __DIR__ . '/../../public/data/cars.csv';
        $csv = Reader::createFromPath($path, 'r');
        $csv->setDelimiter(';');
        $csv->setHeaderOffset(0); // Utilise la première ligne comme en-tête

        // Parcours des enregistrements du CSV
        foreach ($csv->getRecords() as $record) {
            $car = new Car();
            $car->setBrand($record['brand'] ?? null);
            $car->setModel($record['model'] ?? null);
            $car->setEntryCirculationDate(new DateTimeImmutable($record['entryCirculationDate']) ?? null);
            $car->setVin($record['vin'] ?? null);
            $car->setDistance($record['distance'] ?? null);
            $car->setRegistration((int)$record['registration'] ?? null);

            $manager->persist($car);
        }

        // Sauvegarde des données dans la base
        $manager->flush();
    }
}