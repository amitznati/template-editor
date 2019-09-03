const paperBagBround = require('./paper_bag_bround.png');
const paperBagWhite = require('./paper_bag_white.png');
const businessCard = require('./business_card.png');
const products = [
	{
		id: 1,
		name: 'Paper Bag - Bround',
		image: paperBagBround,
		productSize: {
			height: 30,
			width: 20
		},
		templateFrame: {
			height: 25,width: 19, x: 0.5, y: 0.5
		}
	},
	{
		id: 2,
		name: 'Business Card - front',
		image: businessCard,
		productSize: {
			height: 5.5,
			width: 8.5
		},
		templateFrame: {
			height: 5.4,width: 8.4, x: 0.05, y: 0.05
		}
	},
	{
		id: 3,
		name: 'Business Card - back',
		image: businessCard,
		productSize: {
			height: 5.5,
			width: 8.5
		},
		templateFrame: {
			height: 5.4,width: 8.4, x: 0.05, y: 0.05
		}
	},
	{
		id: 4,
		name: 'Paper Bag - White',
		image: paperBagWhite,
		productSize: {
			height: 30,
			width: 20
		},
		templateFrame: {
			height: 25,width: 19, x: 1, y: 1
		}
	},
];

export default products;