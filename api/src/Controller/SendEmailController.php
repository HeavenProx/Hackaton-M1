<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
class SendEmailController
{
    #[Route('/api/send-mail-pdf', name: 'api_send_mail', methods: ['POST'])]
    public function __invoke(Request $request, MailerInterface $mailer): JsonResponse
    {
        $uploadedFile = $request->files->get('file');
        $email = $request->request->get('emailClient');

        if (!$uploadedFile) {
            return new JsonResponse(['error' => 'Aucun fichier reçu'], Response::HTTP_BAD_REQUEST);
        }

        // Email setup
        $email = (new Email())
            ->from('no_reply@garage-folie.com')
            ->to($email)
            ->subject('Fiche intervention (ne pas répondre)')
            ->text('Veuillez trouver en pièce jointe la fiche intervention PDF.')
            ->attachFromPath($uploadedFile->getPathname(), $uploadedFile->getClientOriginalName(), 'application/pdf');

        // Send email
        $mailer->send($email);

        return new JsonResponse(['message' => 'PDF envoyé avec succès']);
    }

    #[Route('/api/send-mail-rdv', name: 'api_send_rdv', methods: ['POST'])]
    public function sendEmail(Request $request, MailerInterface $mailer): JsonResponse
    {
        $uploadedFile = $request->files->get('file');
        $email = $request->request->get('emailClient');

        if (!$uploadedFile) {
            return new JsonResponse(['error' => 'Aucun fichier reçu'], Response::HTTP_BAD_REQUEST);
        }

        // Email setup
        $email = (new Email())
            ->from('no_reply@garage-folie.com')
            ->to($email)
            ->subject('Prise de rendez-vous')
            ->text('Nous vous validons la prise en compte de votre demande de rensez-vous. \n ');

        // Send email
        $mailer->send($email);

        return new JsonResponse(['message' => 'PDF envoyé avec succès']);
    }
}
