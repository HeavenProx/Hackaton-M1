import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ClientInfo = {
  lastName: string;
  firstName: string;
  address: string;
  phone: string;
};

type CarInfo = {
  carLicence: string;
  carVin: string;
  carDistance: string;
};

type GarageInfo = {
  name: string;
  address: string;
  phone: string;
};

type Intervention = {
  label: string;
  price: number;
};

export function generatePDF(
  client: ClientInfo,
  car: CarInfo,
  garage: GarageInfo,
  userText: string,
  interventions: Intervention[],
) {
  const doc = new jsPDF();

  // Client info
  doc.setFontSize(12);
  doc.text("Informations du client :", 10, 15);
  doc.text(`Nom: ${client.lastName}`, 10, 22);
  doc.text(`Prénom: ${client.firstName}`, 10, 29);
  doc.text(`Adresse: ${client.address}`, 10, 36);
  doc.text(`Téléphone: ${client.phone}`, 10, 43);

  // Car info
  doc.text("Véhicule :", 10, 53);
  doc.text(`Immatriculation: ${car.carLicence}`, 10, 60);
  doc.text(`Numéro de série: ${car.carVin}`, 10, 67);
  doc.text(`Kilométrage: ${car.carDistance}`, 10, 74);

  // Garage info
  doc.text("Garage :", 10, 84);
  doc.text(`Nom: ${garage.name}`, 10, 91);
  doc.text(`Adresse: ${garage.address}`, 10, 98);
  doc.text(`Téléphone: ${garage.phone}`, 10, 105);

  // Texte utilisateur centré
  doc.setFontSize(14);
  doc.text("Informations complémentaires :", 105, 120, { align: "center" });
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(userText, 180), 15, 130);

  // Tableau interventions
  const tableY = 150 + Math.ceil(doc.getTextDimensions(userText).h / 2);

  autoTable(doc, {
    startY: tableY,
    head: [["Intervention", "Prix (€)"]],
    body: interventions.map((i) => [i.label, i.price.toFixed(2)]),
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    styles: { halign: "center" },
    foot: [
      [
        { content: "Total", colSpan: 1 },
        interventions.reduce((acc, i) => acc + i.price, 0).toFixed(2),
      ],
    ],
    footStyles: { fillColor: [41, 128, 185] },
  });

  doc.save("fiche-client.pdf");
}
