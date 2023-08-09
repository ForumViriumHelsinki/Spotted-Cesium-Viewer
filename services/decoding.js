/**
 * Finds the purpose of a building in Helsinki based on code included in wfs source data
 * Code list: https://kartta.hel.fi/avoindata/dokumentit/Rakennusrekisteri_avoindata_metatiedot_20160601.pdf
 *
 * @param { String } kayttotarkoitus code for purpose
 * @return { String } purpose of building
 */
function decodeKayttotarkoitusHKI( kayttotarkoitus ) {

	switch ( kayttotarkoitus ) {
		case '011': 
			return 'Yhden asunnon talot';
		case '012': 
			return 'Kahden asunnon talot';
		case '013': 
			return 'Muut pientalot';
		case '021': 
			return 'Rivitalot';
		case '022': 
			return 'Ketjutalot';
		case '032': 
			return 'Luhtitalot';
		case '039': 
			return 'Muut kerrostalot';			
		case '041': 
			return 'Vapaa-ajan asunnot';
		case '111': 
			return 'Myymälähallit';
		case '112': 
			return 'Liike- ja tavaratalot';
		case '119': 
			return 'Myymälärakennukset';	
		case '121': 
			return 'Hotellit';				
		case '123': 
			return 'Loma- lepo- ja virkistyskodit';		
		case '124': 
			return 'Vuokrattavat lomamökit';				
		case '129': 
			return 'Muu majoitusliike';	
		case '131': 
			return 'Asuntolat, vanhusten yms';			
		case '139': 
			return 'Muut majoitusrakennukset';				
		case '141': 
			return 'Ravintolat, baarit yms';		
		case '151': 
			return 'Toimistorakennukset';
		case '161': 
			return 'Asemat ja terminaalit';	
		case '162': 
			return 'Kulkuneuvojen rakennukset';			
		case '163': 
			return 'Pysäköintitalot';		
		case '164': 
			return 'Tietoliikenteen rakennukset';	
		case '169': 
			return 'Muut liikenteen rakennukset';												
		case '211': 
			return 'Keskussairaalat';
		case '213': 
			return 'Muut sairaalat';
		case '214': 
			return 'Terveyskeskukset';
		case '215': 
			return 'Erityis terveydenhoito';
		case '219': 
			return 'Muu terveydenhoito';
		case '221': 
			return 'Vanhainkodit';
		case '222': 
			return 'Lastenkodit, koulukodit';
		case '223': 
			return 'Kehitysvammaisten hoito';
		case '229': 
			return 'Muut huoltolaitokset';
		case '231': 
			return 'Lasten päiväkodit';
		case '239': 
			return 'Muut sosiaalitoimi';
		case '241': 
			return 'Vankilat';	
		case '311': 
			return 'Teatterit, konsertti yms';		
		case '312': 
			return 'Elokuvateatterit';		
		case '322': 
			return 'Kirjastot';			
		case '323': 
			return 'Museot, taidegalleriat';
		case '324': 
			return 'Näyttelyhallit';	
		case '331': 
			return 'Seurain-, nuoriso- yms';	
		case '341': 
			return 'Kirkot, kappelit yms';	
		case '342': 
			return 'Seurakuntatalot';				
		case '349': 
			return 'Muut uskonnolliset yhteisöt';	
		case '351': 
			return 'Jäähallit';
		case '352': 
			return 'Uimahallit';	
		case '353': 
			return 'Tennis, squash yms';	
		case '354': 
			return 'Monitoimi/urheiluhallit';	
		case '359': 
			return 'Muut urheilu';				
		case '369': 
			return 'Muut kokoontumisrakennukset';	
		case '511': 
			return 'Peruskoulut, lukiot ja muut';
		case '521': 
			return 'Ammatilliset oppilaitokset';		
		case '531': 
			return 'Korkeakoulurakennukset';				
		case '532': 
			return 'Tutkimuslaitosrakennukset';	
		case '541': 
			return 'Järjestöjen opetus';
		case '549': 
			return 'Muut opetusrakennukset';		
		case '611': 
			return 'Voimalaitosrakennukset';		
		case '613': 
			return 'Yhdyskuntatekniikka';				
		case '691': 
			return 'Teollisuushallit';	
		case '692': 
			return 'Teollisuus- ja pienteollisuus';
		case '699': 
			return 'Muut teollisuus/tuotanto';			
		case '711': 
			return 'Teollisuusvarastot';		
		case '712': 
			return 'Kauppavarastot';				
		case '719': 
			return 'Muut varastorakennukset';	
		case '721': 
			return 'Paloasemat';
		case '722': 
			return 'Väestönsuojat';	
		case '729': 
			return 'Muu palo- ja pelastustoiminta';		
		case '811': 
			return 'Navetat, sikalat, kanalat yms';				
		case '819': 
			return 'Eläinsuojat';	
		case '891': 
			return 'Viljarakennukset';
		case '892': 
			return 'Kasvihuoneet';	
		case '893': 
			return 'Turkistarhat';		
		case '899': 
			return 'Muu maa/metsä/kala';						
		case '931': 
			return 'Saunarakennukset';	
		case '941': 
			return 'Talousrakennukset';				
		default:
			return kayttotarkoitus;
		}

}


