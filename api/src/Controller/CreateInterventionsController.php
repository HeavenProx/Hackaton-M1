<?php

namespace App\Controller;

use App\Entity\Intervention;
use App\Repository\CarRepository;
use App\Repository\DealershipRepository;
use App\Repository\InterventionRepository;
use App\Repository\OperationRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class CreateInterventionsController
{

    public function __construct(
        private OperationRepository $operationRepository,
        private CarRepository $carRepository,
        private DealershipRepository $dealershipRepository,
        private InterventionRepository $interventionRepository
    )
    {
        // Constructor logic if needed
    }

    /**
     * @throws \DateMalformedStringException
     */
    #[Route('/interventions', name: 'api_interventions', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $carId = (int) $data['car'] ?? null;
        $garageId = (int) $data['garage'] ?? null;
        $operations = $data['operations'] ?? [];
        $diagnostic = $data['diagnostic'] ?? null;
        $date = $data['date'] ?? null;

        // Validate required fields
        if (!$carId || !$garageId || !$operations || !$diagnostic || !$date) {
            return new JsonResponse(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        // Validate data types
        if (!is_int($carId) || !is_int($garageId)) {
            return new JsonResponse(['error' => 'Invalid car or garage ID'], Response::HTTP_BAD_REQUEST);
        }

        if (!is_array($operations) || empty($operations)) {
            return new JsonResponse(['error' => 'Operations must be a non-empty array'], Response::HTTP_BAD_REQUEST);
        }

        if (!\DateTime::createFromFormat('Y-m-d H:i:s', $date)) {
            return new JsonResponse(['error' => 'Invalid date format. Expected format: Y-m-d H:i:s'], Response::HTTP_BAD_REQUEST);
        }

        $intervention = new Intervention();
        $intervention->setCar($this->carRepository->findOneBy(['id' => $carId]));
        $intervention->setGarage($this->dealershipRepository->findOneBy(['id' => $garageId]));
        $intervention->setDiagnostic($diagnostic);
        $intervention->setDate(new \DateTime($date));
        foreach ($operations as $operationName ) {
            $operation = $this->operationRepository->findOneBy(['name' => $operationName]);
            if (!$operation) {
                return new JsonResponse(['error' => "Operation with ID $operationName not found"], Response::HTTP_BAD_REQUEST);
            }

            $intervention->addOperation($operation);
        }
        $entityManager = $this->interventionRepository->getEntityManager();
        $entityManager->persist($intervention);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Intervention created successfully', "id"=> $intervention->getId()], Response::HTTP_CREATED);
    }
}