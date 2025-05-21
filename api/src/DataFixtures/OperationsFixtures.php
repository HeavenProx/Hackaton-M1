<?php

namespace App\DataFixtures;

use App\Entity\Operation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use League\Csv\Reader;

class OperationsFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Chemin vers le fichier CSV
        $path = __DIR__ . '/../../public/data/operations.csv';
        $csv = Reader::createFromPath($path, 'r');
        $csv->setDelimiter(';');
        $csv->setHeaderOffset(0);

        foreach ($csv->getRecords() as $record) {
            $operation = new Operation();
            $operation->setName($record['operation_name'] ?? null);
            $operation->setCategory($record['category'] ?? null);
            $operation->setHelp($record['additionnal_help'] ?? null);
            $operation->setComment($record['additionnal_comment'] ?? null);
            $operation->setDuration($record['time_unit'] ?? null);
            $operation->setPrice($record['price'] ?? null);

            $manager->persist($operation);
        }

        $manager->flush();
    }
}