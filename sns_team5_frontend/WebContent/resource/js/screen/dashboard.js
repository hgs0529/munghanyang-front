$(document).ready(function(){
	let newDataCount = null;
	let newDataUpDown = null;
	
	const getNewData = (dataType) => {
		$.ajax({
			url:'http://localhost:3000/admin/dashboard/count',
			type:'get',
			data:{ 'dataType': dataType },
			xhrFields: { withCredentials: true },
		    crossDomain: true,
		    success:function(count){
				newDataCount = count;
				console.log(dataType + newDataCount);
				$("#" + dataType).text(newDataCount);
		    },
		    error:function(){
		    	alert('error:newdata');
		    }
		});
	}

	const getDataUpDown = (dataType) => {
		$.ajax({
			url:'http://localhost:3000/admin/dashboard/count/updown',
			type:'get',
			data:{ 'dataType': dataType },
			xhrFields: { withCredentials: true },
		    crossDomain: true,
		    success:function(count){
		    	newDataUpDown = count;
				console.log(newDataUpDown);
				
				$("#" + dataType + "UpDown").html("");
		    	if(newDataUpDown > 0){
		    		let str = "<span class='updown-up'>";
		    			str += "<i class='fas fa-arrow-up'></i>";
		    			str += "  " + newDataUpDown;
		    			str += "</span>";
		    			str += "<span class='updown-text'> 저번주 대비 증가</span>"
					console.log(newDataUpDown);
					
					$("#" + dataType + "UpDown").append(str);
		    	}
				else if(newDataUpDown < 0){
		    		let str = "<span class='updown-down'>";
		    			str += "<i class='fas fa-arrow-down'></i>";
		    			str += "  " + newDataUpDown;
		    			str += "</span>";
		    			str += "<span class='updown-text'> 저번주 대비 감소</span>"
					console.log(newDataUpDown);
					
					$("#" + dataType + "UpDown").append(str);
		    	}
				else{
					let str = "<span class='updown-same'>";
		    			str += "<i class='fas fa-ellipsis-h'></i>";
		    			str += "  " + newDataUpDown;
		    			str += "</span>";
		    			str += "<span> 저번주 대비 동일</span>"
					console.log(newDataUpDown);
					
					$("#" + dataType + "UpDown").append(str);
				}
		    },
		    error:function(){
		    	alert('error:updown');
		    }
		});
	}
	
	getNewData('user');
	getNewData('order');
	getNewData('sales');
	
	getDataUpDown('user');
	getDataUpDown('order');
	getDataUpDown('sales');
	
	$("#today").text(moment(new Date()).format("YYYY/MM/DD"));
});