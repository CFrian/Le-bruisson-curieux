const { Article, Auteur, Categorie, Tag, Chapitre, Paragraphe, FicheInfo, Media } = require('../src/models/sequelize');

async function testArticle() {
  try {
    const article = await Article.findOne({
      include: [
        Auteur,
        Categorie,
        Tag,
        { model: Chapitre, include: [Paragraphe, { model: Media, as: 'mediasChapitre' }] },
        FicheInfo,
        { model: Media, as: 'mediasArticle' },
      ],
    });

    if (!article) {
      console.log('Aucun article trouvé — vérifie que la ligne existe bien en base.');
      return;
    }

    console.log('Article récupéré :');
    console.log('Titre:', article.titreArticle);
    console.log('Auteur:', article.Auteur?.pseudo);
    console.log('Catégorie:', article.Categorie?.nomCategorie);
    console.log('Tags:', article.Tags?.map(t => t.nomTag));
    article.Chapitres?.forEach(chap => {
      console.log(`  - ${chap.titreChap} (ordre ${chap.ordreChap})`);
      chap.Paragraphes?.forEach(p => {
        console.log(`      · ${p.contenuParagraphe.slice(0, 50)}...`);
      });
    });

    console.log('Fiche info  :');
    article.FicheInfos?.forEach(f => console.log(`  - ${f.cleFicheInfo} : ${f.valeurFicheInfo}`));

    console.log('Médias (niveau article) :', article.mediasArticle?.map(m => `${m.typeMedia} (${m.urlMedia})`));
    console.log('Médias par chapitre :');
    article.Chapitres?.forEach(chap => {
      console.log(`  - ${chap.titreChap} :`, chap.mediasChapitre?.map(m => `${m.typeMedia}${m.timecodeSecondesMedia ? ' @' + m.timecodeSecondesMedia + 's' : ''}`));
    });

  } catch (err) {
    console.error('Erreur test Sequelize :', err.message);
  } finally {
    process.exit();
  }
}

testArticle();