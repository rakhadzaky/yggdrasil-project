import { Layout } from 'antd';
import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"
import SideBar from "../Layout/sidebar"
import PropTypes from 'prop-types';

const { Header, Sider, Content } = Layout;

const CompleteLayout = (pageContent) => {
  return (
    <Layout>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />
            <HeaderBar />
        </Header>
        <Content style={{ padding: '0 50px' }}>
            <Layout style={{ padding: '24px 0'}}>
                <Sider width={200} theme='light'>
                    <SideBar />
                </Sider>
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    {pageContent.children}
                </Content>
            </Layout>
        </Content>
        <FooterBar />
    </Layout>
  )
}

CompleteLayout.propTypes = {
    pageContent: PropTypes.any,
}

export default CompleteLayout