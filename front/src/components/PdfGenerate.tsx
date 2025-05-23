import React, { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Button } from "@heroui/react";

// Styles PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: "#ecf0f1",
    padding: 5,
    fontSize: 14,
    color: "#2c3e50",
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    marginBottom: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
    borderBottom: "1pt solid #ccc",
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
  },
  total: {
    textAlign: "right",
    fontSize: 13,
    color: "#2c3e50",
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 10,
    color: "#888",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Document PDF
const MyPDF = ({ data }: { data: any }) => {
  // Calcul du total des opérations
  const totalCost = data.operations.reduce(
    (sum: any, op: any) =>
      parseFloat(sum) + parseFloat(op.price.replace(",", ".")),
    0,
  );

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>
          FICHE CLIENT & VEHICULE -{" "}
          {new Date(data.date).toISOString().replace("T", " ").split(".")[0]}
        </Text>

        {/* Vehicle */}
        <Text style={styles.sectionTitle}>Informations Véhicule</Text>
        <Text style={styles.text}>Marque : {data.car.brand}</Text>
        <Text style={styles.text}>Modèle : {data.car.model}</Text>
        <Text style={styles.text}>
          Immatriculation : {data.car.registration}
        </Text>
        <Text style={styles.text}>Kilométrage : {data.car.distance} km</Text>

        {/* Garage */}
        <Text style={styles.sectionTitle}>Garage</Text>
        <Text style={styles.text}>Nom : {data.garage.dealership_name}</Text>
        <Text style={styles.text}>Adresse : {data.garage.address}</Text>
        <Text style={styles.text}>Ville : {data.garage.city}</Text>

        {/* Diagnostic */}
        <Text style={styles.sectionTitle}>Diagnostic</Text>
        <Text style={styles.text}>{data.diagnostic}</Text>

        {/* Table Interventions */}
        <Text style={styles.sectionTitle}>Interventions</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Intervention</Text>
          <Text style={styles.tableCellRight}>Coût (€)</Text>
        </View>

        {data.operations.map((operation: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{operation.name}</Text>
            <Text style={styles.tableCellRight}>
              {parseFloat(operation.price.replace(",", "."))
                .toFixed(2)
                .replace(".", ",")}
            </Text>
          </View>
        ))}

        {/* Total */}
        <View style={[styles.tableRow, { backgroundColor: "#ecf0f1" }]}>
          <Text style={[styles.tableCell, { fontWeight: "bold" }]}>Total</Text>
          <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
            {totalCost.toFixed(2).replace(".", ",")} €
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{new Date().toLocaleDateString()}</Text>
          <Text>Page 1 / 1</Text>
        </View>
      </Page>
    </Document>
  );
};

interface PDFButtonProps {
  interventionId: string;
}

export default function PDFButton({ interventionId }: PDFButtonProps) {
  const [data, setData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const token = localStorage.getItem("token");

  console.log(interventionId);
  useEffect(() => {
    // Fetch data from the API with the token
    fetch(`http://localhost:8000/interventions/${interventionId}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token in the header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [interventionId]);

  const handleDownloadClick = async () => {
    setIsGenerating(true);

    try {
      // Génération du blob PDF à partir de ton composant PDF
      const blob = await pdf(<MyPDF data={data} />).toBlob();

      const formData = new FormData();

      formData.append(
        "file",
        new File([blob], "compte_rendu_chatbot.pdf", {
          type: "application/pdf",
        }),
      );
      formData.append("emailClient", data["car"]["user"]["email"]);

      const response = await fetch("http://localhost:8000/api/send-mail-pdf", {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the header
        },
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du PDF");
      }

      console.log("PDF envoyé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi du PDF :", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <PDFDownloadLink
      document={<MyPDF data={data} />}
      fileName="fiche_professionnelle.pdf"
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <Button
          color="primary"
          variant={"flat"}
          size="sm"
          isLoading={loading || isGenerating}
          onClick={handleDownloadClick}
        >
          {loading || isGenerating
            ? "Génération en cours..."
            : "Télécharger le PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
