<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Repository\InterventionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: InterventionRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/interventions/{id}/pdf',
            normalizationContext: ['groups' => ['interventions_pdf::read']],
            validationContext: ['groups' => ['interventions_pdf::read']],
            name: 'interventions_pdf',
        )
    ]
)]
class Intervention
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['interventions_pdf::read'])]
    #[ORM\ManyToOne(inversedBy: 'interventions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Car $car = null;

    #[Groups(['interventions_pdf::read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $diagnostic = null;

    #[Groups(['interventions_pdf::read'])]
    #[ORM\ManyToOne(inversedBy: 'interventions')]
    private ?Dealership $garage = null;

    #[Groups(['interventions_pdf::read'])]
    #[ORM\Column]
    private ?\DateTime $date = null;

    /**
     * @var Collection<int, Operation>
     */
    #[Groups(['interventions_pdf::read'])]
    #[ORM\ManyToMany(targetEntity: Operation::class, inversedBy: 'interventions')]
    private Collection $operations;

    public function __construct()
    {
        $this->operations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCar(): ?Car
    {
        return $this->car;
    }

    public function setCar(?Car $car): static
    {
        $this->car = $car;

        return $this;
    }

    public function getDiagnostic(): ?string
    {
        return $this->diagnostic;
    }

    public function setDiagnostic(?string $diagnostic): static
    {
        $this->diagnostic = $diagnostic;

        return $this;
    }

    public function getGarage(): ?Dealership
    {
        return $this->garage;
    }

    public function setGarage(?Dealership $garage): static
    {
        $this->garage = $garage;

        return $this;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTime $date): static
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return Collection<int, Operation>
     */
    public function getOperations(): Collection
    {
        return $this->operations;
    }

    public function addOperation(Operation $operation): static
    {
        if (!$this->operations->contains($operation)) {
            $this->operations->add($operation);
        }

        return $this;
    }

    public function removeOperation(Operation $operation): static
    {
        $this->operations->removeElement($operation);

        return $this;
    }
}
