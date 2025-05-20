<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use League\Csv\Reader;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UsersFixtures extends Fixture
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

        foreach ($csv->getRecords() as $record) {
            $user = new User();
            $user->setEmail($record['email'] ?? null);
            $user->setRoles(json_decode($record['roles'] ?? '[]', true));
            $user->setTitle($record['title'] ?? null);
            $user->setLastname($record['lastname'] ?? null);
            $user->setFirstname($record['firstname'] ?? null);
            $user->setAddress($record['address'] ?? null);
            $user->setPhoneNumber($record['phoneNumber'] ?? null);
            $user->setDriver(filter_var($record['driver'] ?? false, FILTER_VALIDATE_BOOLEAN));
            $user->setDriverFirstname($record['driverFirstname'] ?? null);
            $user->setDriverLastname($record['driverLastname'] ?? null);
            $user->setDriverPhoneNumber($record['driverPhoneNumber'] ?? null);

            // Hash the password
            $hashedPassword = $this->passwordHasher->hashPassword($user, $record['plainPassword'] ?? '');
            $user->setPassword($hashedPassword);

            $manager->persist($user);
        }

        $manager->flush();
    }
}