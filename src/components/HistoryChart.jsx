import React, {useEffect, useRef} from 'react';
import {Flex, Typography} from "antd";
import PropTypes from "prop-types";
import * as echarts from "echarts";

const {Title} = Typography;


const HistoryChart = ({seriesData, xAxisData}) => {
    const chartRef = React.useRef(null);
    const options = useRef();

    useEffect(() => {
        options.current = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {containLabel: true},
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    interval: 0,
                    rotate: 90,
                },
                data: xAxisData,
            },
            yAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
            },
            series: [
                {
                    data: seriesData,
                    type: 'line',
                    areaStyle: {},
                    color: '#f79621',
                }
            ]
        }
        echarts.init(chartRef.current).setOption(options.current);
    }, [xAxisData, seriesData]);

    return (
        <Flex justify="center" align="center" vertical>
            <Title level={4}>Price Chart USD (Last 24H)</Title>
            <div ref={chartRef} style={{
                width: '100%',
                height: '600px',
            }}/>
        </Flex>
    )
};

HistoryChart.propTypes = {
    seriesData: PropTypes.array.isRequired,
    xAxisData: PropTypes.array.isRequired,
};
export default HistoryChart;
