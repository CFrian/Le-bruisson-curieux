import ProfileCard from "../../components/ProfileCard"
import SectionTitle from "../../components/SectionTitle"
import PanelBorderLR from "../../components/PanelBorderLR"
import Card from "../../components/Card"
import Btn from "../../components/Btn"
import PrestationsAccordion from "../../components/PrestationsAccordion"
import imgProfil from "../../assets/images/COSTES_FLORIAN.jpg"
import { prestations } from "../../data/prestations"

export default function PrestationsPage() {
    return (
        <div className="flex flex-col items-center p-6 gap-12 pt-15">

            <ProfileCard image={imgProfil} />

            <PanelBorderLR>
                <p> Pendant plus de dix ans, j'ai accompagné des entreprises, studios et organismes de formation dans leurs projets audio, de la post-production au sound design, en passant par la création d'expériences immersives et la transmission de savoir-faire.
                </p>
                <br />
                <p> Aujourd'hui, j'associe cette expertise au développement full-stack pour concevoir des solutions numériques utiles, performantes et centrées sur l'utilisateur.
                </p>
                <br />
                <p> Qu'il s'agisse de créer une identité sonore, de développer une application métier ou d'imaginer une expérience interactive, j'aborde chaque projet avec la même exigence : comprendre le besoin, concevoir une solution pertinente et transformer une idée en une réalisation concrète.</p>
            </PanelBorderLR>

            <SectionTitle title="Je vous accompagne sur vos projets de :" />

            <PrestationsAccordion prestations={prestations} />
            <Btn contenu="Projets 🠖" path="/projets" />
        </div>
    )
}