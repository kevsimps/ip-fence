import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('ip-fence')
export class ipFence extends LitElement {
    @state() agentIP = ""
    @state() match = false
    @property() approvedIP = ["127.0.0.1", "127.0.0.2", "173.38.117.821"]
    @property() team: String = "Outbound Team" //$STORE.agent.teamName
    @property() isCampaignManagementEnabled?: boolean //$STORE.agent.isCampaignManagementEnabled
    @property() accessToken: String = "" //$STORE.auth.accessToken
    @property() agentID: String = "" //$STORE.agent.agentId
    @property({ type: Number })
    @property() omitString = "Out"
    count = 0
    static styles = css`
    .modal {
    position: fixed;
    z-index: 11;
    height: 50vh;
    width:25vw;
    background: #ccc;
    left: 35%;
    top: 23%;
    padding: 2em;
}
    h1 {
    text-align: center;
}
.hidden {
    display: none;
}
.cover{
    position: fixed;
    top:0px;
    left:0px;
    z-index: 10;
    opacity: 80%;
    background: #f3f0f0;
    width:97%;
    Height:100%;
    }
    .cover2{
    position: fixed;
    bottom:0px;
    right:0px;
    z-index: 10;
    opacity: 80%;
    background: #f3f0f0;
    width:3%;
    Height:93%;
    }
    .hidden{
    display:none
    }
    `
    render() {
        return html`
        <div class=${this.team.includes(this.omitString)? ((this.match) ? "hidden" : "") : "hidden"}>
    <div class="cover"></div>
        <div class="cover2"></div>
        <div class="modal">
            <h1>Your IP address is: ${this.agentIP}</h1>
            <h2>Team "${this.team}" is not allowed to make outbound calls while not in the office.</h2>
            <h2>
            Please log into a different team or contact your supervisor.
            </h2>

            <button @click="${this.logOutAgent}">Log Out</button>
    </div>
   </div>
  `
    }

    async logOutAgent() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${this.accessToken}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "logoutReason": "bad",
            "agentId": this.agentID
        });

        const requestOptions: any = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://api.wxcc-us1.cisco.com/v1/agents/logout", requestOptions);
            const result = await response.text();
            console.log(result)
        } catch (error) {
            console.error(error);
        };
    }


    checkIP() {
        this.match = this.approvedIP.includes(this.agentIP)
    }
    async getIP() {

        const requestOptions: any = {
            method: "GET",
            redirect: "follow"
        };
        try {
            const response = await fetch("https://api64.ipify.org?format=json", requestOptions)
            const result = await response.json()
            this.agentIP = result.ip
            // console.log(response)
            this.checkIP()
        } catch (error) {
            console.log(error)
        }
    }

    connectedCallback(): void {
        super.connectedCallback()
        this.getIP()
    }

    // declare global {
    //     interface HTMLElementTagNameMap {
    //       'ip-fence': ipFence
    //     }
    //  
}
