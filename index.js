require('dotenv').config();

const express = require('express');
const app = express();

// custom tools
const logger = require('./logger');

app.set('view engine', 'ejs');
app.set('views', './views');

const examplePosts = [
	{
		image:
			'https://fastly.picsum.photos/id/626/500/500.jpg?hmac=UYq_6qxICS9STF8pBDvvyE6nKtRoM5okPhlxQC3g9dY',
		description:
			'Učebnice matematiky pro 2. ročník, jako nová, použitá jen jeden semestr. Původní cena 450 Kč, nyní 200 Kč. Tato učebnice obsahuje všechny důležité kapitoly a cvičení, které pomohou vašemu dítěti lépe pochopit matematické koncepty. Ideální pro domácí studium nebo jako doplněk k výuce ve škole.',
		url: 'https://instagram.com/p/example1',
	},
	{
		image:
			'https://fastly.picsum.photos/id/980/500/500.jpg?hmac=xxuslS3B6e6w4Bi3zur1mfICYM9HBN9Q1FvzYvG8mZ0',
		description:
			'Kvalitní školní batoh značky Nike, černý, málo používaný. Mnoho kapes, ergonomická záda. Cena 400 Kč. Tento batoh je ideální pro každodenní použití, ať už do školy nebo na volný čas. Je dostatečně prostorný pro všechny školní potřeby a navíc vypadá stylově.',
		url: 'https://instagram.com/p/example2',
	},
	{
		image:
			'https://fastly.picsum.photos/id/845/500/500.jpg?hmac=i2mDN6gy8If3A27jEAytytrluYLBrExoSNiFeXHaMIY',
		description:
			'Vědecká kalkulačka Texas Instruments TI-84 Plus, plně funkční, s původním obalem. Cena dohodou. Tato kalkulačka je skvělým pomocníkem pro studenty středních škol a vysokých škol, ideální pro řešení složitých matematických a vědeckých problémů.',
		url: 'https://instagram.com/p/example3',
	},
	{
		image:
			'https://fastly.picsum.photos/id/802/500/500.jpg?hmac=kf0imTLQW_VKLpMY-xvunI8aKnM_Kph9knma-8rl_GM',
		description:
			'Sbírka úloh z fyziky pro střední školy, bez poznámek, perfektní stav. Původní cena 300 Kč, prodám za 150 Kč. Tato sbírka obsahuje různé úlohy, které pomohou studentům lépe pochopit fyzikální principy a připravit se na zkoušky.',
		url: 'https://instagram.com/p/example4',
	},
	{
		image:
			'https://fastly.picsum.photos/id/556/500/500.jpg?hmac=QCr9844f3jicoToG31pqMK529sQp6hadIFgyaH-ixeo',
		description:
			'Set výtvarných potřeb - štětce, akrylové barvy, skicák. Vše nepoužité, původní balení. Cena 600 Kč za vše. Tento set je ideální pro všechny kreativní duše, které chtějí vyjádřit svou uměleckou stránku. Perfektní pro malování, kreslení a další výtvarné projekty.',
		url: 'https://instagram.com/p/example5',
	},
	{
		image:
			'https://fastly.picsum.photos/id/609/500/500.jpg?hmac=1D44Cp4TKgF6Vq9k95XkIomPTIjHI7GBtN0iDegyrAU',
		description:
			'Nová učebnice angličtiny pro 3. ročník, ideální pro začátečníky. Cena 250 Kč. Tato učebnice je navržena tak, aby pomohla dětem rozvíjet jejich jazykové dovednosti zábavným a interaktivním způsobem, s mnoha cvičeními a aktivitami.',
		url: 'https://instagram.com/p/example6',
	},
	{
		image:
			'https://fastly.picsum.photos/id/556/500/500.jpg?hmac=QCr9844f3jicoToG31pqMK529sQp6hadIFgyaH-ixeo',
		description:
			'Stylový školní penál s motivem, málo používaný. Cena 150 Kč. Tento penál je nejen praktický, ale také trendy, ideální pro uložení všech psacích potřeb a drobností, které potřebujete mít po ruce.',
		url: 'https://instagram.com/p/example7',
	},
	{
		image:
			'https://fastly.picsum.photos/id/302/500/500.jpg?hmac=iY1DubFuGYjQDtDtZ2-xdiTg5dV5FRG_oEmqf02-Vbo',
		description:
			'Sada barevných fixů a pastelů, nepoužité. Cena 200 Kč. Tato sada je perfektní pro všechny, kteří rádi tvoří a malují. Obsahuje širokou škálu barev, které oživí každé umělecké dílo.',
		url: 'https://instagram.com/p/example8',
	},
	{
		image:
			'https://fastly.picsum.photos/id/457/500/500.jpg?hmac=o--a2yguwnZDQBWc-c9IZ-axyXD-vRpsxrOYLyCqbvY',
		description:
			'Kniha o přírodě pro děti, jako nová. Cena 300 Kč. Tato kniha je skvělým způsobem, jak děti seznámit s fascinujícím světem přírody a zvířat, plná krásných ilustrací a zajímavých informací.',
		url: 'https://instagram.com/p/example9',
	},
	{
		image:
			'https://fastly.picsum.photos/id/100/500/500.jpg?hmac=BOkw6qJR5MG-PbDD0YehqftfKnxDnJ5EymZ9CxnwbBo',
		description:
			'Zápisník s motivem, ideální pro školní poznámky. Cena 100 Kč. Tento zápisník je perfektní pro zapisování myšlenek, úkolů a poznámek, ať už ve škole nebo doma. Je dostatečně prostorný a stylový.',
		url: 'https://instagram.com/p/example10',
	},
	{
		image:
			'https://fastly.picsum.photos/id/626/500/500.jpg?hmac=UYq_6qxICS9STF8pBDvvyE6nKtRoM5okPhlxQC3g9dY',
		description:
			'Učebnice matematiky pro 2. ročník, jako nová, použitá jen jeden semestr. Původní cena 450 Kč, nyní 200 Kč. Tato učebnice obsahuje všechny důležité kapitoly a cvičení, které pomohou vašemu dítěti lépe pochopit matematické koncepty. Ideální pro domácí studium nebo jako doplněk k výuce ve škole.',
		url: 'https://instagram.com/p/example1',
	},
	{
		image:
			'https://fastly.picsum.photos/id/980/500/500.jpg?hmac=xxuslS3B6e6w4Bi3zur1mfICYM9HBN9Q1FvzYvG8mZ0',
		description:
			'Kvalitní školní batoh značky Nike, černý, málo používaný. Mnoho kapes, ergonomická záda. Cena 400 Kč. Tento batoh je ideální pro každodenní použití, ať už do školy nebo na volný čas. Je dostatečně prostorný pro všechny školní potřeby a navíc vypadá stylově.',
		url: 'https://instagram.com/p/example2',
	},
	{
		image:
			'https://fastly.picsum.photos/id/845/500/500.jpg?hmac=i2mDN6gy8If3A27jEAytytrluYLBrExoSNiFeXHaMIY',
		description:
			'Vědecká kalkulačka Texas Instruments TI-84 Plus, plně funkční, s původním obalem. Cena dohodou. Tato kalkulačka je skvělým pomocníkem pro studenty středních škol a vysokých škol, ideální pro řešení složitých matematických a vědeckých problémů.',
		url: 'https://instagram.com/p/example3',
	},
	{
		image:
			'https://fastly.picsum.photos/id/802/500/500.jpg?hmac=kf0imTLQW_VKLpMY-xvunI8aKnM_Kph9knma-8rl_GM',
		description:
			'Sbírka úloh z fyziky pro střední školy, bez poznámek, perfektní stav. Původní cena 300 Kč, prodám za 150 Kč. Tato sbírka obsahuje různé úlohy, které pomohou studentům lépe pochopit fyzikální principy a připravit se na zkoušky.',
		url: 'https://instagram.com/p/example4',
	},
	{
		image:
			'https://fastly.picsum.photos/id/556/500/500.jpg?hmac=QCr9844f3jicoToG31pqMK529sQp6hadIFgyaH-ixeo',
		description:
			'Set výtvarných potřeb - štětce, akrylové barvy, skicák. Vše nepoužité, původní balení. Cena 600 Kč za vše. Tento set je ideální pro všechny kreativní duše, které chtějí vyjádřit svou uměleckou stránku. Perfektní pro malování, kreslení a další výtvarné projekty.',
		url: 'https://instagram.com/p/example5',
	},
	{
		image:
			'https://fastly.picsum.photos/id/609/500/500.jpg?hmac=1D44Cp4TKgF6Vq9k95XkIomPTIjHI7GBtN0iDegyrAU',
		description:
			'Nová učebnice angličtiny pro 3. ročník, ideální pro začátečníky. Cena 250 Kč. Tato učebnice je navržena tak, aby pomohla dětem rozvíjet jejich jazykové dovednosti zábavným a interaktivním způsobem, s mnoha cvičeními a aktivitami.',
		url: 'https://instagram.com/p/example6',
	},
	{
		image:
			'https://fastly.picsum.photos/id/556/500/500.jpg?hmac=QCr9844f3jicoToG31pqMK529sQp6hadIFgyaH-ixeo',
		description:
			'Stylový školní penál s motivem, málo používaný. Cena 150 Kč. Tento penál je nejen praktický, ale také trendy, ideální pro uložení všech psacích potřeb a drobností, které potřebujete mít po ruce.',
		url: 'https://instagram.com/p/example7',
	},
	{
		image:
			'https://fastly.picsum.photos/id/302/500/500.jpg?hmac=iY1DubFuGYjQDtDtZ2-xdiTg5dV5FRG_oEmqf02-Vbo',
		description:
			'Sada barevných fixů a pastelů, nepoužité. Cena 200 Kč. Tato sada je perfektní pro všechny, kteří rádi tvoří a malují. Obsahuje širokou škálu barev, které oživí každé umělecké dílo.',
		url: 'https://instagram.com/p/example8',
	},
	{
		image:
			'https://fastly.picsum.photos/id/457/500/500.jpg?hmac=o--a2yguwnZDQBWc-c9IZ-axyXD-vRpsxrOYLyCqbvY',
		description:
			'Kniha o přírodě pro děti, jako nová. Cena 300 Kč. Tato kniha je skvělým způsobem, jak děti seznámit s fascinujícím světem přírody a zvířat, plná krásných ilustrací a zajímavých informací.',
		url: 'https://instagram.com/p/example9',
	},
	{
		image:
			'https://fastly.picsum.photos/id/100/500/500.jpg?hmac=BOkw6qJR5MG-PbDD0YehqftfKnxDnJ5EymZ9CxnwbBo',
		description:
			'Zápisník s motivem, ideální pro školní poznámky. Cena 100 Kč. Tento zápisník je perfektní pro zapisování myšlenek, úkolů a poznámek, ať už ve škole nebo doma. Je dostatečně prostorný a stylový.',
		url: 'https://instagram.com/p/example10',
	},
];

function loadData() {
	return examplePosts;
}

app.get('/', async (req, res) => {
	let data = loadData();

	res.render('index', {
		data,
		instance: 'homepage',
	});
});

app.get('/post/:id', async (req, res) => {
	var data = loadData()[req.params.id];

	res.render('post', {
		data,
		instance: 'post',
	});
});

app.get('/admin', (req, res) => res.sendStatus(403));
app.get('/o-nas', (req, res) => res.sendStatus(403));
app.get('/kontakt', (req, res) => res.sendStatus(403));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.log(`Listening on port ${PORT}`));
