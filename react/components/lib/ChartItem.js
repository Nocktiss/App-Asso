import React, { useMemo } from "react";
import { subMonths, isBefore } from "date-fns";
import { dateFormat, parseISO } from "../../config/utils";
import { DATE_FORMAT } from "../../config/_constants";
import { BarChart } from "react-native-chart-kit";

const ChartItem = ({ data, x, y, type, dimensions }) => {
  const chartData = useMemo(() => {
    const dateNow = new Date();
    const stats =
      data.length > 0
        ? data
            .sort((a, b) => isBefore(parseISO(a[x]), parseISO(b[x])))
            .map(item => {
              item[y] = parseFloat(item[y]);
              return item;
            })
        : [
            { date: dateFormat(subMonths(dateNow, 2), DATE_FORMAT), value: 8 },
            { date: dateFormat(subMonths(dateNow, 1), DATE_FORMAT), value: 12 },
            { date: dateFormat(dateNow, DATE_FORMAT), value: 14 },
          ];

    return {
      datasets: [
        {
          data: stats.map(item => ({ y: item[y] })),
        },
      ],
      labels: stats.map(item => item[x]),
    };
  }, [data, x, y]);

  switch (type) {
    case "bar":
      return (
        <BarChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={dimensions.width}
          height={dimensions.height}
          withVerticalLabels
          withHorizontalLabels
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 20,
            },
          }}
        />
      );
  }
};

export default ChartItem;
