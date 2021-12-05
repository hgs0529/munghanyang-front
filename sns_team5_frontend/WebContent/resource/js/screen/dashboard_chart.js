$(document).ready(function () {
  const dailysales = () => {
    $.ajax({
      url: "http://localhost:3000/admin/dashboard/chart/sales",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      success: function (data) {
        console.log(data);
        let now = new Date();
        new Chart($("#dailysales"), {
          type: "line",
          data: {
            labels: [
              moment(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)).format(
                "MM/DD"
              ),
              moment(new Date(now.getTime() - 1000 * 60 * 60 * 24)).format(
                "MM/DD"
              ),
              moment(now).format("MM/DD"),
            ],
            datasets: [
              {
                data: [data.twodays, data.yesterday, data.now],
                borderColor: "rgba(252, 206, 0, 1)",
                borderCapStyle: "round",
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            legend: {
              display: false,
              labels: {
                boxWidth: 0,
              },
            },
            scales: {
              xAxes: [
                {
                  ticks: { fontColor: "rgba(136, 152, 170, 1)", fontSize: 13 },
                  gridLines: { display: false },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: "rgba(136, 152, 170, 1)",
                    fontSize: 13,
                    stepSize: 5,
                  },
                },
              ],
            },
          },
        });
      },
      error: function () {
        alert("error:sales");
      },
    });
  };

  const totalorder = () => {
    $.ajax({
      url: "http://localhost:3000/admin/dashboard/chart/order",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      success: function (data) {},
    });
  };

  dailysales();
});
