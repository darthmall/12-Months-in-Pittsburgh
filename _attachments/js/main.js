CARDVIZ = {
	MONTHS: [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	],

	init: function() {
		var width = $('#colors').width(),
			height = $('#colors').height(),
			radius = Math.min(width, height) / 2;

		var colors = d3.select('#colors').append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

		var partition = d3.layout.partition()
			.size([2 * Math.PI, radius * radius])
			.sort(function (a, b) { return b.frequency - a.frequency; })
			.children(function (d) { return (d.children) ? d.children : d.values; })
			.value(function (d) { return d.frequency; });

		var arc = d3.svg.arc()
			.startAngle(function (d) { return d.x; })
			.endAngle(function (d) { return d.x + d.dx; })
			.innerRadius(function (d) { return Math.sqrt(d.y); })
			.outerRadius(function (d) { return Math.sqrt(d.y + d.dy); });

		var lScale = d3.scale.linear()
			.domain([1, 3])
			.range([0.9, 0.7]);

		d3.json('/cards/_design/cardviz/_view/colors', function (json) {

			var cards = d3.nest()
				.key(function (d) { return d.key[2]; })
				.rollup(function (d) { 
					return d.map(function(v) {
						return v.value;
					});
				});

			var months = d3.nest()
				.key(function (d) { return d.key[1]; })
				.rollup(function (d) { return cards.entries(d); });

			var cardData = {
				'key': 'cards',
				'values': d3.nest()
					.key(function (d) { return d.key[0]; })
					.rollup(function (d) { return months.entries(d); })
					.entries(json.rows)
				};

			colors.data([cardData]).selectAll('path')
				.data(partition.nodes)
				.enter()
				.append('path')
				.attr('display', function (d) { return (d.depth) ? null : 'none'; })
				.attr('d', arc)
				.attr('fillRule', 'evenodd')
				.attr('id', function (d) { return d.key + '-' + d.depth + '-' + d.values; })
				.style('stroke', '#fff')
				.style('strokeWidth', '3')
				.style('fill', function (d) { 
					return (d.color) ? '#' + d.color : d3.hsl(0, 0, lScale(d.depth)).toString();
				});
		});

		var bargraph = function (json) {
			if (json) {
				var w = $('#senders').width();
				var h = $('#senders').width() / json.rows.length;
				var margin = Math.max(1, Math.floor(h * 0.1));
				var scale = d3.scale.linear()
					.domain([0, d3.max(json.rows.map(function (d) {
						return d.value;
					}))])
					.range([0, w * 0.9]);

				d3.select('#senders').selectAll('rect')
					.data(json.rows)
					.enter()
					.append('rect')
					.attr('class', 'bar')
					.attr('x', 0)
					.attr('y', function (d, i) {
						return margin + (i * h);
					})
					.attr('width', function (d) {
						return scale(d.value);
					})
					.attr('height', h - (2 * margin));

				d3.select('#senders').selectAll('text')
					.data(json.rows)
					.enter()
					.append('text')
					.attr('x', 5)
					.attr('y', function (d, i) {
						return i * h + (h / 2);
					})
					.text(function (d) {
						return d.key;
					});
			}
		};

		var resize = function () {
			var svg = $('#colors');
			var w = svg.width();
			var h = svg.height();

			colors.attr('transform', 'translate(' + w/2 + ',' + h/2 + ') scale(' + w/width + ')');
		}

		d3.json('/cards/_design/cardviz/_view/senders?group=true', bargraph);
		$(window).resize(resize);
	}
};

UTIL = {
  exec: function(controller, action) {
    var ns = SITENAME,
        action = (action === undefined) ? "init" : action;
 
    if (controller !== "" && ns[controller] && typeof ns[controller][action] == "function") {
      ns[controller][action]();
    }
  },
 
  init: function() {
    var body = document.body,
        controller = body.getAttribute("data-controller"),
        action = body.getAttribute("data-action");
 
    UTIL.exec("common");
    UTIL.exec(controller);
    UTIL.exec(controller, action);
  }
};
 
$(document).ready(CARDVIZ.init);