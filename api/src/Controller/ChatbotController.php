<?php

namespace App\Controller;

use App\Service\DeepInfraService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ChatbotController extends AbstractController
{
    #[Route('/api/chatbot/analyze', name: 'chatbot_analyze', methods: ['POST'])]
    public function analyze(Request $request, DeepInfraService $ai): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $message = $data['message'] ?? '';

        $text = $ai->analyzeMessage($message);
        $parsed = $ai->parseResponse($text);

        return $this->json([
            'raw_response' => $text,
            'parsed' => $parsed
        ]);
    }
}
