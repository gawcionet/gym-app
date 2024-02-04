import { onSnapshot, collection, query } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseInit.js";
import { onMounted } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "AnalysisView",
  data() {
    return {
      selectedExercise: "overall",
      selectedGraph: "volume",
      exercises: [],
      chartData: [],
    };
  },
  mounted() {
    this.selectedExercise = "overall";
    this.selectedGraph = "volume";
    this.fetchExercises();
  },
  methods: {
    async fetchExercises() {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const trainingHistoryRef = collection(
                db,
                "users",
                currentUser.uid,
                "trainingHistory"
            );
            const q = query(trainingHistoryRef);
            const unsubscribe = onSnapshot(q, (snapshot) => {
                // ... pobieranie i przetwarzanie danych ...
                this.chartData = fetchedData;
        
                // Opóźnienie
                setTimeout(() => {
                    this.updateChartData();
                }, 100);
            });
        
            onMounted(() => {
                unsubscribe();
            });
        }
    },      
    updateChartData() {
        if (this.selectedExercise === "overall") {
          // ... obliczenia i formatowanie danych dla wykresu ogólnego ...
          this.renderChart(labels, values);
        } else {
          // ... filtracja i przetwarzanie danych dla wykresu konkretnego ćwiczenia ...
          this.renderChart(labels, values);
        }
    },      
    getChartDataValue(exercise) {
      switch (this.selectedGraph) {
        case "volume":
          return exercise.sets
            ? exercise.sets.reduce((acc, set) => {
                const weight = parseFloat(set.weight) || 0;
                const reps = parseInt(set.reps) || 0;
                return acc + weight * reps;
              }, 0)
            : 0;
        case "sets":
          return exercise.sets ? exercise.sets.length : 0;
        case "reps":
          return exercise.sets
            ? exercise.sets.reduce((acc, set) => acc + (parseInt(set.reps) || 0), 0)
            : 0;
        default:
          return 0;
      }
    }
  },
  created() {
    this.renderChart = (labels, values) => {
      const lineChart = this.$refs.lineChart;
      if (!lineChart) {
        return;
      }

      const ctx = lineChart.getContext("2d");

      if (lineChart.chart) {
        lineChart.chart.destroy();
      }

      const unitLabels = {
        volume: "kg",
        sets: "sets",
        reps: "reps",
      };

      lineChart.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: this.selectedExercise,
              data: values,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 3,
              },
            },
            y: {
              ticks: {
                maxTicksLimit: 6,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const datasetLabel = context.dataset.label || "";
                  const dataValue = context.parsed.y || 0;
                  const graphType = this.selectedGraph;

                  let tooltipLabel = "";
                  if (graphType === "volume") {
                    tooltipLabel = `${dataValue} ${unitLabels.volume}`;
                  } else if (graphType === "sets") {
                    tooltipLabel = `${dataValue} ${unitLabels.sets}`;
                  } else if (graphType === "reps") {
                    tooltipLabel = `${dataValue} ${unitLabels.reps}`;
                  }

                  return `${tooltipLabel}`;
                },
              },
            },
            legend: {
              display: false,
            },
          },
        },
      });
    };
  },
};
