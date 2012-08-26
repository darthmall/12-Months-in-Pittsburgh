function (doc) {
	if (typeof doc.from === 'string') {
		emit(doc.from, 1);
	} else {
		for (var i = 0; i < doc.from.length; i++) {
			emit(doc.from[i], 1);
		};
	}
}