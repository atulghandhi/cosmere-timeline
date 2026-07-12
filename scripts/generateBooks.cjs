const fs = require('fs');

const booksRaw = `Year	Book	Series	Length
2005	Elantris	Elantris #1	Novel
2006	The Hope of Elantris	Elantris #1.5	Short Story
2006	Mistborn: The Final Empire	Mistborn (Era 1) #1	Novel
2007	The Well of Ascension	Mistborn (Era 1) #2	Novel
2007	Alcatraz Versus the Evil Librarians	Alcatraz Versus the Evil Librarians #1	Novel
2008	The Hero of Ages	Mistborn (Era 1) #3	Novel
2008	Alcatraz Versus the Scrivener's Bones [fn 1]	Alcatraz Versus the Evil Librarians #2	Novel
2008	Defending Elysium		Novelette
2008	Firstborn		Novelette
2009	Warbreaker		Novel
2009	Alcatraz Versus the Knights of Crystallia [fn 1]	Alcatraz Versus the Evil Librarians #3	Novel
2009	The Gathering Storm	The Wheel of Time #12	Novel
2010	The Way of Kings	The Stormlight Archive #1	Novel
2010	Towers of Midnight	The Wheel of Time #13	Novel
2010	Alcatraz Versus the Shattered Lens [fn 1]	Alcatraz Versus the Evil Librarians #4	Novel
2011	I Hate Dragons		Excerpt
2011	Infinity Blade: Awakening	Infinity Blade #1.5	Novella
2011	The Alloy of Law	Mistborn (Era 2) #1	Novel
2011	The Eleventh Metal	Mistborn (Era 1) #0.5	Short Story
2012	Heuristic Algorithm and Reasoning Response Engine		Short Story
2012	Legion	Legion #1	Novella
2012	The Emperor's Soul		Novella
2013	A Memory of Light	The Wheel of Time #14	Novel
2013	The Rithmatist	Rithmatist #1	Novel
2013	River of Souls	The Wheel of Time #14.5	Excerpt
2013	Infinity Blade: Redemption	Infinity Blade #2.5	Novella
2013	Steelheart	The Reckoners #1	Novel
2013	Mitosis	The Reckoners #1.5	Novelette
2013	Shadows for Silence in the Forests of Hell		Novella
2014	Words of Radiance	The Stormlight Archive #2	Novel
2014	Dreamer		Short Story
2014	Sixth of the Dusk		Novella
2014	Allomancer Jak and the Pits of Eltania	Mistborn (Era 2)	Short Story
2014	The Way of Kings Prime	Sanderson Curiosities	Excerpt
2014	Legion: Skin Deep	Legion #2	Novella
2015	Firefight	The Reckoners #2	Novel
2015	Perfect State		Novella
2015	Shadows of Self	Mistborn (Era 2) #2	Novel
2015	Elantris 10th Anniversary Edition		Novel
2016	The Bands of Mourning	Mistborn (Era 2) #3	Novel
2016	Mistborn: Secret History	Mistborn	Novella
2016	Calamity	The Reckoners #3	Novel
2016	White Sand Volume 1	White Sand #1	Graphic Novel
2016	The Dark Talent	Alcatraz Versus the Evil Librarians #5	Novel
2016	Arcanum Unbounded	The Cosmere Collection #1	Anthology
2016	Edgedancer	The Stormlight Archive #2.5	Novella
2017	Snapshot		Novella
2017	Oathbringer	The Stormlight Archive #3	Novel
2018	White Sand Volume 2	White Sand #2	Graphic Novel
2018	Legion: Lies of the Beholder	Legion #3	Novella
2018	Legion: The Many Lives of Stephen Leeds	Legion	Anthology
2018	Skyward	Skyward #1	Novel
2018	Children of the Nameless		Novella
2019	A Fire Within the Ways	The Wheel of Time #14.5	Excerpt
2019	White Sand Volume 3	White Sand #3	Graphic Novel
2019	Starsight	Skyward #2	Novel
2020	Dark One Book 1	Dark One #1	Graphic Novel
2020	The Way of Kings Prime	Sanderson Curiosities	Novel
2020	The Original		Audio Novella
2020	Dawnshard	The Stormlight Archive #3.5	Novella
2020	Rhythm of War	The Stormlight Archive #4	Novel
2021	Lux	The Reckoners	Audio Novel
2021	Sunreach	Skyward #2.1	Novella
2021	ReDawn	Skyward #2.2	Novella
2021	Cytonic	Skyward #3	Novel
2021	Evershore	Skyward #3.1	Novella
2022	Skyward Flight	Skyward	Anthology
2022	Stephen Leeds: Death & Faxes	Legion	Audio Novel
2022	Bastille Versus the Evil Librarians	Alcatraz Versus the Evil Librarians #6	Novel
2022	The Lost Metal	Mistborn (Era 2) #4	Novel
2022	White Sand Omnibus	White Sand	Graphic Novel
2023	Tress of the Emerald Sea		Novel
2023	Dark One: Forgotten	Dark One Prequel	Audio Novella
2023	The Frugal Wizard's Handbook for Surviving Medieval England		Novel
2023	Yumi and the Nightmare Painter		Novel
2023	The Sunlit Man		Novel
2023	Defiant	Skyward #4	Novel
2023	Hyperthief	Skyward #3.2	Short Story
2023	Long Chills & Case Dough	Sanderson Curiosities	Novelette
2024	Dragonsteel Prime	Sanderson Curiosities	Novel
2024	The Most Boring Book Ever		Picture Book
2024	Wind and Truth	The Stormlight Archive #5	Novel
2025	Isles of the Emberdark		Novel
2025	Tailored Realities		Anthology
2025	Elsecaller	The Stormlight Archive	Short Story
2025	King Lopen the First of Alethkar	The Stormlight Archive	Short Story
2025	The ChasmFriends Get A Pet!	The Stormlight Archive	Short Story
2026	The Fires of December	Hoid's Travails	Novel
2026	The Girl Who Looked Up	Hoid's Storybook Collection	Picture Book
2026	Wandersail	Hoid's Storybook Collection	Picture Book
2026	The Dog and the Dragon	Hoid's Storybook Collection	Picture Book`;

