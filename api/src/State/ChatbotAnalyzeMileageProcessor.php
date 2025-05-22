<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\DTO\ChatbotRequestInput;
use App\DTO\ChatbotResponseOutput;
use App\Service\DeepInfraService;

class ChatbotAnalyzeMileageProcessor implements ProcessorInterface
{
    public function __construct(private DeepInfraService $ai) {}

    public function process($data, Operation $operation, array $uriVariables = [], array $context = []): ChatbotResponseOutput
    {
        if (!$data instanceof ChatbotRequestInput) {
            throw new \InvalidArgumentException('Invalid input');
        }

        $response = $this->ai->analyzeMileage($data->messages);
        $parsedResponse = $this->ai->parseResponse($response);

        return new ChatbotResponseOutput($parsedResponse);
    }
}