/**
 * Decodes building material https://kartta.hel.fi/avoindata/dokumentit/2017-01-10_Rakennusaineisto_avoindata_koodistot.pdf
 *
 * @param { String } material value code for building material.'
 * @return { String } building material
 */
function decodeMaterial( material ) {

	switch ( material ) {
		case '1': 
			return 'concrete';
		case '2': 
			return 'brick';
		case '3': 
			return 'steel';
		case '4': 
			return 'wood';
		case '5': 
			return 'other';
		default:
			return material;  		
	}

}

function decodeHeatingMethod( heatingMethod ) {

	switch ( heatingMethod ) {
		case '1': 
			return 'central water';
		case '2': 
			return 'central air';
		case '3': 
			return 'electricity';
        case '4': 
			return 'oven';
		case '5': 
			return 'no fixed heating';			
        default:
            return heatingMethod;  
	}

}

function decodeHeatingSource( heatingSource ) {

	switch ( heatingSource ) {
		case '1': 
			return 'district';
		case '2': 
			return 'light fuel oil';
		case '3': 
			return 'heavy fuel oil';
        case '4': 
			return 'electricity';
		case '5': 
			return 'gas';		
		case '6': 
			return 'coal';
		case '7': 
			return 'wood';
		case '8': 
			return 'peat';
        case '9': 
			return 'ground-source';
		case '10': 
			return 'other';					
        default:
            return heatingSource;  
	}

}

/**
 * Decodes facade material https://kartta.hel.fi/avoindata/dokumentit/2017-01-10_Rakennusaineisto_avoindata_koodistot.pdf
 *
 * @param { String } facade value code for facade material.'
 * @return { String } face material
 */
function decodeFacade( facade ) {

	switch ( facade ) {
		case '1': 
			return 'concrete';
		case '2': 
			return 'brick';
		case '3': 
			return 'metal';
		case '4': 
			return 'stone';
		case '5': 
			return 'wood';
		case '6': 
			return 'glass';
		case '7': 
			return 'other';
		default:
			return facade;  				
	}

}

/**
 * Get the closest color value for a given key using a pre-defined color mapping.
 * The mapping was created from webcolors using K-means clustering.
 * 
 * @param { String } key original color
 * @return { String } reduced value for original color
 */
