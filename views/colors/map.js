function (doc) {
	var toks = doc._id.split('-');
	var year = Number(toks[0].substr(0, 4));
	var month = Number(toks[0].substr(4,6)) - 1;
	var num = Number(toks[1]) - 1;

	for (var i = doc.colors.length - 1; i >= 0; i--) {
		emit([year, month, num], doc.colors[i]);
	};
}