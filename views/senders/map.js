function (doc) {
	if (typeof doc.from === 'string') {
		emit(doc.from, doc.id);
	} else {
		for (var i = 0; i < doc.from.length; i++) {
			emit(doc.from[i], doc.id);
		};
	}
}