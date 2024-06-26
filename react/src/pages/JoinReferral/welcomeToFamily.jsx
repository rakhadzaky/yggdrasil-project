import { Typography, Button } from "antd"

function WelcomeToFamily() {
    const { Title } = Typography
    const BASE_URL = location.protocol + '//' + location.host;

    return (
        <div style={{textAlign: "center"}}>
            <img alt="welcome" style={{height: 256}} src={import.meta.env.VITE_APP_BASE_URL_BACKEND+"/storage/assets/undraw_referral_re_0aji.svg"} />
            <Title level={3} style={{marginTop: "24px"}}>Thank you for the verification and Welcome to the Family</Title>
            <Button type="link" href={`${BASE_URL}/dashboard`}>Continue to Dashboard</Button>
        </div>
    )
}

export default WelcomeToFamily