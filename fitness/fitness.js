includeHTML();

var date_of_birth, age;
var gender_is_male;
var length_unit_is_cms, cms, feet, inches, height;
var weight_unit_is_kgs, kgs, pounds, weight;

function validateFloatKeyPress(el, evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode;
  var number = el.value.split('.');
  if (!((charCode == 46) || (charCode <= 31) || (charCode >= 48 && charCode <= 57))) {
    return false;
  }
  //just one dot 
  if(number.length>1 && charCode == 46){
    return false;
  }
  //get the carat position
  var caratPos = getSelectionStart(el);
  var dotPos = el.value.indexOf(".");
  if( caratPos > dotPos && dotPos>-1 && (number[1].length >= 1)){
    if(charCode > 31)
      return false;
  }
  return true;
}

//thanks: http://javascript.nwbox.com/cursor_position/
function getSelectionStart(o) {
    if (o.createTextRange) {
        var r = document.selection.createRange().duplicate()
        r.moveEnd('character', o.value.length)
        if (r.text == '') return o.value.length
        return o.value.lastIndexOf(r.text)
    } else return o.selectionStart
}

function length_cms() {
  $('#height').empty();
  $('#height').append("\
    <label class='control-label col-md-2'>Height:</label>\
    <div class='col-md-2'>\
      <input type='text' class='form-control' id='cms' onkeypress='return validateFloatKeyPress(this,event);'>\
    </div>\
    <label class='control-label col-md-2'>centimeters</label>");   
}

function length_feet() {
  $('#height').empty();
  $('#height').append("\
    <label class='control-label col-md-2'>Height:</label>\
    <div class='col-md-2'>\
      <input type='text' class='form-control' id='feet' onkeypress='return validateFloatKeyPress(this,event);'>\
    </div>\
    <label class='control-label col-md-1'>feet</label>\
    <div class='col-md-2'>\
      <input type='text' class='form-control' id='inches' onkeypress='return validateFloatKeyPress(this,event);'>\
    </div>\
    <label class='control-label col-md-1'>inches</label>");   
}

function weight_kgs() {
  $('#weight').empty();
  $('#weight').append("\
    <label class='control-label col-md-2'>Weight:</label>\
    <div class='col-md-2'>\
      <input type='text' class='form-control' id='kgs' onkeypress='return validateFloatKeyPress(this,event);'>\
    </div>\
    <label class='control-label col-md-2'>kilograms</label>");   
}

function weight_pounds() {
  $('#weight').empty();
  $('#weight').append("\
    <label class='control-label col-md-2'>Weight:</label>\
    <div class='col-md-2'>\
      <input type='text' class='form-control' id='pounds' onkeypress='return validateFloatKeyPress(this,event);'>\
    </div>\
    <label class='control-label col-md-2'>pounds</label>");   
}

function info_init() {
  $('#date_of_birth').datepicker({
    maxViewMode: 'century',
    startView: 'century',
    format: 'MM dd, yyyy',
    defaultViewDate: '-20y',
    startDate: '-150y',
    endDate: '-1d'
  });  
  date_of_birth = 0;
  age = 0;
  
  $('#male').prop('checked', true); 
  gender_is_male = true;
  
  $('#is_cms').prop('checked', true); 
  cms=feet=inches=height=0;
  length_unit_is_cms = true;
  length_cms();
  
  $('#is_kgs').prop('checked', true); 
  kgs=pounds=weight=0;
  weight_unit_is_kgs = true;
  weight_kgs();
  
  $('#input_show').text("Please fill in your information!");
}

info_init();

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months += d2.getMonth()- d1.getMonth();
    return months <= 0 ? 0 : months;
}

function ageStr() {
  if(age==0)
    return "??";
  else
    return Math.floor(age/12) + " years " + age%12 + " months";
}

function genderStr() {
  if(gender_is_male)
    return "male";
  else
    return "female";
}

function heightStr() {
  if(height == 0) 
    return "??";
  if(length_unit_is_cms)
    return cms + " centimeters";
  else
    var ret =  feet + " feet"
    if(inches != 0)
      ret += " " + inches + " inches";
    return ret;
}