function getColorValue( key ) {
    const colorMap = {
        aliceblue: 'seashell',
        antiquewhite: 'seashell',
        aqua: 'deepskyblue',
        aquamarine: 'aquamarine',
        azure: 'seashell',
        beige: 'seashell',
        bisque: 'peachpuff',
        black: 'black',
        blanchedalmond: 'peachpuff',
        blue: 'blue',
        blueviolet: 'blueviolet',
        brown: 'brown',
        burlywood: 'tan',
        cadetblue: 'steelblue',
        chartreuse: 'chartreuse',
        chocolate: 'peru',
        coral: 'peru',
        cornflowerblue: 'mediumslateblue',
        cornsilk: 'seashell',
        crimson: 'red',
        cyan: 'deepskyblue',
        darkblue: 'navy',
        darkcyan: 'darkcyan',
        darkgoldenrod: 'olive',
        darkgray: 'darkgray',
        darkgrey: 'darkgray',
        darkgreen: 'green',
        darkkhaki: 'tan',
        darkmagenta: 'purple',
        darkolivegreen: 'darkslategray',
        darkorange: 'orange',
        darkorchid: 'blueviolet',
        darkred: 'darkred',
        darksalmon: 'darksalmon',
        darkseagreen: 'darkgray',
        darkslateblue: 'purple',
        darkslategray: 'darkslategray',
        darkslategrey: 'darkslategray',
        darkturquoise: 'deepskyblue',
        darkviolet: 'blueviolet',
        deeppink: 'deeppink',
        deepskyblue: 'deepskyblue',
        dimgray: 'gray',
        dimgrey: 'gray',
        dodgerblue: 'deepskyblue',
        firebrick: 'brown',
        floralwhite: 'seashell',
        forestgreen: 'green',
        fuchsia: 'magenta',
        gainsboro: 'lightgray',
        ghostwhite: 'seashell',
        gold: 'gold',
        goldenrod: 'orange',
        gray: 'gray',
        grey: 'gray',
        green: 'green',
        greenyellow: 'chartreuse',
        honeydew: 'seashell',
        hotpink: 'orchid',
        indianred: 'peru',
        indigo: 'purple',
        ivory: 'seashell',
        khaki: 'peachpuff',
        lavender: 'seashell',
        lavenderblush: 'seashell',
        lawngreen: 'chartreuse',
        lemonchiffon: 'seashell',
        lightblue: 'lightblue',
        lightcoral: 'darksalmon',
        lightcyan: 'seashell',
        lightgoldenrodyellow: 'seashell',
        lightgray: 'lightgray',
        lightgrey: 'lightgray',
        lightgreen: 'lightgreen',
        lightpink: 'peachpuff',
        lightsalmon: 'darksalmon',
        lightseagreen: 'lightseagreen',
        lightskyblue: 'lightblue',
        lightslategray: 'gray',
        lightslategrey: 'gray',
        lightsteelblue: 'lightblue',
        lightyellow: 'seashell',
        lime: 'lime',
        limegreen: 'lime',
        linen: 'seashell',
        magenta: 'magenta',
        maroon: 'darkred',
        mediumaquamarine: 'mediumturquoise',
        mediumblue: 'blue',
        mediumorchid: 'orchid',
        mediumpurple: 'mediumslateblue',
        mediumseagreen: 'lightseagreen',
        mediumslateblue: 'mediumslateblue',
        mediumspringgreen: 'springgreen',
        mediumturquoise: 'mediumturquoise',
        mediumvioletred: 'deeppink',
        midnightblue: 'navy',
        mintcream: 'seashell',
        mistyrose: 'seashell',
        moccasin: 'peachpuff',
        navajowhite: 'peachpuff',
        navy: 'navy',
        oldlace: 'seashell',
        olive: 'olive',
        olivedrab: 'olive',
        orange: 'orange',
        orangered: 'red',
        orchid: 'orchid',
        palegoldenrod: 'peachpuff',
        palegreen: 'lightgreen',
        paleturquoise: 'lightblue',
        palevioletred: 'darksalmon',
        papayawhip: 'seashell',
        peachpuff: 'peachpuff',
        peru: 'peru',
        pink: 'peachpuff',
        plum: 'orchid',
        powderblue: 'lightblue',
        purple: 'purple',
        red: 'red',
        rosybrown: 'darkgray',
        royalblue: 'steelblue',
        saddlebrown: 'brown',
        salmon: 'darksalmon',
        sandybrown: 'darksalmon',
        seagreen: 'darkslategray',
        seashell: 'seashell',
        sienna: 'brown',
        silver: 'lightgray',
        skyblue: 'lightblue',
        slateblue: 'mediumslateblue',
        slategray: 'gray',
        slategrey: 'gray',
        snow: 'seashell',
        springgreen: 'springgreen',
        steelblue: 'steelblue',
        tan: 'tan',
        teal: 'darkcyan',
        thistle: 'lightgray',
        tomato: 'peru',
        turquoise: 'mediumturquoise',
        violet: 'orchid',
        wheat: 'peachpuff',
        white: 'seashell',
        whitesmoke: 'seashell',
        yellow: 'gold',
        yellowgreen: 'chartreuse'
    };
  
    return colorMap[key.toLowerCase()] || null;
  }

