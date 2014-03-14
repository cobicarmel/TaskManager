
var Payment = function(CLIENT){

	/** CONSTANTS **/

	var self = this;

	var MAX_LENGTH = + Config.default.payment_limit;

	/** VARIABLES **/

	this.dateLimit = {
		from: null,
		to: null
	}

	this.limit = {
		start: 0,
		end: MAX_LENGTH
	}

	this.payments = [];

	/** METHODS **/

	this.addData = function(data){

		for(var i in data){

			var id = data[i].id,
				found = false;

			for(var p in self.payments)
				if(self.payments[p].id == id){
					self.payments[p] = data[i];
					found = true;
					break;
				}

			if(! found)
				self.payments.push(data[i]);
		}

		self.addToTable();
	}

	this.addPayment = function(){

		var form = this,
			params = this.serializeObject();

		params.client = CLIENT;

		popup('loading', 66);

		Api.send('Payment', 'addpayment', params, function(){
			popup('success', 67);
			form[0].reset();
			self.reset();
			self.payments = [];
			self.getPayments();
			$('#cd-payments').accordion('option', 'active', 2);
		})

	}

	this.addToTable = function(){

		var wrapper = $('#cdp-wrapper').clear(LOCAL[64]),
			tbody = $('#cdp-table tbody').empty(),
			payments = self.currentPayments();

		for(var p in payments){
	
			var data = payments[p];

			var tr = $('<tr>').data('index', self.payments.indexOf(data)).append(
				$('<td>').html(
					$('<div>', {'class': 'ui-icon ui-icon-trash', title: LOCAL[69]})
				),
				$('<td>').text(data.date),
				$('<td>').text(data.sum),
				$('<td>').text(data.title)
			).click(self.edit)

			tbody.append(tr);
		}

		if(tbody.children().length)
			wrapper.unClear();

		self.calcTotal();
		self.toggleArrow();
	}

	this.calcTotal = function(){

		var total = 0,
			payments = self.currentPayments();

		for(var p in payments)
			total +=+ payments[p].sum;

		$('#cn-total').text(LOCAL[68] + ': ' + total.toFixed(2) + ' ₪')
	}

	this.currentPayments = function(){
		return self.payments.slice(self.limit.start, self.limit.end);
	}

	this.edit = function(e){

		var index = $(this).data('index'),
			payment = self.payments[index],
			form = $('#edit-payment');

		self.editId = payment.id;
		self.editIndex = index;

		if($(e.target).is('.ui-icon'))
			return self.remove();

		for(var p in payment)
			form.find('[name=' + p + ']').val(payment[p]);

		form.show().position({of: '#cdp-list'});
	}

	this.getPayments = function(){

		var params = {
			limit: [self.limit.start, self.limit.end + 1].join(','),
			client: CLIENT
		}

		params = $.extend(params, self.dateLimit);

		Api.send('Payment', 'getpayments', params, function(res){
			self.addData(res[0]);
		})
	}

	this.next = function(){
		self.limit.start += MAX_LENGTH;
		self.limit.end += MAX_LENGTH;
	}

	this.prev = function(){
		self.limit.start -= MAX_LENGTH;
		self.limit.end -= MAX_LENGTH;

		if(self.limit.start < 0)
			self.reset();
	}

	this.remove = function(){

		Api.confirm(40, 71, function(){
		
			var id = self.editId;

			popup('loading', 57);

			Api.send('Payment', 'removepayment', {id: id}, function(){
				popup('success', 70);
				self.payments.splice(self.editIndex, 1);
				self.addToTable();
			})
		})
	}

	this.reports = function(){

		var params = this.serializeObject(),
			prtBoard = $('#crp-content');

		params.client = CLIENT;
		params.limit = 0;

		$('#cr-print')
			.show()
			.appendTo('#clients')
			.position({of: '#client-details'});

		prtBoard.clear($('<div>', {id: 'crp-clear'}).text(LOCAL[72]));

		Api.send('Payment', 'getpayments', params, function(res){

			prtBoard.unClear();

			var client = Client.all[Client.id],
				data = res[0],
				table = $('#crp-table'),
				tbody = table.children('tbody').empty();

			$('#crp-client').text([client.first_name, client.last_name].join(' '));
			$('#crp-from').text(params.from);
			$('#crp-to').text(params.to);

			for(var d in data){
				var tr = $('<tr>').append(
					$('<td>').text(data[d].date),
					$('<td>').text(data[d].sum),
					$('<td>').text(data[d].title)
				)

				tbody.append(tr);
			}
		})
	}

	this.reset = function(){
		self.limit.start = 0;
		self.limit.end = MAX_LENGTH;
	}

	this.saveEdit = function(){

		var form = this,
			params = form.serializeObject();

		params.client = CLIENT;
		params.id = self.editId;

		popup('loading', 12);

		Api.send('Payment', 'editpayment', params, function(res){
			popup('success', 13);
			self.addData(res[0]);
			form.hide();
		})
	}

	this.toggleArrow = function(){
		$('#cn-prev').toggle(self.limit.start > 0);
		$('#cn-next').toggle(self.limit.end < self.payments.length);
	}

}