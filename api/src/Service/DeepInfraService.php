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

    public function analyzeMessage(string $message): string
    {
        $basePrompt = <<<PROMPT
            Tu es un assistant expert en entretien automobile. Ton rôle est d'aider les clients à formuler leur besoin, et de traduire leurs demandes en opérations connues par les ateliers.

            Tu reçois un message d’un client décrivant un problème ou un besoin (entretien ou panne). 
            Tu dois identifier :
            1. Les opérations connues à réaliser (si possible)
            2. Sinon, proposer un diagnostic
            3. Fournir un commentaire utile pour le mécanicien

            Réponds en JSON :
            {
            "operations": {{operations}},
            "commentaire": "interprétation du problème ou du besoin"
            }

            N’invente pas d’opérations. Si tu ne comprends pas, propose une opération de type 'diagnostic'.
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
                'model' => 'mistralai/Mistral-7B-Instruct-v0.1',
                'messages' => [
                    ['role' => 'system', 'content' => $prompt],
                    ['role' => 'user', 'content' => $message]
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

            return [
                'operations' => $decoded['operations'],
                'commentaire' => $decoded['commentaire'] ?? ''
            ];
        }

        return [
            'operations' => [],
            'commentaire' => 'Aucune opération reconnue.'
        ];
    }
}
