<?php

namespace App\Command;

use App\Entity\Operation;
use Doctrine\ORM\EntityManagerInterface;
use League\Csv\Reader;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import-operations',
    description: 'Importe les opérations d’entretien depuis un fichier CSV',
)]
class ImportOperationsCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
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

            $this->em->persist($operation);
        }

        $this->em->flush();
        $output->writeln('Import terminé avec succès.');

        return Command::SUCCESS;
    }
}