function getTreeRateForMajorDistrict( majordistrict ) {

	switch ( majordistrict ) {
		case '1': 
			return 0.180362772530447;
		case '2': 
			return 0.3192200634;
		case '3': 
			return 0.1879065695;
        case '4': 
			return 0.347176476824404;
		case '5': 
			return 0.23710680147664;		
		case '6': 
			return 0.429511343304354;
		case '7': 
			return 0.307034338528661;
		case '8': 
			return 0.531066144775314;			

	}
}

function getVegetationRateForMajorDistrict( majordistrict ) {

	switch ( majordistrict ) {
		case '1': 
			return 0.136310758913735;
		case '2': 
			return 0.210707839554935;
		case '3': 
			return 0.134483049663128;
        case '4': 
			return 0.213280606265504;
		case '5': 
			return 0.235880570887264;		
		case '6': 
			return 0.196945132000506;
		case '7': 
			return 0.215161244751333;
		case '8': 
			return 0.199602230190655;			

	}
}

function getWaterRateForMajorDistrict( majordistrict ) {

	switch ( majordistrict ) {
		case '1': 
			return 0.0044131956071969;
		case '2': 
			return 0.0115195831615184;
		case '3': 
			return 0.00572305553464529;
        case '4': 
			return 0.0269253552077743;
		case '5': 
			return 0.0211478064347008;		
		case '6': 
			return 0.00966826824459433;
		case '7': 
			return 0.00598259487446442;
		case '8': 
			return 0.0105059180635932;			

	}
}

function getFieldsRateForMajorDistrict( majordistrict ) {

	switch ( majordistrict ) {
		case '1': 
			return 0.000876648183371481;
		case '2': 
			return 0.0102769855345775;
		case '3': 
			return 0.0000669505729193174;
        case '4': 
			return 0.117216388319723;
		case '5': 
			return 0.0864012466909172;		
		case '6': 
			return 0.0125898154358978;
		case '7': 
			return 0.00916775999908508;
		case '8': 
			return 0.137241046334979;		

	}
}

function getDataForMajorDistrict( majordistrict ) {

	let data = [ getTreeRateForMajorDistrict( majordistrict ) ];

	if ( document.getElementById( "showVegetationToggle" ).checked ) {

		data.push( getVegetationRateForMajorDistrict( majordistrict ) );

	}

	if ( document.getElementById( "showWaterToggle" ).checked ) {
		
		data.push( getWaterRateForMajorDistrict( majordistrict ) );

	}

	if ( document.getElementById( "showFieldsToggle" ).checked ) {

		data.push( getFieldsRateForMajorDistrict( majordistrict ) );

	}

	return data;
}

function getDataForCity( ) {

	let data = [ 0.26229790964449 ];

	if ( document.getElementById( "showVegetationToggle" ).checked ) {

		data.push( 0.197748000824418 );

	}

	if ( document.getElementById( "showWaterToggle" ).checked ) {
		
		data.push( 0.048248528642427256 );

	}

	if ( document.getElementById( "showFieldsToggle" ).checked ) {

		data.push( 0.012282989542894572 );

	}

	return data;
}

function getAreaLabels( ) {

	let labels = ['trees in area' ]

	if ( document.getElementById( "showVegetationToggle" ).checked ) {

		labels.push( 'vegetation in area' );

	}

	if ( document.getElementById( "showWaterToggle" ).checked ) {

		labels.push( 'water in area' );

	}

	if ( document.getElementById( "showFieldsToggle" ).checked ) {

		labels.push( 'fields in area' );
		
	}

	return labels;

}

function getHelsinkiLabels( ) {

	let labels = ['trees whole city' ]

	if ( document.getElementById( "showVegetationToggle" ).checked ) {

		labels.push( 'vegetation whole city' );

	}

	if ( document.getElementById( "showWaterToggle" ).checked ) {

		labels.push( 'water whole city' );

	}

	if ( document.getElementById( "showFieldsToggle" ).checked ) {

		labels.push( 'fields whole city' );
		
	}

	return labels;

}
