let input1 = document.getElementById("monthlyInvestment");

let result1 = document.getElementById("dynamicBankValue");
let result2 = document.getElementById("dynamicInvestValue");

let text0 = document.getElementById("text0");
let text2 = document.getElementById("text2");

let bankdiv = document.getElementById("bankdiv");
let investmentdiv = document.getElementById("investmentdiv");

let minusIcon = document.querySelector("#icon1div i");
let plusIcon = document.querySelector("#icon2div i");

function calculateFinalAmountBank(
  input1,
  monthlyInterestRate1,
  numberOfMonths1
) {
  let PMTB = parseFloat(input1.value);
  let rb = parseFloat(monthlyInterestRate1) / 100;
  let nb = parseInt(numberOfMonths1);

  let FVb = (PMTB * ((1 + rb) ** nb - 1)) / rb;
  return FVb.toFixed(0);
}

function calculateFinalAmount(input1, monthlyInterestRate2, numberOfMonths2) {
  let PMT = parseFloat(input1.value);
  let r = parseFloat(monthlyInterestRate2) / 100;
  let n = parseInt(numberOfMonths2);

  let FV = (PMT * ((1 + r) ** n - 1)) / r;
  return FV.toFixed(0);
}

function updateChartData() {
  const monthlyInterestRate1 = 1.025;
  const monthlyInterestRate2 = 1.5416666667;
  const numberOfMonths = parseInt(output2.innerHTML) * 12;

  let bankValues = [0];
  let investmentValues = [0];

  let bankAmount = 0;
  let investmentAmount = 0;

  for (let year = 1; year <= 30; year++) {
    const numberOfMonths1 = year * 12;
    bankAmount = parseFloat(
      calculateFinalAmountBank(input1, monthlyInterestRate1, numberOfMonths1)
    );
    bankValues.push(bankAmount);

    const numberOfMonths2 = year * 12;
    investmentAmount = parseFloat(
      calculateFinalAmount(input1, monthlyInterestRate2, numberOfMonths2)
    );
    investmentValues.push(investmentAmount);
  }

  return { bankValues, investmentValues };
}


function updateChart() {
  const { bankValues, investmentValues } = updateChartData();

  const selectedYear = parseInt(output2.innerHTML);

  myChart.data.datasets[0].data = bankValues;
  myChart.data.datasets[1].data = investmentValues;
  myChart.options.scales.y.max = Math.max(
    Math.max(...bankValues),
    Math.max(...investmentValues)
  );

  // Calculate the opacity for each data point based on the selectedYear
  const opacityArray = Array.from({ length: 30 }, (_, i) =>
    i + 1 <= selectedYear ? 1 : 0.2
  );

  // Set the backgroundColor based on the calculated opacityArray
  myChart.data.datasets.forEach((dataset, index) => {
    dataset.backgroundColor = opacityArray.map((opacity, i) => {
      const color =
        index === 0 ? "rgba(50, 49, 80," : "rgba(206, 77, 99,";
      return `${color}${opacity})`;
    });
  });

  myChart.update();
}


function dynamicBankValue() {
  let monthlyInterestRate1 = 1.025;
  let numberOfMonths1 = parseInt(output2.innerHTML) * 12;
  let finalAmount1 = calculateFinalAmountBank(
    input1,
    monthlyInterestRate1,
    numberOfMonths1
  );

  result1.innerText = finalAmount1
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  text0.appendChild(result1);
  bankdiv.appendChild(text0);

  updateChart();
}

function dynamicInvestValue() {
  let monthlyInterestRate2 = 1.5416666667;
  let numberOfMonths2 = parseInt(output2.innerHTML) * 12;
  let finalAmount2 = calculateFinalAmount(
    input1,
    monthlyInterestRate2,
    numberOfMonths2
  );

  result2.innerText = finalAmount2
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  text2.appendChild(result2);
  investmentdiv.appendChild(text2);

  updateChart();
}

input1.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    dynamicBankValue();
    dynamicInvestValue();
  }
});

//SLIDER

var slider = document.getElementById("slider");
var output1 = document.getElementById("yearValue1");
var output2 = document.getElementById("yearValue2");

output1.innerHTML = slider.value;
output2.innerHTML = slider.value;

minusIcon.addEventListener("click", () => {
  let sliderValue = parseInt(output2.innerHTML);
  if (sliderValue > 1) {
    output2.innerHTML = (sliderValue - 1).toString();
    slider.value = sliderValue - 1;
    dynamicInvestValue();
    dynamicBankValue();
    updateSliderBackground();
  }
});

plusIcon.addEventListener("click", () => {
  let sliderValue = parseInt(output2.innerHTML);
  if (sliderValue < 30) {
    output2.innerHTML = (sliderValue + 1).toString();
    slider.value = sliderValue + 1;
    dynamicInvestValue();
    dynamicBankValue();
    updateSliderBackground();
  }
});

function updateSliderBackground() {
  var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(90deg, rgb(206,77,99) ${value}%, rgb(229,229,229) ${value}%)`;
}

slider.oninput = function () {
  output1.innerHTML = this.value;
  output2.innerHTML = this.value;
  dynamicInvestValue();
  dynamicBankValue();
  updateSliderBackground();
};

// Chart initialization
const data = {
  labels: Array.from({ length: 30 }, (_, i) => `Year ${i + 1}`),
  datasets: [
    {
      label: 'bank',
      data: Array.from({ length: 30 }, (_, i) => 0),
      backgroundColor: '#323150',
      borderColor: 'rgba(255, 26, 104, 1)',
      borderWidth: 0,
      stack: 'Stack 0',
    },
    {
      label: 'investment',
      data: Array.from({ length: 30 }, (_, i) => 0),
      backgroundColor: '#ce4d63',
      borderColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 0,
      stack: 'Stack 0',
    },
  ],
};

const config = {
  type: 'bar',
  data: data,
  options: {
    plugins: {
      tooltip: {
        enabled: false,
      },
       legend: {
        display: false, // Remove the legend (top labels and color squares)
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,

        },
        ticks: {
          display: false, // Remove the x-axis labels
        },
        zeroLineBorderDash: [], 
        display: false,
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false, // Remove the x-axis labels
        },
        
        zeroLineBorderDash: [], 
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: 0, // Remove any lines in the dataset
      },
    },
    layout: {
      padding: {
        bottom: 0, // Remove padding at the bottom to hide year labels
      },
    },
  },
};

const myChart = new Chart(document.getElementById('myChart'), config);

// Call updateChartData() initially and update the chart
updateChart();
