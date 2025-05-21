<?php

namespace App\DataFixtures;

use App\Entity\Car;
use App\Entity\Dealership;
use App\Entity\Intervention;
use App\Entity\Operation;
use App\Entity\User;
use DateTime;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use League\Csv\Reader;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {

        // Path to the CSV file
        $path = __DIR__ . '/../../public/data/users.csv';
        $csv = Reader::createFromPath($path, 'r');
        $csv->setDelimiter(';');
        $csv->setHeaderOffset(0);
        $users = [];
        foreach ($csv->getRecords() as $record) {
            $user = new User();
            $user->setEmail($record['email'] ?? null);
            $user->setRoles(json_decode($record['roles'] ?? '[]', true));
            $user->setTitle($record['title'] ?? null);
            $user->setLastname($record['lastname'] ?? null);
            $user->setFirstname($record['firstname'] ?? null);
            $user->setPhoneNumber($record['phoneNumber'] ?? null);
            $user->setIsDriver(filter_var($record['driver'] ?? false, FILTER_VALIDATE_BOOLEAN));
            $user->setDriverFirstname($record['driverFirstname'] ?? null);
            $user->setDriverLastname($record['driverLastname'] ?? null);
            $user->setDriverPhoneNumber($record['driverPhoneNumber'] ?? null);
            $users[] = $user;
            // Hash the password
            $hashedPassword = $this->passwordHasher->hashPassword($user, $record['plainPassword'] ?? '');
            $user->setPassword($hashedPassword);

            $manager->persist($user);
        }

        $manager->flush();

        // Création des concessions
        $dealerships = [];
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
            $dealerships[] = $dealership;
            $manager->persist($dealership);
        }

        // Sauvegarde des données dans la base
        $manager->flush();

        $path = __DIR__ . '/../../public/data/cars.csv';
        $csv = Reader::createFromPath($path, 'r');
        $csv->setDelimiter(';');
        $csv->setHeaderOffset(0); // Utilise la première ligne comme en-tête

        // Parcours des enregistrements du CSV
        $cars = [];
        foreach ($csv->getRecords() as $record) {
            $car = new Car();
            $car->setBrand($record['brand'] ?? null);
            $car->setModel($record['model'] ?? null);
            $car->setEntryCirculationDate(new DateTimeImmutable($record['entryCirculationDate']));
            $car->setVin($record['vin'] ?? null);
            $car->setDistance($record['distance'] ?? null);
            $car->setRegistration((int)$record['registration'] ?? null);
            $car->setUser($users[array_rand($users)]); // Randomly assign a user from the list
            $manager->persist($car);
            $cars[] = $car;
        }

        // Création des interventions à partir du fichier CSV
        $interventionsCsvPath = __DIR__ . '/../../public/data/interventions.csv';
        $interventionsCsv = Reader::createFromPath($interventionsCsvPath, 'r');
        $interventionsCsv->setDelimiter(';');
        $interventionsCsv->setHeaderOffset(0);
        $interventions = [];
        // Inside the foreach loop for interventions
        foreach ($interventionsCsv->getRecords() as $record) {
            $intervention = new Intervention();

            // Validate and fetch the Car entity
            $intervention->setCar($cars[array_rand($cars)]); // Randomly assign a car from the list

            // Validate and fetch the Dealership entity

            $intervention->setGarage($dealerships[array_rand($dealerships)]); // Randomly assign a dealership from the list


            $intervention->setDate(DateTime::createFromFormat('Y-m-d', $record['date']) ?? null);
            $intervention->setDiagnostic($record['diagnostic'] ?? null);
            $interventions[] = $intervention;
            $manager->persist($intervention);
        }

        // Création des opérations à partir du fichier CSV
        $operationsCsvPath = __DIR__ . '/../../public/data/operations.csv';
        $operationsCsv = Reader::createFromPath($operationsCsvPath, 'r');
        $operationsCsv->setDelimiter(';');
        $operationsCsv->setHeaderOffset(0);
        $operations = [];
        foreach ($operationsCsv->getRecords() as $record) {
            $operation = new Operation();
            $operation->setName($record['operation_name'] ?? null);
            $operation->setCategory($record['category'] ?? null);
            $operation->setHelp($record['additionnal_help'] ?? null);
            $operation->setComment($record['additionnal_comment'] ?? null);
            $operation->setDuration($record['time_unit'] ?? null);
            $operation->setPrice($record['price'] ?? null);
            $operations[] = $operation;
            $manager->persist($operation);
        }

        $manager->flush();

        foreach ($interventions as $intervention) {
            $intervention->addOperation($operations[array_rand($operations)]); // Randomly assign an intervention from the list
            $intervention->addOperation($operations[array_rand($operations)]); // Randomly assign an intervention from the list
            $intervention->addOperation($operations[array_rand($operations)]); // Randomly assign an intervention from the list

            // Persist the updated Intervention
            $manager->persist($intervention);
        }

// Flush changes to the database
        $manager->flush();

    }
}