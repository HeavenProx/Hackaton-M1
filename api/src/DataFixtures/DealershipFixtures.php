<?php

namespace App\DataFixtures;

use App\Entity\Dealership;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use League\Csv\Reader;

class DealershipFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Chemin vers le fichier CSV
        $path = __DIR__ . '/../../public/data/dealership.csv';

        // Lecture du fichier CSV
        $csv = Reader::createFromPath($path, 'r');
        $csv->setDelimiter(';');
        $csv->setHeaderOffset(0); // Utilise la première ligne comme en-tête

        // Parcours des enregistrements du CSV
        foreach ($csv->getRecords() as $record) {
            $dealership = new Dealership();
            $dealership->setDealershipName($record['dealership_name'] ?? null);
            $dealership->setAddress($record['address'] ?? null);
            $dealership->setCity($record['city'] ?? null);
            $dealership->setLatitude((float)($record['latitude'] ?? 0));
            $dealership->setLongitude((float)($record['longitude'] ?? 0));
            $dealership->setZipcode($record['zipcode'] ?? null);

            $manager->persist($dealership);
        }

        // Sauvegarde des données dans la base
        $manager->flush();
    }
}