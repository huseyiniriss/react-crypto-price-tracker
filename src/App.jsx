import {useEffect, useState} from 'react'
import {Col, Flex, Layout, Row, Typography} from 'antd';
import {service} from "@/lib/axios.js";
import usePriceWs from "@/hooks/usePriceWs.js";
import CurrencyTable from "@/components/CurrencyTable.jsx";

const {Header, Footer, Content} = Layout;
const {Text, Title} = Typography;

function App() {
    const [assets, setAssets] = useState([]);
    const priceWs = usePriceWs();

    useEffect(() => {
        service.get('/assets').then((response) => {
            setAssets(response.data.data);

        })
    }, []);

    useEffect(() => {
        if (priceWs) {
            setAssets(assets.map((asset) => {
                    return {
                        ...asset,
                        priceUsd: priceWs[asset.id] ? priceWs[asset.id] : asset.priceUsd,
                        className: priceWs[asset.id] ? priceWs[asset.id] > asset.priceUsd ? 'up' : 'down' : ''
                    }
                })
            )
        }
    }, [priceWs])

    return (
        <Layout>
            <Header>
                <Flex justify="center" align="center">
                    <Title level={2} style={{
                        color: 'white',
                    }}>
                        Real Time Crypto Prices
                    </Title>
                </Flex>
            </Header>
            <Content>
                <Row justify="center">
                    <Col span={18}>
                        <CurrencyTable assets={assets}/>
                    </Col>
                </Row>
            </Content>
            <Footer>
                <Flex justify="center" align="center">
                    <Text type="secondary">© 2024 CoinCap Api Example</Text>
                </Flex>
            </Footer>
        </Layout>
    )
}

export default App