function weigthStr() {
  if(weight == 0) 
    return "??";
  if(weight_unit_is_kgs)
    return kgs + " kilograms";
  else
    return pounds + " pounds";
}

var BMI = "BMI (Body Mass Index)";
function showBMI() {
  if(height == 0 || weight ==0) {
    $("#bmi").text(BMI)
  } else {        
    var bmi = weight / Math.pow(height/100, 2)
    bmi = Math.round(bmi * 10)/10
    $("#bmi").text(BMI + " " + bmi)
  }  
}

function showResult() {
  showBMI();
}

function showInfo() {
	var input_show = "Age: " + ageStr() +
                ";  Gender: " + genderStr() +
                ";  Height: " + heightStr() +
                ";  Weight: " + weigthStr() +
                ".";
	$("#input_show").text(input_show); // Display the result on the "result" field
  
  showResult()
}

$("#date_of_birth").on("changeDate", function() { 
	date_of_birth = $("#date_of_birth").data('datepicker').getDate();
  age = monthDiff(date_of_birth, new Date());
  showInfo();
});

$("#male, #female").on("change", function() { 
	gender_is_male = true;
	if ($('input[id=female]:checked').length > 0) {
		gender_is_male = false;
	}
  showInfo();
});

function cms2FeetInches(cms) {
  var inches = cms / 2.54;
  var feet = Math.floor(inches/12);
  inches =  Math.round( inches%12 * 10 ) / 10; 
  return [feet, inches];
}

function feetInches2cms(feet, inches) {
  var cms = feet * 30.48 + inches * 2.54;
  cms = Math.round(cms * 10)/10;
  return cms;
}

$("#is_cms, #is_feet").on("change", function() { 
	length_unit_is_cms = true;
	if ($('input[id=is_feet]:checked').length > 0) {
		length_unit_is_cms = false;
	}
  if(length_unit_is_cms) {
    length_cms();
    if(height != 0) {
      cms = height;
      $("#cms").val(cms);
    }  
  } else {
    length_feet();
    if(height != 0) {
      var temp = cms2FeetInches(height);
      feet = temp[0];
      inches = temp[1];
      $("#feet").val(feet);
      $("#inches").val(inches);
    }
  }
  showInfo();
});

$(document).on("change", "#cms", function() {
  cms = parseFloat($("#cms").val());
  if(isNaN(cms))
    cms = 0;
  height = cms; 
  showInfo();
});

$(document).on("change", "#feet, #inches", function() {
  feet = parseFloat($("#feet").val());
  if(isNaN(feet))
    feet = 0;
  inches = parseFloat($("#inches").val());
  if(isNaN(inches))
    inches = 0;
  height = feetInches2cms(feet, inches);
  var temp = cms2FeetInches(height);
  feet = temp[0];
  inches = temp[1];
  $("#feet").val(feet);
  $("#inches").val(inches);  
  showInfo();
});

function kgs2pounds(kgs) {
  var pounds = kgs *2.2;
  pounds =  Math.round( pounds * 10 ) / 10; 
  return pounds;
}

function pounds2kgs(pounds) {
  var kgs = pounds / 2.2;
  kgs =  Math.round( kgs * 10 ) / 10;
  return kgs;
}

$("#is_kgs, #is_pounds").on("change", function() { 
	weight_unit_is_kgs = true;
	if ($('input[id=is_pounds]:checked').length > 0) {
		weight_unit_is_kgs = false;
	}
  if(weight_unit_is_kgs) {
    weight_kgs();
    if(weight != 0) {
      kgs = weight;
      $("#kgs").val(kgs);
    }  
  } else {
    weight_pounds();
    if(weight != 0) {
      pounds = kgs2pounds(weight);
      $("#pounds").val(pounds);
    }
  }
  showInfo();
});

$(document).on("change", "#kgs", function() {
  kgs = parseFloat($("#kgs").val());
  if(isNaN(kgs))
    kgs = 0;
  weight = kgs; 
  showInfo();
});

$(document).on("change", "#pounds", function() {
  pounds = parseFloat($("#pounds").val());
  if(isNaN(pounds))
    pounds = 0;
  weight = pounds2kgs(pounds);
  showInfo();
});
