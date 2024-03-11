import {Flex, Image, Table, Typography} from "antd";
import PropTypes from "prop-types";
import {currencyFormatter} from "@/utils/helpers.js";
import styles from './CurrencyTable.module.css';
import {service} from "@/lib/axios.js";
import {useState} from "react";
import moment from "moment";
import HistoryChart from "@/components/HistoryChart.jsx";

const {Text} = Typography;

const columns = [
    Table.EXPAND_COLUMN,
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        sorter: (a, b) => a.rank - b.rank,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
            <Flex gap={8} align="center">
                <Image
                    width={24}
                    height={24}
                    src={`https://assets.coincap.io/assets/icons/${record.symbol.toLowerCase()}@2x.png`}
                />
                <Flex vertical>
                    <Text>{record.name}</Text>
                    <Text type="secondary">{record.symbol}</Text>
                </Flex>
            </Flex>
        )
    },
    {
        title: 'Price',
        dataIndex: 'priceUsd',
        key: 'priceUsd',
        render: (text, record) => currencyFormatter(record.priceUsd),
        sorter: (a, b) => a.priceUsd - b.priceUsd,
    },
    {
        title: 'Market Cap',
        dataIndex: 'marketCapUsd',
        key: 'marketCapUsd',
        render: (text, record) => Intl.NumberFormat('en', {
            notation: 'compact',
            style: 'currency', currency: 'USD', maximumSignificantDigits: 3,
        }).format(record.marketCapUsd),
        sorter: (a, b) => a.marketCapUsd - b.marketCapUsd,
    },
    {
        title: 'WWAP (24H)',
        dataIndex: 'vwap24Hr',
        key: 'vwap24Hr',
        render: (text, record) => currencyFormatter(record.vwap24Hr),
    },
    {
        title: 'SUPPLY',
        dataIndex: 'supply',
        key: 'supply',
        render: (text, record) => Intl.NumberFormat('en', {
            notation: 'compact',
            style: 'currency', currency: 'USD', maximumSignificantDigits: 4,
        }).format(record.supply)
    },
    {
        title: 'Volume (24H)',
        dataIndex: 'volumeUsd24Hr',
        key: 'volumeUsd24Hr',
        render: (text, record) => Intl.NumberFormat('en', {
            notation: 'compact',
            style: 'currency', currency: 'USD', maximumSignificantDigits: 4,
        }).format(record.volumeUsd24Hr)
    },
    {
        title: 'Change (24H)',
        dataIndex: 'changePercent24Hr',
        key: 'changePercent24Hr',
        render: (text, record) => Intl.NumberFormat('en', {
            style: 'percent', maximumSignificantDigits: 3,
        }).format(record.changePercent24Hr / 100),
        sorter: (a, b) => a.changePercent24Hr - b.changePercent24Hr,
    },
];

const CurrencyTable = (props) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [data, setData] = useState({
        seriesData: [],
        xAxisData: [],
    })
    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.id]);
        } else {
            setExpandedRowKeys([]);
        }
        const hour = Number(moment().format('H'));
        const today = Number(moment().add(-1, 'days').set({
            hour: hour,
            minute: 0,
            second: 0,
            millisecond: 0
        }).format('x'));
        service.get(`/assets/${record.id}/history?interval=h1`).then((response) => {
            const data = response.data.data.filter((item) => item.time >= today);
            setData({
                seriesData: data.map((item) => Number(item.priceUsd)),
                xAxisData: data.map((item) => moment(item.time).format('ddd, HH:mm')),
            })
        });
    }

    return (
        <Table
            dataSource={props.assets}
            columns={columns}
            pagination={{
                position: ['bottomCenter'],
                defaultPageSize: 12,
                showSizeChanger: true,
            }}
            size="small"
            rowKey={(record) => record.id}
            rowClassName={(record) => styles[record.className]}
            className={styles['currency-table']}
            expandable={{
                expandedRowRender: () => (
                    <HistoryChart seriesData={data.seriesData} xAxisData={data.xAxisData}/>
                ),
                onExpand: onExpand,
                expandedRowKeys: expandedRowKeys,
            }}
        />
    );
};

CurrencyTable.propTypes = {
    assets: PropTypes.array.isRequired,
}

export default CurrencyTable;
