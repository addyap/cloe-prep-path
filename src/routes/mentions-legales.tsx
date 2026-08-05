import { createFileRoute } from "@tanstack/react-router";
import { PublicPageShell } from "@/components/public-page-shell";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — CLOE Prep" },
      {
        name: "description",
        content:
          "Mentions légales de CLOE Prep : éditeur, hébergeur, propriété intellectuelle et conditions d'utilisation conformément à la loi française.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/mentions-legales" },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/mentions-legales" }],
  }),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  return (
    <PublicPageShell>
      <div lang="fr">
      <h1 className="text-3xl md:text-4xl font-bold text-primary">Mentions légales</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour&nbsp;: 5 août 2026</p>

      <div className="mt-8 space-y-8 text-sm md:text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Éditeur du site</h2>
          <p className="mt-2">
            Le site <strong>cloe.antonyaddy.com</strong> est édité par&nbsp;:
          </p>
          <ul className="mt-2 list-none space-y-1">
            <li>
              <strong>Nom&nbsp;:</strong> Antony Addy
            </li>
            <li>
              <strong>Statut&nbsp;:</strong> Auto-entrepreneur — Formateur Professionnel d'Adultes
            </li>
            <li>
              <strong>SIRET&nbsp;:</strong> 48317889300028
            </li>
            <li>
              <strong>Adresse&nbsp;:</strong> 135 rue Henri Vadon, Résidence des Arènes, 83600 Fréjus,
              France
            </li>
            <li>
              <strong>Contact&nbsp;:</strong> formations@antonyaddy.com
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Directeur de la publication</h2>
          <p className="mt-2">Antony Addy.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Hébergeur</h2>
          <p className="mt-2">
            Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA
            91789, États-Unis.
          </p>
          <p className="mt-2">
            Site web&nbsp;: <span className="underline">vercel.com</span>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Propriété intellectuelle</h2>
          <p className="mt-2">
            L'ensemble du contenu de ce site (textes, exercices, design, code source, marque « CLOE
            Prep ») est la propriété exclusive d'Antony Addy, sauf mention contraire. Toute
            reproduction, distribution ou utilisation commerciale sans autorisation écrite préalable
            est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Données personnelles</h2>
          <p className="mt-2">
            Les informations relatives à la collecte et au traitement des données personnelles sont
            détaillées dans notre{" "}
            <a href="/privacy" className="underline">
              Politique de confidentialité
            </a>
            . Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
            Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de
            suppression et d'opposition sur vos données personnelles. Pour exercer ces droits,
            contactez formations@antonyaddy.com.
          </p>
          <p className="mt-2">
            Autorité de contrôle&nbsp;: CNIL —{" "}
            <span className="underline">www.cnil.fr</span>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Avertissement</h2>
          <p className="mt-2">
            CLOE Prep est un outil d'entraînement indépendant. Il n'est ni affilié à, ni approuvé
            par, ni lié à la certification CLOE officielle ou aux organismes qui la délivrent. Tous
            les contenus d'entraînement sont originaux.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Droit applicable</h2>
          <p className="mt-2">
            Les présentes mentions légales sont régies par le droit français. Tout litige relatif à
            l'utilisation du site sera soumis aux tribunaux compétents de Draguignan, France.
          </p>
        </section>
      </div>
      </div>
    </PublicPageShell>
  );
}
