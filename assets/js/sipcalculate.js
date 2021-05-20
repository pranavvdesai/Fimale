
function SIPCal(amount, period, rateOfReturn, duration) {
  if (!($.isNumeric(amount) && $.isNumeric(rateOfReturn) && $.isNumeric(duration))) {
    return null;
  }

  amount = parseFloat(amount);
  rateOfReturn = parseFloat(rateOfReturn);
  duration = parseFloat(duration);

  var nperiod = period * duration;
  var futureValue = fv(rateOfReturn, period, nperiod, amount * -1, 0);

  return futureValue;
}
 function fv(rate, period, nperiod, pmt, pv) {
    if (pmt == 0 || nperiod == 0 || period == 0) {
      return null;
    }

    rate = rate / (period * 100);

    var futureValue;

    if (rate === 0) {
      futureValue = -(pv + (pmt * nperiod));
    } else {
      var x = Math.pow(1 + rate, nperiod);
      futureValue = -(-pmt + x * pmt + rate * x * pv) / rate;
    }

    return futureValue;
  }

function formatNumber(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function calculateSIP()
{
  var rrate = $('#return').val();
  var duration = $('#duration').val();
  var sipAmount = $('#sipAmount').val();
  var freq = $( 'input[name=ptype]:checked' ).val();
  freq = freq === 'quat' ? 4 : 12;

  if(rrate > 0 && duration > 0 && sipAmount > 0)
  {
      var futureAmount = SIPCal(sipAmount,freq,rrate,duration);

      futureAmount = futureAmount === null ? '0' : futureAmount / 1000;

      var totalAmountInv = freq * duration * sipAmount;
      totalAmountInv = totalAmountInv === null ? '0' : totalAmountInv / 1000;

      var wealthGain = futureAmount - totalAmountInv;
      wealthGain = wealthGain === null ? '0' : wealthGain;

      var futureAmountCurrencyFormat = '(K)';;
      var totalAmountInvCurrencyFormat = '(K)';
      var wealthGainCurrencyFormat = '(K)';
    
      futureAmountFormated = futureAmount.toFixed(0);
      totalAmountInvFormated = totalAmountInv.toFixed(0);
      wealthGainFormated = wealthGain.toFixed(0);
      
      if(futureAmount > 100)
      {
        futureAmountFormated = (futureAmount / 100).toFixed(2);
        futureAmountCurrencyFormat = '(Lacs)';
      }

      if(totalAmountInv > 100)
      {
          totalAmountInvFormated = (totalAmountInv / 100).toFixed(2);
          totalAmountInvCurrencyFormat = '(Lacs)';
      }    
      
      if(wealthGain > 100)
      {
          wealthGainFormated = (wealthGain / 100).toFixed(2);
          wealthGainCurrencyFormat = '(Lacs)';
      }

      $('#totalAmount').html(formatNumber(futureAmountFormated) + ' ' + futureAmountCurrencyFormat);
      $('#invAmount').html(formatNumber(totalAmountInvFormated) + ' ' + totalAmountInvCurrencyFormat);
      $('#gainAmount').html(formatNumber(wealthGainFormated) + ' ' + wealthGainCurrencyFormat);

      totalInvAmountPerc = ((totalAmountInv / futureAmount) * 100).toFixed(1);
      totalGainPerc = ((wealthGain / futureAmount) * 100).toFixed(1);
      //drawing chart
      drawChart(totalInvAmountPerc, totalGainPerc);

      $('html,body').animate({
        scrollTop: $("#summary").offset().top
    }, 1000);
  }
}

function drawChart(amountInv,amountGain)
{
  var ctx = document.getElementById("myChart");
  options = {'animation.animateRotate' : 'true'};
  data = {
    datasets: [{
        data: [amountInv, amountGain],
        backgroundColor : [
          '#043a42',
          '#32CD32'
        ]
      
    }],
    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Your Investment (%)',
        'Your Earnings (%)',
    ]
};
  // And for a doughnut chart
var myDoughnutChart = new Chart(ctx, {
  type: 'doughnut',
  data: data,
  options: options
});
}

