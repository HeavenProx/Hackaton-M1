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
            1. Demander quel véhicule j'utilise parmis ceux que j'ai enregistré sur mon compte
            2. Identifier son besoin (entretien, panne, etc.)
            3. Proposer des opérations connues à partir de la liste suivante : {{operations}}
            4. Si aucune opération ne correspond, proposer "diagnostic"
            5. Demander sa localisation pour suggérer un garage
            6. Proposer des créneaux disponibles (ne propose pas d'heure, demande seulement s'il souhaite réserver un créneau)
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
                "action": "code pour le frontend (ex : ask_plate, select_operations, select_schedule etc.)",
                "options": ["option 1", "option 2", ...] // si applicable (sinon, omettre ce champ),
                "diagnostic": "résumé technique du problème avec les symptômes et les opérations proposées" // uniquement à la dernière étape pour résumer le problème pour le technicien
            }

            Utilise cette structure à chaque fois. Elle permet à l’interface de s’adapter dynamiquement.

            ⚠️ Réponds STRICTEMENT avec un JSON valide. Ne mets pas de ```json ni d’autres balises. Pas de texte avant ou après. Seulement du JSON.
            PROMPT;

        $operationsList = implode(', ', array_map(
            fn($op) => $op->getName(),
            $this->operationRepo->findAll()
        ));

        $prompt = str_replace('{{operations}}', $operationsList, $basePrompt);

        $response = $this->client->request('POST', 'https://api.mistral.ai/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'mistral-medium-latest',
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

    public function analyzeMileage(array $messages): string
    {
        $basePrompt = <<<PROMPT
            Tu es un assistant virtuel pour la prise de rendez-vous en atelier automobile.

            Ta mission est d'accompagner un client étape par étape, sans lui expliquer le déroulement complet à l’avance.
            
            Tu vas recevoir les kilométrage de voiture. Il faut que tu les analyse et que tu proposes les entretiens les plus proches à réaliser.
            
            Proposer des opérations connues à partir de la liste suivante : {{operations}}
            
            Seul les opérations d'entretien sont à proposer. Ne pas proposer de diagnostic ou de réparation.
            
            Il faut que tu donne un degrés d'urgence (urgent, prochainement, à prévoir), il ne faut pas d'autres informations.
            
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
                "options": [{"operation": "option 1", "urgence": "degrés d'urgence" },  {"operation": "option 2", "urgence": "degrés d'urgence" },, ...] // si applicable (sinon, omettre ce champ) 
            }
            
            Ne pose pas de question à la fin du message.

            Utilise cette structure à chaque fois. Elle permet à l’interface de s’adapter dynamiquement.

            ⚠️ Réponds STRICTEMENT avec un JSON valide. Ne mets pas de ```json ni d’autres balises. Pas de texte avant ou après. Seulement du JSON.
            PROMPT;;

        $operationsList = implode(', ', array_map(
            fn($op) => $op->getName(),
            $this->operationRepo->findAll()
        ));

        $prompt = str_replace('{{operations}}', $operationsList, $basePrompt);

        $response = $this->client->request('POST', 'https://api.mistral.ai/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'mistral-medium-latest',
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
        // Cherche un bloc JSON dans le texte avec une regex
        if (preg_match('/\{(?:[^{}]|(?R))*\}/s', $text, $matches)) {
            $json = $matches[0];
            $decoded = json_decode($json, true);

            // On retourne le JSON décodé s’il est valide
            if (is_array($decoded)) {
                return $decoded + [
                    "message" => "Réponse mal formée.",
                    "action" => null,
                    "options" => []
                ];
            }
        }

        // Fallback si aucun JSON valide n'est trouvé
        return [
            "message" => $text,
            "action" => null,
            "options" => []
        ];
    }
}
