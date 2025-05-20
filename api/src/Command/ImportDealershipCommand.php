<?php

namespace App\Command;

use App\Entity\Dealership;
use Doctrine\ORM\EntityManagerInterface;
use League\Csv\Reader;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import-dealership',
    description: 'Importe les garages depuis un fichier CSV',
)]
class ImportDealershipCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $path = __DIR__ . '/../../public/data/dealership.csv';
        $csv = Reader::createFromPath($path, 'r');
        $csv->setDelimiter(';');
        $csv->setHeaderOffset(0);

        foreach ($csv->getRecords() as $record) {
            $dealership = new Dealership();
            $dealership->setDealershipName($record['name'] ?? null);
            $dealership->setAddress($record['address'] ?? null);
            $dealership->setCity($record['city'] ?? null);
            $dealership->setLatitude($record['latitude'] ?? null);
            $dealership->setLongitude($record['longitude'] ?? null);
            $dealership->setZipcode($record['zipcode'] ?? null);
            $this->em->persist($dealership);
        }

        $this->em->flush();
        $output->writeln('Import terminé avec succès.');

        return Command::SUCCESS;
    }
}