const isCosmere = (series, title) => {
  if (['Tress of the Emerald Sea', 'Yumi and the Nightmare Painter', 'The Sunlit Man', 'Isles of the Emberdark'].includes(title)) return true;
  if (/Mistborn|Stormlight|Elantris|Warbreaker|Cosmere|White Sand|Arcanum|Dawnshard|Edgedancer|Eleventh Metal|Alloy of Law|Secret History|Hoid/.test(series) || /Mistborn|Stormlight|Elantris|Warbreaker|Cosmere|White Sand|Arcanum|Dawnshard|Edgedancer|Emperor's Soul|Sixth of the Dusk|Shadows for Silence|Hoid/.test(title)) {
    return true;
  }
  return false;
};

// Build the array
const lines = booksRaw.split('\n').filter(l => l.trim() && !l.startsWith('Year'));
const generatedBooks = [];

lines.forEach((line) => {
  let [yearStr, title, seriesStr, length] = line.split('\t');
  if (!length) length = "Novel";
  title = title.replace(/ \[fn \d+\]/, '').trim();
  
  let series = "Standalone";
  let seriesNumber = undefined;
  let subSeries = undefined;
  
  if (seriesStr && seriesStr.trim()) {
    const sMatch = seriesStr.match(/^(.*?)(?: \(Era (\d+)\))?(?: #([\d\.a-zA-Z]+))?$/);
    if (sMatch) {
      series = sMatch[1].trim();
      if (sMatch[2]) subSeries = "Era " + sMatch[2];
      if (sMatch[3]) seriesNumber = parseFloat(sMatch[3]);
    } else {
        series = seriesStr.trim();
    }
  }

  let cid = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (cid === 'mistborn-the-final-empire') cid = 'mistborn-1';
  if (cid === 'the-well-of-ascension') cid = 'mistborn-2';
  if (cid === 'the-hero-of-ages') cid = 'mistborn-3';
  
  const cosmere = isCosmere(series, title);
  
  const book = {
    id: cid,
    title: title,
    author: "Brandon Sanderson",
    series: series,
    year: parseInt(yearStr),
    description: "",
    isReleased: parseInt(yearStr) <= 2024, 
    cosmere: cosmere,
    lengthType: length,
    links: {}
  };
  if (seriesNumber !== undefined) book.seriesNumber = seriesNumber;
  if (subSeries !== undefined) book.subSeries = subSeries;
  
  generatedBooks.push(book);
});

const existingData = fs.readFileSync('src/data/books.ts', 'utf8');

function getProp(id, propName) {
  const re = new RegExp("id:\\s*['\"]" + id + "['\"][\\\\s\\\\S]*?" + propName + ":\\s*({[\\\\s\\\\S]*?}|['\"].*?['\"]|\\d+(?:\\.\\d+)?)", "i");
  const match = existingData.match(re);
  return match ? match[1] : null;
}

generatedBooks.forEach((b) => {
  let altId = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let desc = getProp(b.id, 'description') || getProp(altId, 'description');
  let links = getProp(b.id, 'links') || getProp(altId, 'links');
  let gr = getProp(b.id, 'goodreadsRating') || getProp(altId, 'goodreadsRating');
  
  if (desc) b.description = eval(desc);
  if (links) b.links = eval("(" + links + ")");
  if (gr) b.goodreadsRating = eval(gr);
});

const finalBooksTs = "import { Book } from '../types';\n\nexport const books: Book[] = " + JSON.stringify(generatedBooks, null, 2) + ";\n";

fs.writeFileSync('src/data/books.ts', finalBooksTs.replace(/"([^"]+)":/g, '$1:'));
console.log('Books generated successfully.');
