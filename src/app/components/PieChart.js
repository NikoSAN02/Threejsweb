"use client"
// components/PieChart.js
import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const PieChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        let root = am5.Root.new(chartRef.current);

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(am5percent.PieChart.new(root, {
            innerRadius: 80,
            layout: root.verticalLayout
        }));

        let series = chart.series.push(am5percent.PieSeries.new(root, {
            valueField: "size",
            categoryField: "sector"
        }));

        series.data.setAll([
            { sector: "Agriculture", size: 6.6 },
            { sector: "Mining and Quarrying", size: 0.6 },
            { sector: "Manufacturing", size: 23.2 },
            { sector: "Electricity and Water", size: 2.2 },
            { sector: "Construction", size: 4.5 },
            { sector: "Trade (Wholesale, Retail, Motor)", size: 14.6 },
            { sector: "Transport and Communication", size: 9.3 },
            { sector: "Finance, real estate and business services", size: 22.5 }
        ]);

        series.appear(1000, 100);

        series.slices.template.set("tooltipText", "{category}: {value}%");
        series.slices.template.states.create("hover", {
            scale: 1.1,
            strokeWidth: 5,
            stroke: am5.color(0xffffff)
        });

        return () => {
            root.dispose();
        };
    }, []);

    return <div id="chartdiv" style={{ width: "100%", height: "500px" }} ref={chartRef}></div>;
};

export default PieChart;

