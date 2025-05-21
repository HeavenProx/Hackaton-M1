<?php

namespace App\Service;

use App\Repository\OperationRepository;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class DeepInfraService
{
    private string $apiKey;
    private HttpClientInterface $client;
    private OperationRepository $operationRepo;

    public function __construct(HttpClientInterface $client, string $apiKey, OperationRepository $operationRepo)
    {
        $this->client = $client;
        $this->apiKey = $apiKey;
        $this->operationRepo = $operationRepo;
    }

    public function analyzeMessage(array $messages): string
    {
        $basePrompt = <<<PROMPT
            Tu es un assistant virtuel pour la prise de rendez-vous en atelier automobile.

            Ta mission est d'accompagner un client étape par étape, sans lui expliquer le déroulement complet à l’avance.

            À chaque message :
            - Ne pose qu'une seule question ou donne une seule information utile à l’étape actuelle.
            - N’explique jamais toutes les étapes du processus.
            - Sois fluide, professionnel, clair et efficace.

            Le déroulement que tu suis (interne uniquement, ne pas expliquer au client) :
            1. Demander l’immatriculation du véhicule
            2. Identifier son besoin (entretien, panne, etc.)
            3. Proposer des opérations connues à partir de la liste suivante : {{operations}}
            4. Si aucune opération ne correspond, proposer "diagnostic"
            5. Demander sa localisation pour suggérer un garage
            6. Proposer des créneaux disponibles
            7. Générer un résumé clair pour l’atelier

            Si tu n’as pas assez d’informations, pose une question de suivi courte.

            Réponds uniquement par un message clair destiné au client, sans structure JSON, sans expliquer ta logique interne.

            Adopte un ton chaleureux, poli et engageant, comme un conseiller en concession aimable et à l’écoute.

            ⚠️ Tu n’es pas mécanicien, tu ne dois **jamais poser de diagnostic technique** ni faire de supposition mécanique. Tu peux uniquement aider à **qualifier les symptômes décrits** et guider le client vers une opération standard ou un diagnostic.

            Si le problème n’est pas clair, oriente toujours le client vers une opération de type **diagnostic**, sans interprétation mécanique.

            Exemples :
            ✅ Bon : "Merci pour votre description, je vous propose un diagnostic en atelier pour mieux identifier la cause."
            ❌ Mauvais : "C’est probablement un problème de plaquettes ou d’amortisseurs."
            
            En plus de la réponse destinée au client, structure ta réponse dans un JSON à 2 champs :

            {
                "message": "texte à afficher au client",
                "action": "code pour le frontend (ex : ask_plate, select_operations, etc.)",
                "options": ["option 1", "option 2", ...] // si applicable (sinon, omettre ce champ)
            }

            Utilise cette structure à chaque fois. Elle permet à l’interface de s’adapter dynamiquement.
            PROMPT;

        $operationsList = implode(', ', array_map(
            fn($op) => $op->getName(),
            $this->operationRepo->findAll()
        ));

        $prompt = str_replace('{{operations}}', $operationsList, $basePrompt);

        $response = $this->client->request('POST', 'https://api.deepinfra.com/v1/openai/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'meta-llama/Llama-2-70b-chat-hf',
                'messages' => [
                    ['role' => 'system', 'content' => $prompt],
                    ...$messages,
                ],
                'temperature' => 0.5
            ]
        ]);

        $data = $response->toArray();

        return $data['choices'][0]['message']['content'] ?? '';
    }

    public function parseResponse(string $text): array
    {
        $jsonStart = strpos($text, '{');

        if ($jsonStart !== false) {
            $json = substr($text, $jsonStart);
            $decoded = json_decode($json, true);
        }

        return $decoded ?? [];
    }
}