function validateInput()
{   
    if(Number($('#sipAmount').val())=== '' || Number($('#sipAmount').val()) < 500 || Number($('#sipAmount').val()) > 99000 || $('#sipAmount').val() == null)
    {           
        $('#errorMsg').html("Please Enter SIP Amount between 500 to 99000.");
        $('#errorDiv').removeClass('none');
        $('html,body').animate({
          scrollTop: $("#errorDiv").offset().top
        }, 1000);
        return false;
    }
    else if(!Number($('#duration').val()) || Number($('#duration').val()) < 1 || Number($('#duration').val()) > 30 || $('#duration').val() == null)
    {
        $('#errorMsg').html("Please Enter SIP Duration between 1 to 30 Years.");
        $('#errorDiv').removeClass('none');
        $('html,body').animate({
          scrollTop: $("#errorDiv").offset().top
        }, 1000);
        return false;
    }
    else if(!Number($('#return').val()) || Number($('#return').val()) < 1 || Number($('#return').val()) > 30 || $('#return').val() == null)
    {
        $('#errorMsg').html("Please Enter Expected Returns between 1 to 30 Percent.");
        $('#errorDiv').removeClass('none');
        $('html,body').animate({
          scrollTop: $("#errorDiv").offset().top
        }, 1000);
        return false;
    }
    else
    {
        $('#errorDiv').addClass('none');
    }
    return true;
}

function drawBarChart()
{

    var ctx = document.getElementById("barChart");
    var dateObj = new Date();
    var curYear = dateObj.getFullYear();
    var yearArr = [2,5,8,10,12,15,18,20,25,30];
    var futureYearArr = [curYear + 2,curYear + 5,curYear + 8,curYear + 10,curYear + 12,curYear + 15,curYear + 18,curYear + 20,curYear + 25,curYear + 30];
    var yearwiseAmountInvArr = [];
    var yearwiseFvArr = [];
    var yearwiseCalculationArr = [];

    for(var i = 0; i< yearArr.length; i++)
    {
      yearwiseCalculationArr = calculateSIPByDuration(yearArr[i]);
      yearwiseAmountInvArr.push(yearwiseCalculationArr['totalAmountInv']);
      yearwiseFvArr.push(yearwiseCalculationArr['futureAmount']);
  
    }

    var data = {
      labels: futureYearArr,
      datasets: [
          {
              label: "Amount Invested (Lacs)",
              backgroundColor: "#043a42",
              data: yearwiseAmountInvArr
          },
          {
              label: "SIP Future Amount (Lacs)",
              backgroundColor: "#32CD32",
              data: yearwiseFvArr
          },         
      ]
  };
  //showing bar chart
  $('#barChartDiv').removeClass('none');

  //hiding what is sip div
  $('#what-is-sip-div').addClass('hide-mob-div');

  var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
          barValueSpacing: 20,
          scales: {
              yAxes: [{
                  ticks: {
                      min: 0,
                  }
              }]
          }
      }
  });
}

function calculateSIPByDuration(duration)
{
  var rrate = $('#return').val();
  var sipAmount = $('#sipAmount').val();
  var freq = $( 'input[name=ptype]:checked' ).val();
  freq = freq === 'quat' ? 4 : 12;
  var returnArr = [];

  if(rrate > 0 && duration > 0 && sipAmount > 0)
  {
      var futureAmount = SIPCal(sipAmount,freq,rrate,duration);

      returnArr['futureAmount'] = futureAmount === null ? '0' : (futureAmount / 100000).toFixed(2);

      var totalAmountInv = freq * duration * sipAmount;
      returnArr['totalAmountInv'] = totalAmountInv === null ? '0' : (totalAmountInv / 100000).toFixed(2);

      var wealthGain = futureAmount - totalAmountInv;
      returnArr['wealthGain'] = wealthGain === null ? '0' : (wealthGain / 100000).toFixed(2);      
  }

  return returnArr;
}
