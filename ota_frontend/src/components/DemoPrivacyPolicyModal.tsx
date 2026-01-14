import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Box,
  Link,
  chakra,
  ListItem,
  UnorderedList,
  Image,
  HStack,
  VStack,
} from "@chakra-ui/react";
import DataCollectionIcon from "../assets/edit.svg";
import PaymentIcon from "../assets/payment.svg";
import CameraIcon from "../assets/camera.png";
import LocationIcon from "../assets/location.png";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const StyledSubHeading = chakra(Text, {
  baseStyle: {
    as: "h3",
    fontSize: "l",
    fontWeight: "bold",
  },
});

const StyledHeading = chakra(Text, {
  baseStyle: {
    as: "h2",
    fontSize: "xl",
    fontWeight: "bold",
  },
});

const StyledLink = chakra(Link, {
  baseStyle: {
    color: "blue.500",
    textDecoration: "underline",
    _hover: { color: "blue.600" },
  },
});

const DemoPrivacyPolicyModal = ({ open, onClose }: DemoModalProps) => {
  return (
    <Modal isOpen={open} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>Privacy Policy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            maxH="70vh"
            overflowY="auto"
            p={4}
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            display="flex"
            gap="12px"
            flexDirection="column"
          >
            <HStack alignItems="center" justifyContent="space-between">
              <Text
                as="h1"
                fontSize="2xl"
                fontWeight="bold"
                mt={4}
                mb={2}
                mr={10}
              >
                Datenschutzerklärung
              </Text>
              <HStack spacing={2}>
                <Image
                  src={DataCollectionIcon}
                  alt="dataCollection"
                  boxSize="30px"
                />
                <Image src={PaymentIcon} alt="paymentPolicy" boxSize="30px" />
                <Image src={CameraIcon} alt="paymentPolicy" boxSize="30px" />
                <Image src={LocationIcon} alt="locationPolicy" boxSize="30px" />
              </HStack>
            </HStack>

            <Text as="p">(Version 12.9., Datum: 18.12.2025)</Text>
            <Text>
              Mit dieser Datenschutzerklärung informiert die N26 Bank SE
              (nachfolgend: „N26“, „wir“, „unser“) dich über dieErhebung,
              Nutzung und Verarbeitung personenbezogener Daten bei Verwendung
              unserer Website unter{" "}
              <StyledLink href="https://n26.com">https://n26.com</StyledLink>{" "}
              (nachfolgend: „Website“), unserer Web-Applikation (nachfolgend:
              „Web-App“) und unsererMobile-App (nachfolgend: „App“;
              gemeinschaftlich bezeichnet als: „Dienste“) und unsere
              Social-Media-Seiten(zusammen: "Dienste"). Wir werden ausdrücklich
              darauf hinweisen, wenn sich eine Information
              dieserDatenschutzerklärung ausschließlich auf einen unserer
              Dienste bezieht. Informationen über die Verwendungvon Cookies oder
              ähnlichen Technologien auf unserer Website, Web-App oder App
              findest du in den jeweiligenCookie-Richtlinien für die Website und
              die App im Abschnitt Rechtliche Dokumente deiner App oder auf
              unsererWebsite.
            </Text>
            <Text>
              Personenbezogene Daten in diesem Zusammenhang sind alle
              Einzelangaben über persönliche oder sachlicheVerhältnisse einer
              bestimmten oder bestimmbaren natürlichen Person, wie z. B. Name,
              Telefonnummer oderAnschrift. Wir verarbeiten deine
              personenbezogenen Daten entweder im Rahmen unserer
              Geschäftsbeziehung,wenn du N26-Kunde bist oder wenn du unsere
              Website zu Informationszwecken besuchst, wenn du aufunseren
              Social-Media-Seiten surfst oder mit uns in Kontakt trittst.
              Darüber hinaus verarbeiten wirpersonenbezogene Daten aus
              öffentlich zugänglichen Quellen (z.B. Schuldnerverzeichnisse,
              Handels- undVereinsregister, Medien, Presse, Internet), wenn wir
              eine gesetzliche Grundlage haben, die uns dies erlaubt.
            </Text>

            <Text>
              Bei Nutzung von weiteren N26 Produkten oder Produkten unserer
              Geschäftspartner können weiterepersonenbezogene Daten erhoben,
              verarbeitet und gespeichert werden. Nähere Informationen
              zurVerarbeitung weiterer Daten findest du unter der jeweiligen
              Produktkategorie unten.
            </Text>

            <StyledHeading>
              I. Verantwortlicher, Auftragsverarbeiter und
              getrennteVerantwortliche
            </StyledHeading>

            <Text>
              Die verantwortliche Stelle für die Erhebung, Verarbeitung und
              Nutzung deiner personenbezogenen Daten ist:
            </Text>

            <Text>N26 Bank SEVoltairestraße 810179 Berlin</Text>
            <Text>
              N26 hat einen Datenschutzbeauftragten bestellt, der unter{" "}
              <StyledLink href="mailto:dpo@n26.com">dpo@n26.com</StyledLink> zu
              erreichen ist.
            </Text>
            <Text>Nähere Informationen zu N26 findest du im Impressum.</Text>
            <Text>
              Unsere Datenverarbeitungsaktivitäten können zum Teil von einem
              Dritten im Auftrag von N26 durchgeführtwerden. Sofern die
              Verarbeitung personenbezogener Daten im Auftrag von N26 erfolgt,
              schließen wir gemäßArt. 28 der Verordnung (EU) 2016/679 des
              Europäischen Parlaments und des Rates vom 27. April 2016 zumSchutz
              natürlicher Personen bei der Verarbeitung personenbezogener Daten,
              zum freien Datenverkehr und zurAufhebung der Richtlinie 95/46/EG
              (Datenschutz-Grundverordnung) (nachfolgend: „DSGVO“) einen
              gesondertenVertrag mit dem Auftragsverarbeiter.
            </Text>
            <Text>
              Unsere Liste der Auftragsverarbeiter umfasst reine
              Datenverarbeiter, also Anbieter technischerDienstleistungen, die
              unter die folgenden Kategorien fallen:
            </Text>
            <UnorderedList>
              <ListItem>IT-Infrastruktur- und Verbindungsanbieter</ListItem>
              <ListItem> IT-Sicherheitsanbieter</ListItem>
              <ListItem>
                Software- und Softwarewartungsanbieter, u.a. für die
                Bereitstellung unserer App
              </ListItem>
              <ListItem>Backoffice-Management-Dienstanbieter</ListItem>
              <ListItem>Cloud-Infrastruktur-Dienstanbieter</ListItem>
              <ListItem>
                Anbieter von Finanzdienstleistungen, Zahlungs- sowie
                Transaktionsverarbeitungsdiensten
              </ListItem>
              <ListItem>Customer-Relationship-Management-Anbieter</ListItem>
              <ListItem>KYC-Anbieter</ListItem>
              <ListItem>Kundenserviceanbieter</ListItem>
              <ListItem>
                Anbieter von Betrugspräventions- und Identifizierungsdiensten
              </ListItem>
              <ListItem>Zahlungskarten-Dienstanbieter</ListItem>
              <ListItem>Kontowechsel-Dienstanbieter</ListItem>
              <ListItem>Werbe-Dienstanbieter</ListItem>
              <ListItem>Adressüberprüfungsanbieter</ListItem>
              <ListItem>
                Anbieter von Informations-/Dokumentationsautomatisierungs-,
                -Management und-Vernichtungsdiensten
              </ListItem>
              <ListItem>
                Anbieter von Käuferreichweite-/Folgenabschätzungen
              </ListItem>
              <ListItem>Beratungsunternehmen</ListItem>
              <ListItem>Anbieter von Analysesoftware/-plattformen</ListItem>
            </UnorderedList>

            <VStack alignItems="center">
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
            </VStack>

            <StyledHeading>
              III. Datenverarbeitung im Rahmen der N26 Produkte
            </StyledHeading>
            <StyledSubHeading>
              1. Datenerhebung und Verarbeitung bei Eröffnung und Nutzung des
              N26Girokontos
            </StyledSubHeading>
            <Text>
              Zum Zwecke der Eröffnung eines Girokontos bei N26 (nachfolgend:
              „Sign-up“) und der Nutzung der Dienste vonN26 werden
              personenbezogene Daten im Zusammenhang mit deiner Identifizierung,
              Kontaktdaten,wirtschaftliche und finanzielle Daten von N26
              verarbeitet. Die Rechtsgrundlage für die Verarbeitung dieserDaten
              ist Art. 6 (1) b) DSGVO. Zu diesen Daten gehören unter anderem
              folgende personenbezogene Daten:
            </Text>
            <UnorderedList>
              <VStack alignItems="flex-start" gap="12px">
                <ListItem>Vor- und Nachname</ListItem>
                <ListItem>Geburtsdatum</ListItem>
                <ListItem>Geburtsort</ListItem>
                <ListItem>Staatsangehörigkeit</ListItem>
                <ListItem>E-Mail-Adresse</ListItem>
                <ListItem>Meldeadresse</ListItem>
                <ListItem>Mobiltelefonnummer</ListItem>
                <ListItem>
                  Steueridentifikationsnummer und steuerlicher Wohnsitz
                </ListItem>
                <ListItem>Beruf</ListItem>
                <ListItem>Geschlecht</ListItem>
                <ListItem>
                  Ausweisdokument, einschließlich Art des Ausweisdokuments,
                  Ausstellungsdatum, Gültigkeitsdatum,Dokumentnummer und
                  ausstellende Behörde
                </ListItem>
                <ListItem>
                  <VStack alignItems="flex-start">
                    <Text>
                      Daten zu deiner wirtschaftlichen Situation sowie zu deiner
                      bisherigen Nutzung von N26 Produkten undDiensten, nämlich
                      deine IBAN-Kunden-ID, Kartendetails, Übersetzungsdetails
                      (Kartenzahlungs- undÜberweisungsbeträge und -empfänger)
                      basierend auf Produkten und Diensten, die vertraglich mit
                      N26vereinbart wurden.
                    </Text>
                    <Text>
                      Wir möchten dich darauf hinweisen, dass es nicht möglich
                      ist, ein Girokonto zu eröffnen, wenn du die obengenannten
                      personenbezogenen Daten nicht zur Verfügung stellst.
                    </Text>
                    <Text>
                      Zum Zwecke der Verarbeitung von Transaktionen erhält N26
                      personenbezogene Daten und übermittelt dieseim Einklang
                      mit den geltenden gesetzlichen und aufsichtsrechtlichen
                      Vorschriften an Zahlende,EmpfängerInnen und andere
                      Finanzinstitute. Die personenbezogenen Daten, die andere
                      Rechtsträger indiesem Zusammenhang erhalten, betreffen
                      deinen Vor- und Nachnamen, einschließlich
                      Transaktionsdetails wiedie Zahlungsreferenz und die
                      registrierte IBAN.
                    </Text>
                    <Text>
                      Während der Eröffnung deines N26 Girokontos benötigen wir
                      mit deiner Einwilligung in den Einstellungendeines
                      Smartphones Zugriff auf deinen Standort. Nähere
                      Informationen findest du in der Datenschutzerklärungfür
                      das Betriebssystem deines Smartphones. Die Rechtsgrundlage
                      dieser Verarbeitung ist unser berechtigtesInteresse an der
                      Bestätigung, dass du dich im Land deines Wohnsitzes
                      aufhältst, damit wir unseren rechtlichenVerpflichtungen im
                      Zusammenhang mit der Betrugsprävention nachkommen können
                      (Art. 6 (1) f) DSGVO).
                    </Text>
                    <Text>
                      Nähere Informationen zum berechtigten Interesse als
                      Rechtsgrundlage für die Datenverarbeitung findest du
                      inAbschnitt II. oben.
                    </Text>
                    <Text>
                      Zudem bitten wir dich unter Umständen, weitere Dokumente
                      zur Überprüfung vorzulegen. DieRechtsgrundlage für diese
                      Verarbeitung ist Art. 6 (1) c) DSGVO, da die Verarbeitung
                      erforderlich ist, damit wirdie rechtlichen Verpflichtungen
                      erfüllen können, die aus Gesetzen zur Bekämpfung von
                      Geldwäsche undTerrorismusfinanzierung herrühren.
                    </Text>
                    <Text>
                      Welche personenbezogenen Daten wir verarbeiten, hängt vom
                      Dokument ab, das wir von dir anfordern underhalten.
                    </Text>
                    <Text>
                      Solche Dokumente können sein: der Nachweis deines
                      Wohnsitzes (z. B. eine Gas-, Wasser- oderStromabrechnung,
                      die nicht älter als drei Monate ist oder eine
                      Meldebescheinigung), ein Gehaltsnachweis (z. B.ein
                      Arbeitsvertrag, eine Gehaltsabrechnung oder eine
                      Vermögens- und Einkommenserklärung; solltest du unseines
                      der beiden letzten Dokumente schicken, bitten wir dich,
                      jegliche Daten, die mit deinerReligionszugehörigkeit und
                      deinem Familienstand zusammenhängen, zu schwärzen, falls
                      diese Daten dortenthalten sind), deine Visa-Dokumente oder
                      einen Studiennachweis, der den Grund angibt, weshalb du in
                      demLand wohnst, das du als Wohnsitzland angegeben hast,
                      oder eine Vermögensauskunft (Verträge,Kontoauszüge,
                      Informationen zur Veräußerung von Vermögenswerten,
                      Kapitalgewinne oder Erbe).
                    </Text>
                    <Text>
                      Sobald du uns eines der genannten Dokumente zusendest,
                      wird dieses manuell von N26 geprüft. Diesgeschieht, um zu
                      verifizieren und zu bestätigen, dass uns alle Daten über
                      dich vorliegen, die wir benötigen,damit wir dein Girokonto
                      bei uns eröffnen oder dir die weitere Nutzung unserer
                      Dienste ermöglichen können.
                    </Text>
                    <Text>
                      Sollten die Informationen, die du uns auf unsere Anfrage
                      hin gesendet hast, unzureichend sein, werden wir unsbei
                      dir melden und dich um weitere Dokumente bitten. Die oben
                      genannten Anforderungen gelten für diesenVorgang
                      gleichermaßen.
                    </Text>
                  </VStack>
                </ListItem>
              </VStack>
            </UnorderedList>
            <StyledSubHeading>
              2. Datenerhebung und -verarbeitung bei der Eröffnung und Nutzung
              einesN26 Gemeinschaftskontos
            </StyledSubHeading>
            <Text>
              Zum Zwecke der Eröffnung und Nutzung eines N26 Gemeinschaftskonto,
              müssen wir die im vorherigenAbschnitt (Abschnitt III.1)
              bezeichneten personenbezogenen Daten verarbeiten. Außerdem:
            </Text>
            <UnorderedList>
              <VStack alignItems="flex-start" gap="12px">
                <ListItem>
                  <Text>Wenn du das Gemeinschaftskonto eröffnest:</Text>
                </ListItem>
                <Text>
                  Um dein Geld gemeinsam mit einem anderen N26 Kunden zu
                  verwalten, kannst du entweder einGemeinschaftskonto einrichten
                  und einen anderen N26 Kunden einladen, sich dir anzuschließen,
                  oder dukannst eine Einladung eines anderen N26 Kunden
                  annehmen, sich einem von diesem
                  eingerichtetenGemeinschaftskonto anzuschließen.
                </Text>
                <Text>
                  Damit andere N26 Kunden dich finden können (damit sie dich
                  einladen können) oder damit sie erfahrenkönnen, dass du N26
                  beigetreten bist und bereit bist, einem Gemeinschaftskonto
                  beizutreten, musst du dich"sichtbar" machen und den Zugriff
                  auf deine Kontaktliste erlauben. Du kannst aber auch dann
                  andereMitglieder einladen, wenn du nicht sichtbar bist.
                  Weitere Informationen hierzu findest du in Abschnitt III. 3
                  und4. Solltest du derjenige sein, der ein Gemeinschaftskonto
                  einrichtet, beachte bitte, dass als
                  zusätzlicheSicherheitsmaßnahme zur Betrugsprävention deine
                  Kontaktdaten an den Eingeladenen weitergegeben werden,wenn du
                  einen anderen Kunden zu einem Gemeinschaftskonto einlädst.
                </Text>
                <ListItem>
                  Wenn du das Konto gemeinsam mit einem anderen N26 Kunden hast:
                </ListItem>
                <Text>
                  Beide Kontoinhaber sind gleichberechtigte Inhaber des Kontos
                  und beide sind berechtigt, individuell auf
                  allepersonenbezogenen Daten und Transaktionen im Zusammenhang
                  mit dem Gemeinschaftskonto zuzugreifen,einschließlich der
                  Transaktionen des anderen Inhabers in Bezug auf das
                  Gemeinschaftskonto. Der andere
                </Text>
                <Text>
                  Kontoinhaber hat keinen Zugriff auf deine Daten, die sich auf
                  dein anderes N26 Konto bzw. andere N26 Kontenvon dir beziehen.
                </Text>
                <Text>
                  Die Erhebung und Verarbeitung dieser Daten sind für die
                  Durchführung des Vertrages zwischen N26 und direrforderlich
                  (Art. 6 (1) b) DSGVO). Sie entsprechen ferner dem berechtigten
                  Interesse von N26, den unsgesetzlich auferlegten Pflichten in
                  Zusammenhang mit Geldwäsche- und Betrugsprävention
                  nachzukommen(Art. 6 (1) f) DSGVO). Nähere Informationen über
                  unser berechtigtes Interesse als Rechtsgrundlage für
                  dieDatenverarbeitung findest du in Abschnitt Il.
                </Text>
                <Text>
                  Informationen zur Übermittlung personenbezogener Daten an die
                  SCHUFA findest du unten im Abschnitt V.
                </Text>
              </VStack>
            </UnorderedList>
            <StyledSubHeading>
              3. Datenverarbeitung bei Eröffnung und Nutzung eines N26
              Geschäftskontos
            </StyledSubHeading>
            <Text>
              N26 verarbeitet personenbezogene Daten über dich zum Zwecke der
              Eröffnung und Nutzung eines N26Geschäftskontos, das du als
              alleiniger Geschäftsführer eines Unternehmens beantragst,
              eröffnest und nutzt.
            </Text>
            <Text>
              Wenn du dich im Namen eines Unternehmens für ein N26
              Geschäftskonto registrierst, erheben wir dieInformationen direkt
              von dir sowie aus den relevanten Transparenz- und
              Handelsregistern, um festzustellen,ob das Unternehmen die
              Voraussetzungen erfüllt. Diese Informationen umfassen:
            </Text>
            <UnorderedList>
              <VStack alignItems="flex-start" gap="12px">
                <ListItem>
                  Angaben zum Unternehmen, die als personenbezogene Daten
                  angesehen werden können:
                  <UnorderedList>
                    <ListItem>Firmenname</ListItem>
                    <ListItem>Handelsregisternummer</ListItem>
                    <ListItem>Unternehmensadresse</ListItem>
                    <ListItem>Geschäftsbereich.</ListItem>
                  </UnorderedList>
                </ListItem>
                <ListItem>
                  Personenbezogene Daten der gesetzlichen Vertreter,
                  Geschäftsführer, bevollmächtigten Personen undwirtschaftlich
                  Berechtigten:
                  <UnorderedList>
                    <ListItem>Name</ListItem>
                    <ListItem>Geburtsdatum</ListItem>
                    <ListItem>Adresse</ListItem>
                    <ListItem>
                      Registrierungsdaten aus deinem persönlichen Konto.
                    </ListItem>
                  </UnorderedList>
                </ListItem>
                <Text>
                  Darüber hinaus können wir dich auffordern, zusätzliche
                  Dokumente zur Verifizierung des Unternehmenseinzureichen.
                  Diese Dokumente, die personenbezogene Daten enthalten, können
                  Folgendes umfassen:
                </Text>
                <ListItem>Gesellschaftsvertrag</ListItem>
                <ListItem>Nachweis der Unternehmensgründung</ListItem>
                <ListItem>Steuer-ID-Bescheinigung.</ListItem>
              </VStack>
            </UnorderedList>
            <Text>
              Wir können außerdem Informationen über das Unternehmen
              verarbeiten, die in der Presse oder in sozialenMedien
              veröffentlicht werden und personenbezogene Daten über dich
              enthalten können.
            </Text>
            <Text>
              Die Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. c)
              DSGVO, da die Verarbeitung erforderlich ist, umgesetzlichen
              Verpflichtungen aus den Gesetzen zur Bekämpfung von Geldwäsche und
              Terrorismusfinanzierungnachzukommen. Zudem erfolgt die
              Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. b) DSGVO, sofern
              sienotwendig ist, um auf deinen Antrag hin Maßnahmen vor
              Vertragsschluss zu ergreifen oder den Vertrag zuerfüllen.
            </Text>
            <Text>
              N26 verarbeitet alle relevanten Transaktionen des Geschäftskontos,
              wenn du dieses als Geschäftsführer desUnternehmens nutzt. In
              diesem Zusammenhang erhält und übermittelt N26 Informationen gemäß
              den
            </Text>
            <Text>
              geltenden gesetzlichen und regulatorischen Bestimmungen und teilt
              relevante Informationen mit Zahlenden,Empfängern und anderen
              Finanzinstituten, die personenbezogene Daten über dich enthalten
              können. DieRechtsgrundlage für diese Verarbeitung ist Art. 6 Abs.
              1 lit. b) DSGVO, da sie für die Vertragserfüllungerforderlich ist.
            </Text>
            <StyledSubHeading>
              4. Datenverarbeitung im Rahmen von MoneyBeam
            </StyledSubHeading>

            <Text>
              Der Dienst MoneyBeam steht dir im Rahmen der Nutzung deines
              Girokontos zur Verfügung. Über MoneyBeamkannst du von deinem
              mobilen Endgerät aus Geld an deine Kontakte senden, welche N26
              Kunden sind, ohnederen Bankverbindung zu kennen. Um MoneyBeam
              bereitstellen zu können, müssen wir Daten von SenderInund
              EmpfängerIn sowie bestimmte Transaktionsdaten auf der Grundlage
              von Art. 6 (1) b) DSGVO verarbeiten.Die Transaktionsdaten
              entsprechen denen einer normalen Überweisung, mit dem Unterschied,
              dass keineIBAN, sondern nur eine E-Mail-Adresse oder Telefonnummer
              notwendig ist und keine Daten an Dritteweitergegeben werden. Um
              MoneyBeam nutzen zu können, müssen sich die Kunden als N26 kunden
              „sichtbar“machen und wo eine Telefonnummer oder eine Email-Adresse
              genutzt wird, den Zugriff auf ihre Kontaktlistedes Mobilgeräts
              erlauben. Um dies zu ermöglichen, greift N26 auf die Kontakte zu,
              die du auf deinem Endgerätgespeichert hast. N26 darf nur auf deine
              gespeicherten Kontakte zugreifen, wenn du zuvor darin
              eingewilligthast. Mehr dazu erfährst du unten in Abschnitt III.3.
            </Text>
            <StyledSubHeading>
              5. Sichtbarkeit als N26 Kunde bei Nutzung bestimmter Funktionen
              von N26
            </StyledSubHeading>
            <Text>
              Im Rahmen der Nutzung bestimmter N26 Funktionen wie MoneyBeam,
              MoneyBeam Anfragen, Shared Spaces,Split the Bill oder MoneyQR Code
              bitten wir dich im Einklang mit Art. 6 (1) a) DSGVO, uns die
              Einwilligung zuerteilen, dass du für andere N26 NutzerInnen als
              N26 Kunde sichtbar bist. Indem du N26 die Erlaubnis
              erteilst,deinen Status als N26 Kunde zu teilen, können wir diese
              Information anderen N26 Kunden, sofern du in ihrerKontaktliste auf
              ihrem Endgerät enthalten bist und im Rahmen der Nutzung der N26
              Features, anzeigen. Dubist in dem Fall für deine Kontakte
              sichtbar, sofern sie ebenfalls Kunden von N26 sind. Diese
              Einwilligungkannst du jederzeit in der App widerrufen. Öffne dazu
              Mein Konto {">"} Einstellungen {">"} Persönliche Einstellungen{" "}
              {">"}
            </Text>
            <Text>
              Persönliche Daten, und verwalte deine Sichtbarkeit, wie hier näher
              beschrieben.
            </Text>

            <StyledSubHeading>
              6. Datenverarbeitung im Rahmen der Nutzung von N26 Features mit
              deinerKontaktliste
            </StyledSubHeading>
            <Text>
              Um die Nutzung der N26 Features zusammen mit deiner Kontaktliste
              zu ermöglichen zu können, rufen wir dieKontaktliste deines
              Smartphones ab und laden die Kontakte in dein N26 Konto hoch. Dazu
              gehört auch dieregelmäßige Synchronisierung mit deinem Smartphone,
              um sicherzustellen, dass deine Kontaktdaten auf demneuesten Stand
              sind. Voraussetzung dafür ist deine Einwilligung nach Art. 6 (1)
              a) DSGVO. Diese kannst dujederzeit in den Einstellungen deines
              Smartphones widerrufen. Du kannst alle deine Kontakte in dein
              N26Konto sehen, einschließlich derer, die auch N26 Kunden sind und
              sich für uns "sichtbar" gemacht haben. Wirspeichern deine
              Kontakte, um sie dir in deinem N26 Konto anzuzeigen und
              kombinieren sie mit anderenKontaktinformationen, die du bei der
              Nutzung unserer Dienste angibst. Damit wird dir die Suche
              nachKontaktdaten im Zusammenhang mit einer Transaktion oder
              anderen Funktionen erleichtert. Um dir eineverbesserte
              Servicefunktionalität und ein besseres Kundenerlebnis bieten zu
              können, erfolgt dieDatenverarbeitung auf der Grundlage des
              berechtigten Interesses von N26 gemäß Art. 6 (1) f) DSGVO.
              NähereInformationen zum berechtigten Interesse als Rechtsgrundlage
              für die Datenverarbeitung findest du inAbschnitt II. oben.
            </Text>
            <StyledSubHeading>
              7. Datenverarbeitung im Rahmen von Shared Spaces
            </StyledSubHeading>
            <Text>
              Um Shared Spaces bereitstellen zu können, müssen wir gemäß Art. 6
              (1) b) DSGVO Daten zur Identifizierung derMitglieder eines Shared
              Spaces und bestimmte Transaktionsdaten im Zusammenhang mit der
              Nutzung dieserFunktion verarbeiten. Grundlage hierfür ist der
              Abschluss des Vertrags zwischen N26 und dir. Es werden keine
            </Text>
            <Text>
              Daten an Dritte übermittelt. Um Shared Spaces nutzen zu können,
              müssen sich die Mitglieder „sichtbar“gemacht und den Zugriff auf
              ihre Kontaktliste erlaubt haben. Weitere Informationen dazu
              findest du inAbschnitt III.3.
            </Text>
            <StyledSubHeading>
              8. Datenübermittlung im Rahmen des Versicherungsschutzes bei
              manchenN26-Mitgliedschaften
            </StyledSubHeading>
            <Text>
              Um deinen Versicherungsschutz im Zusammenhang mit deiner
              N26-Mitgliedschaft gemäß den von dir mit N26unterzeichneten
              Allgemeinen Geschäftsbedingungen zu ermöglichen. arbeiten wir mit
              der AWP P&C S.A.(Niederlassung für die Niederlande) zusammen, die
              unter den Marken Allianz Global Assistance Europe undAllianz
              Assistance firmiert und Teil der Allianz Gruppe sind (folgend
              “Allianz Assistance”). Allianz Assistanceagiert als
              Verantwortlicher hinsichtlich der Datenverarbeitung. Mehr
              Informationen dazu findest du in der
            </Text>

            <Text>
              Allianz Assistance Privacy Notice in der Rubrik “Rechtliche
              Dokumente”.
            </Text>
            <Text>N26 übermittelt deine Daten an Allianz Assistance:</Text>
            <UnorderedList>
              <ListItem>
                um den Versicherungsschutz sicherzustellen, sobald du dich für
                die entsprechende N26-Mitgliedschaftentschieden hast. Wir
                übermitteln deinen Vor- und Nachnamen, dein Geburtsdatum,
                deineE-Mail-Adresse, N26 Referenznummer und Meldeadresse an
                Allianz Assistance zur Erfüllung desjeweiligen Vertrags gemäß
                Art. 6 (1) b) DSGVO.
              </ListItem>
              <ListItem>
                um die Bearbeitung eines von dir bei Allianz Assistance
                gemeldeten Schadens zu ermöglichen. Indiesem Rahmen werden gemäß
                den Versicherungsbedingungen eventuell weitere Daten von N26
                anAllianz Assistance übermittelt. Dazu gehören uA abhängig von
                der Art des gemeldeten SchadensInformationen wie
                Transaktionsdaten. Diese werden auf der Grundlage des mit dir
                geschlossenenVertrages gem. Artikel 6 1 (b) sowie um unseren und
                den rechtlichen Verpflichtungen von AllianzAssistance gemäß
                Artikel 6 (1) c) DSGVO nachzukommen.
              </ListItem>
            </UnorderedList>
            <VStack alignItems="center">
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
            </VStack>
            <StyledSubHeading>
              10. Datenverarbeitung im Rahmen von Cash26
            </StyledSubHeading>

            <Text>
              Die Cash26-Funktion ermöglicht es dir, Bargeld bei teilnehmenden
              Filialen ausgewählter Handelspartner (z. B.Supermärkte) auf dein
              Girokonto einzuzahlen oder abzuheben. Dieser Service wird in
              Zusammenarbeit mitviafintech GmbH, Budapester Straße 50, 10787
              Berlin, Deutschland („viafintech“) und Grenke Bank AG, NeuerMarkt
              2, 76532 Baden-Baden, Deutschland („Grenke Bank“) bereitgestellt.
            </Text>
            <Text>
              Um deine Bargeldein- oder -auszahlung auf deinen Wunsch hin zu
              erleichtern, verarbeiten und teilen wir diefolgenden Daten mit
              viafintech und der Grenke Bank: deine Benutzer-ID,
              Transaktions-ID, Transaktionstyp(Einzahlung oder Auszahlung),
              Datum und Uhrzeit. Diese Datenverarbeitung ist erforderlich, um
              unserenVertrag mit dir zu erfüllen, gemäß Art. 6 Abs. 1 lit. b)
              DSGVO. In diesem Zusammenhang handelt die GrenkeBank als
              Zahlungsdienstleister und verarbeitet deine Daten als unabhängige
              Verantwortliche, um dieTransaktion zu oder von deinem Konto bei
              dem Handelspartner auszuführen. viafintech handelt im Auftrag
              derGrenke Bank und stellt die operative Infrastruktur bereit,
              indem sie den Barcode generiert und die Verbindungzu den
              Handelspartnern im viafintech-Netzwerk erleichtert. Weitere
              Informationen zu den
            </Text>
            <Text>
              Datenverarbeitungspraktiken der Grenke Bank findest du in deren
              Datenschutzhinweisen.
            </Text>
            <Text>
              Um dir in deiner N26-App verfügbare Cash26-Standorte in deiner
              Nähe anzuzeigen, verarbeiten wir dieGeolokalisierung deines
              mobilen Geräts sowie die Geräte-ID. Diese Verarbeitung erfolgt nur
              mit deinerEinwilligung gemäß Art. 6 Abs. 1 lit. a) DSGVO. Deine
              Geolokalisierungsdaten werden ausschließlich dazuverwendet,
              verfügbare Cash26-Standorte anzuzeigen, und nicht mit
              Cash26-Partnern geteilt. Wir verarbeitendiese Daten nur
              vorübergehend und nur für die Dauer der Nutzung der Funktion,
              jedes Mal, wenn du sieverwendest. Du kannst deine Einwilligung
              jederzeit über die Einstellungen deines mobilen Geräts widerrufen.
            </Text>
            <StyledSubHeading>
              11. Datenverarbeitung im Zusammenhang mit digitalen
              Zahlungsmethoden
            </StyledSubHeading>
            <Text>
              Wenn du mit deiner N26 Karte eine Zahlung über eine digitale
              Geldbörse (wie Apple Pay, Google Pay; oderSamsung Pay und Garmin
              Pay über Mastercard Wallet Express) oder einen
              Online-Zahlungsdienst (wieMastercard Click to Pay) tätigst, haben
              wir unseren Auftragsverarbeiter Mastercard Europe S.A., Chaussée
              deTervuren 198/A, 1410 Waterloo, Belgien („Mastercard“)
              eingebunden, der uns im Rahmen der Verarbeitung
              derTransaktionsdaten zwecks Zahlungsabwicklung als
              Auftragsverarbeiter unterstützt. So werden bei Mastercarddie
              Transaktionsdaten tokenisiert, bevor Mastercard diese in unserem
              Auftrag an den Anbieter der gewähltenZahlungsmethode als separaten
              Verantwortlichen übermittelt. Token werden verwendet, um
              Transaktionenbeim Zahlungsdienstanbieter zu autorisieren und
              durchzuführen, und diese Token gewährleisten dieVertraulichkeit
              deiner personenbezogenen Daten. Auf diese Weise werden deine
              Kartendetails weder mit demHändler geteilt noch auf deinem Gerät
              gespeichert.
            </Text>
            <Text>
              Die vorstehenden Datenverarbeitungsvorgänge (d.h. Bereitstellung
              der Transaktionsdaten sowie Tokenisierungund Übermittlung der
              tokenisierten Transaktionsdaten an den Anbieter der
              Zahlungsmethode) stützen wir aufden Vertrag zwischen uns und dir
              als Kunden der N26 gemäß Art. 6 (1) b) DSGVO.
            </Text>
            <VStack alignItems="center">
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
            </VStack>
            <StyledHeading>IV. Identifizierungsverfahren</StyledHeading>
            <StyledSubHeading>1. Video-Ident-Verfahren</StyledSubHeading>
            <Text>
              N26 ist gesetzlich verpflichtet, bei der Kontoeröffnung deine
              Identität anhand eines gültigenAusweisdokuments zu überprüfen und
              bestimmte Daten aus dem Ausweisdokument zu speichern. Zu
              diesemZweck bieten wir dir über unseren Dienstleister IDNow und
              Sumsub ein Video-Ident-Verfahren an. N26 alsAuftragsverarbeiter
              übermittelt personenbezogene Daten zum Zwecke der gesetzlich
              vorgeschriebenenÜberprüfung deiner Identität an ihre externen
              Dienstleister. Im Hinblick auf das von IDNow oder
              Sumsubdurchgeführte Video-Ident-Verfahren verweisen wir auf die
              Allgemeinen Geschäftsbedingungen von IDNowbzw. Sumsub, die wir dir
              im Rahmen des Identifizierungsverfahrens zur Annahme zur Verfügung
              stellen.Während des Video-Ident-Verfahrens, das mittels eines
              aufgezeichneten Videoanrufs erfolgt, muss unserAnbieter IDNow bzw.
              Sumsub die Echtheit des von dir vorgelegten Personalausweises oder
              Reisepassessicherstellen. Du wirst gebeten, dich gemäß den
              Anweisungen des IDNow- bzw. Sumsub-Vertreters direkt im
            </Text>
            <Text>
              Videoanruf zu identifizieren. Deine personenbezogenen Daten werden
              zum Nachweis deiner Berechtigung zurNutzung unserer Dienste gemäß
              unseren gesetzlichen Verpflichtungen und auf Grundlage von Art. 6
              (1) c)DSGVO erhoben. Um deine Identität anhand der im
              Identifizierungsverfahren aufgezeichneten Videos und
              desAusweisdokuments zu überprüfen, holen wir deine Einwilligung
              ein, sodass die Verarbeitung auf Art. 6 (1) a)DSGVO beruht. Nach
              Abschluss dieses Identifizierungsverfahrens werden deine
              personenbezogenen Daten solange aufbewahrt, wie es unsere
              gesetzlichen Verpflichtungen gemäß Art. 6 (1) c) DSGVO erfordern.
            </Text>

            <StyledSubHeading>2. Postident-Verfahren</StyledSubHeading>
            <Text>
              Das Postident-Verfahren wird in Ausnahmefällen von der Deutschen
              Post AG im Auftrag von N26 durchgeführt.Mit dem
              Postident-Verfahren kannst du die Identitätsprüfung in deiner
              örtlichen Postfiliale durchführen lassen.
            </Text>
            <Text>
              Wir senden dir eine E-Mail mit einem Coupon. Bitte bringe den
              ausgedruckten Coupon (mit individuellerReferenznummer zur internen
              Zuordnung der Ausweisdokumente) zusammen mit deinem
              Personalausweisoder Reisepass und deiner Meldebescheinigung zur
              nächsten Postfiliale.
            </Text>
            <VStack>
              <Text>
                Der Postmitarbeiter überträgt dann die Daten aus deinen
                Ausweisdokumenten in den Coupon. Anschließendmusst du diese
                Daten überprüfen und den Coupon unterschreiben. Diese
                Unterschrift wird von demPostmitarbeiter mit Unterschrift und
                Stempel bestätigt und an N26 übermittelt. Deine
                personenbezogenenDaten werden zum Nachweis deiner Berechtigung
                zur Nutzung unserer Dienste gemäß unseren
                gesetzlichenVerpflichtungen und auf Grundlage von Art. 6 (1) c)
                DSGVO erhoben. Nach Abschluss diesesIdentifizierungsverfahrens
                werden deine personenbezogenen Daten so lange aufbewahrt, wie es
                unseregesetzlichen Verpflichtungen gemäß Art. 6 (1) c) DSGVO
                erfordern.
              </Text>
            </VStack>

            <StyledSubHeading>3. Auto-ident Verfahren</StyledSubHeading>

            <Text>
              N26 muss im Rahmen der Kopplung deines Geräts zu deinem Konto ggf.
              deine Identität anhand eines gültigenAusweisdokuments überprüfen
              und bestimmte Daten aus dem Ausweisdokument speichern. Hierzu
              bieten wirdir über IDNow ein Auto-ident Verfahren an, als
              Auftragsverarbeiter, zum Zwecke der Überprüfung deinerIdentität.
              Für das von IDNow durchgeführte Identifizierungsverfahren,
              übermitteln wir deinepersonenbezogene Daten an diesen
              Dienstleister und verweisen auf die Allgemeinen
              Geschäftsbedingungenvon IDNow, die wir dir im Rahmen dieses
              Identifizierungsverfahrens zur Annahme zur Verfügung stellen.
              IDNowgreift nach deiner entsprechenden Genehmigung, die direkt auf
              deinem Gerät erfolgt, auf die Kamera deinesEndgeräts zu.
              Anschließend nimmt du selbst ein Foto von dir auf sowie ein Video,
              in dem du dich, wie auch dieVorder- und Rückseite deines
              Personalausweises oder die Hauptseite deines Reisepasses, bewegen
              sollst.
            </Text>
            <Text>
              Deine personenbezogenen Daten werden aus Sicherheitsgründen und
              aufgrund unseres berechtigtenInteresses in der Erfüllung unserer
              gesetzlichen Verpflichtungen, gemäß Art. 6 (1) f) DSGVO erhoben.
              Um deineIdentität anhand der im Identifizierungsverfahren
              aufgezeichneten Fotos und Videos sowie desAusweisdokuments zu
              überprüfen, holen wir deine Einwilligung ein, sodass die
              Verarbeitung auf Art. 6 (1) a)DSGVO gestützt ist. Bitte beachte,
              dass wir als digitale Bank, die mit ihren KundInnen ausschließlich
              virtuellkommuniziert, nur eine Fernprüfung deiner Identität
              anbieten können und daher deine Einwilligung benötigen,um damit
              fortzufahren. Nach Abschluss dieses Identifizierungsverfahrens
              werden deine personenbezogenenDaten so lange aufbewahrt, wie es
              unsere gesetzlichen Verpflichtungen gemäß Art. 6 (1) c) DSGVO
              erfordern.
            </Text>
            <VStack alignItems="center">
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
            </VStack>
            <StyledSubHeading>
              5. Verfahren zur Bankkonto-Verifizierung
            </StyledSubHeading>
            <Text>
              Als Alternative zu den oben beschriebenen
              Identifizierungsverfahren bieten wir dir das Verfahren
              zurBankkonto-Verifizierung („Bank Account Verification“ – „BAV“)
              an, das teilweise über unseren DienstleisterFourthline
              durchgeführt wird.
            </Text>
            <Text>Das BAV-Verfahren umfasst drei Schritte:</Text>
            <StyledSubHeading>1. Photo-KYC</StyledSubHeading>
            <Text>
              N26 übermittelt personenbezogene Daten an den externen
              Dienstleister Fourthline, alsAuftragsverarbeiter, zum Zweck der
              gesetzlich erforderlichen Identitätsprüfung. Fourthline greift
              –nachdem du hierzu direkt auf deinem Gerät deine Zustimmung
              erteilt hast – auf die Kamera deinesGeräts zu. Du wirst gebeten,
              ein Foto von dir aufzunehmen, ein kurzes Video zu erstellen, in
              dem dudich bewegst, sowie Bilder der Vorder- und Rückseite deines
              Ausweisdokuments anzufertigen. Indiesem Schritt muss Fourthline
              die Echtheit des vorgelegten Ausweisdokuments sicherstellen. du
              wirstwährend des gesamten Vorgangs direkt im
              Identifizierungsablauf angeleitet.
            </Text>
            <StyledSubHeading>
              2. Qualifizierte Elektronische Signatur („QES“)
            </StyledSubHeading>
            <Text>
              Anschließend wirst du gebeten, einen Vertrag mit einem
              Einmal-Passwort zu unterschreiben, das andeine registrierte
              Telefonnummer gesendet wird, gemäß den von Fourthline
              bereitgestelltenAnweisungen. Für die von Fourthline durchgeführten
              Schritte Photo-KYC und QES verweisen wir auf dieAllgemeinen
              Geschäftsbedingungen von Fourthline, die wir dir während des
              Identifizierungsprozesseszur Zustimmung bereitstellen.
            </Text>
            <StyledSubHeading>3. Bankkonto-Verifizierung</StyledSubHeading>
            <Text>
              Nachdem du die oben genannten Schritte abgeschlossen hast, wirst
              du aufgefordert, eineÜberweisung von einem anderen, auf deinen
              Namen geführten Bankkonto bei einem anderenFinanzinstitut auf ein
              operatives Bankkonto von N26 auszuführen. Dieser Schritt
              ermöglicht es uns, zuüberprüfen, ob die bei der Registrierung
              angegebenen Daten mit den Angaben deines anderen,
              bereitsverifizierten Bankkontos übereinstimmen.
            </Text>
            <Text>
              Deine personenbezogenen Daten werden zum Nachweis deiner
              Berechtigung zur Nutzung unserer Dienste aufGrundlage unserer
              gesetzlichen Verpflichtungen gemäß Art. 6 Abs. 1 lit. c DSGVO
              erhoben. Zur Überprüfungdeiner Identität anhand der im
              Identifizierungsverfahren erfassten Fotos und Videos sowie
              desAusweisdokuments holen wir deine Einwilligung ein; die
              Verarbeitung erfolgt daher auf Grundlage von Art. 6Abs. 1 lit. a
              DSGVO. Nach Abschluss dieses Identifizierungsverfahrens werden
              deine personenbezogenen Daten
            </Text>
            <Text>
              so lange gespeichert, wie es unsere gesetzlichen Verpflichtungen
              erfordern, auf Grundlage von Art. 6 Abs. 1 lit. cDSGVO.
            </Text>
            <StyledHeading>
              V. Bonitätsüberprüfung und Datenübermittlung an die SCHUFA
            </StyledHeading>
            <Text>
              N26 übermittelt personenbezogene Daten - die im Rahmen dieses
              Vertragsverhältnisses erhoben werden -über die Beantragung,
              Abwicklung und Beendigung dieser Geschäftsbeziehung sowie
              Informationen imHinblick auf vertragswidriges oder arglistiges
              Verhalten an die SCHUFA Holding AG, Kormoranweg 5, 65201Wiesbaden.
            </Text>
            <Text>
              Die Zulässigkeit dieser Datenübermittlung basiert auf Art. 6 Abs.
              1 lit. b) und Art. 6 Abs. 1 lit. f) DSGVO. EineDatenübermittlung
              auf der Grundlage von Art. 6 Abs. 1 lit. f) DSGVO ist nur
              zulässig, wenn dies zur Wahrung derberechtigten Interessen der
              Bank oder Dritter erforderlich ist und die Interessen oder
              Grundrechte undGrundfreiheiten der betroffenen Person, die den
              Schutz personenbezogener Daten erfordern, nichtüberwiegen. Ein
              Datenaustausch mit der SCHUFA erfolgt auch zur Erfüllung
              rechtlicher Verpflichtungen bei derDurchführung von
              Kundenbonitätsprüfungen (§ 505a BGB; § 18a KWG).
            </Text>
            <Text>
              In diesem Zusammenhang entbindet der Kunde auch N26 vom
              Bankgeheimnis.
            </Text>
            <Text>
              Die SCHUFA verarbeitet die ihr überlassenen Daten und nutzt diese
              auch zum Zwecke des Profilings (Scoring),um ihren Vertragspartnern
              im Europäischen Wirtschaftsraum, in der Schweiz und in anderen
              Drittländern(sofern die Europäische Kommission diese Länder für
              geeignet erklärt hat oder Standardvertragsklauselnvereinbart
              wurden, die unter{" "}
              <StyledLink href="https://schufa.de">www.schufa.de</StyledLink>{" "}
              eingesehen werden können) Informationen zur
              Bonitätsprüfungnatürlicher Personen und zu anderen Zwecken zu
              übermitteln. Ausführlichere Informationen über dieAktivitäten der
              SCHUFA findest Du in der SCHUFA-Information gemäß Art. 14 DSGVO,
              sowie online unter
            </Text>
            <StyledLink href="https://schufa.de/datenschutz">
              www.schufa.de/datenschutz.
            </StyledLink>
            <VStack alignItems="center">
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
              <Text as="h3" fontSize="l" fontWeight="bold">
                {" "}
                .
              </Text>
            </VStack>
            <StyledHeading>XIII. Lösch- und Aufbewahrungsfristen</StyledHeading>
            <Text>
              Grundsätzlich verarbeiten und speichern wir deine
              personenbezogenen Daten nur, solange es für die Erfüllungunserer
              vertraglichen und gesetzlichen Pflichten erforderlich ist. Das
              heißt, sind die Daten für die Erfüllungvertraglicher oder
              gesetzlicher Pflichten nicht mehr erforderlich, werden diese
              gelöscht. Das trifft auch dann zu,wenn dein Onboarding-Prozess für
              die Kontoeröffnung noch nicht abgeschlossen ist und die Bank
              unterdessendeine Daten aufgrund anstehender gesetzlicher oder
              sicherheitsrelevanter Verpflichtungen aufbewahren muss.Diese
              Vorschrift kommt jedoch nicht zur Anwendung, wenn die
              eingeschränkte Verarbeitung für die folgendenZwecke notwendig ist:
            </Text>
            <UnorderedList>
              <ListItem>
                Einhaltung handels- und steuerrechtlicher Aufbewahrungsfristen,
                die sich aus folgenden Gesetzen undergänzenden Vorschriften
                ergeben: Handelsgesetzbuch, Abgabenordnung,
                Kreditwesengesetz,Geldwäschegesetz und Wertpapierhandelsgesetz.
                Die dort vorgegebenen Fristen zur Aufbewahrungbzw. Dokumentation
                betragen zwei bis zehn Jahre. Die jeweilige Rechtsgrundlage ist
                Art. 17 (3) b)DSGVO in Verbindung mit Art. 6 (1) c) DSGVO.
              </ListItem>
              <ListItem>
                Erhaltung von Beweismitteln im Rahmen der
                Verjährungsvorschriften. Nach den Vorschriften imBürgerlichen
                Gesetzbuch (BGB) können diese Verjährungsfristen bis zu 30 Jahre
                betragen, wobei dieregelmäßige Verjährungsfrist drei Jahre
                beträgt. Die jeweilige Rechtsgrundlage hierfür ist Art. 17 (3)
                e)DSGVO in Verbindung mit Art. 6 (1) f) DSGVO.
              </ListItem>
            </UnorderedList>
            <Text>
              Ferner gilt, wenn deine Einwilligung die Rechtsgrundlage zur
              Verarbeitung deiner personenbezogenen Datenist, speichert N26
              diese Daten so lange, wie du deine Einwilligung nicht widerrufst
              bzw. bis dein Kontogeschlossen wird, je nachdem, welches Ereignis
              später eintritt.
            </Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default DemoPrivacyPolicyModal;
