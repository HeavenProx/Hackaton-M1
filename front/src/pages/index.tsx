import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ProfessionalPDFButton() {
    const generatePDF = () => {
        const doc = new jsPDF();
        const primaryColor = "#2c3e50";
        const sectionBgColor = "#ecf0f1";
        const textColor = "#000";
        const pageWidth = doc.internal.pageSize.getWidth();

        // Margins
        const leftMargin = 15;
        let currentY = 20;

        // Header
        doc.setFontSize(18);
        doc.setTextColor(primaryColor);
        doc.text("FICHE CLIENT & VEHICULE", pageWidth / 2, currentY, {
            align: "center",
        });

        currentY += 10;
        doc.setDrawColor(180);
        doc.line(leftMargin, currentY, pageWidth - leftMargin, currentY);
        currentY += 8;

        // Client Section
        doc.setFillColor(sectionBgColor);
        doc.rect(leftMargin, currentY, pageWidth - leftMargin * 2, 8, "F");
        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.text("Informations Client", leftMargin + 2, currentY + 6);
        currentY += 14;

        doc.setTextColor(textColor);
        doc.setFontSize(12);
        doc.text("Nom : John Doe", leftMargin, currentY);
        currentY += 7;
        doc.text("Adresse : 123 Main St, Cityville", leftMargin, currentY);
        currentY += 7;
        doc.text("Téléphone : 123-456-7890", leftMargin, currentY);
        currentY += 12;

        // Vehicle Section
        doc.setFillColor(sectionBgColor);
        doc.rect(leftMargin, currentY, pageWidth - leftMargin * 2, 8, "F");
        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.text("Informations Véhicule", leftMargin + 2, currentY + 6);
        currentY += 14;

        doc.setTextColor(textColor);
        doc.setFontSize(12);
        doc.text("Immatriculation : ABC-123", leftMargin, currentY);
        currentY += 7;
        doc.text("Numéro de série : 1HGCM82633A123456", leftMargin, currentY);
        currentY += 7;
        doc.text("Kilométrage : 50 000 km", leftMargin, currentY);
        currentY += 12;

        // Garage Section
        doc.setFillColor(sectionBgColor);
        doc.rect(leftMargin, currentY, pageWidth - leftMargin * 2, 8, "F");
        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.text("Garage", leftMargin + 2, currentY + 6);
        currentY += 14;

        doc.setTextColor(textColor);
        doc.setFontSize(12);
        doc.text("Nom : AutoFix Garage", leftMargin, currentY);
        currentY += 7;
        doc.text("Adresse : 456 Repair Rd, Mechanic City", leftMargin, currentY);
        currentY += 7;
        doc.text("Téléphone : 987-654-3210", leftMargin, currentY);
        currentY += 12;

        // User Input
        doc.setFillColor(sectionBgColor);
        doc.rect(leftMargin, currentY, pageWidth - leftMargin * 2, 8, "F");
        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.text("Commentaires utilisateur", leftMargin + 2, currentY + 6);
        currentY += 14;

        const userNote =
            "Ceci est un texte fourni par l'utilisateur contenant des remarques importantes ou des instructions spécifiques.";
        const splitText = doc.splitTextToSize(userNote, pageWidth - leftMargin * 2);
        doc.setFontSize(11);
        doc.setTextColor(textColor);
        doc.text(splitText, leftMargin, currentY);
        currentY += splitText.length * 5 + 5;

        // Interventions Table
        doc.setFillColor(sectionBgColor);
        doc.rect(leftMargin, currentY, pageWidth - leftMargin * 2, 8, "F");
        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.text("Interventions", leftMargin + 2, currentY + 6);
        currentY += 12;

        autoTable(doc, {
            startY: currentY,
            head: [["Intervention", "Coût (€)"]],
            body: [
                ["Vidange", "50"],
                ["Changement freins", "200"],
                ["Parallélisme", "60"],
            ],
            theme: "grid",
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontSize: 12,
                halign: "center",
            },
            bodyStyles: {
                fontSize: 11,
                textColor: textColor,
            },
            columnStyles: {
                1: { halign: "right" },
            },
            margin: { left: leftMargin, right: leftMargin },
        });

        // Total
        const total = "310 €";
        doc.setFontSize(13);
        doc.setTextColor(primaryColor);
        doc.text(
            `Coût total : ${total}`,
            pageWidth - leftMargin,
            doc.lastAutoTable.finalY + 10,
            { align: "right" }
        );

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            const pageStr = "Page " + i + " / " + pageCount;
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(pageStr, pageWidth - leftMargin, doc.internal.pageSize.getHeight() - 10, { align: "right" });
            const date = new Date().toLocaleDateString();
            doc.text(date, leftMargin, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save("fiche_professionnelle.pdf");
    };

    return (
        <button
            onClick={generatePDF}
            style={{
                padding: "12px 30px",
                background: "linear-gradient(90deg, #2c3e50, #4ca1af)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
            }}
        >
            Télécharger le PDF Professionnel
        </button>
    );
}
