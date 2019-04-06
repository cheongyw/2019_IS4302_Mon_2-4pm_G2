# 2019_IS4302_Mon_2-4pm_G2
Alvin Lim Wei Qiang, Cheong Yi Wei, Chua Wei Han, Ng Gin Wen


ChariChain is a Donation Blockchain Solution developed as a project for the NUS module IS4302 Blockchain and Distributed Ledger Technologies.

Charity donation drives are set up to aid various beneficiaries but the flow of funds is often left hidden and is left to interpretation by the masses. While many would like to think that the funds reached the desired targets, some are often disappointed at a discovery that would otherwise irk them - the embezzlement of donated funds.

Therefore, ChariChain Donation Blockchain Solution is built on the Hyperledger Fabric Blockchain Framework to ensure security, privacy, provenancy and immutability in the donation network. This network would allow for relevant transparency where participants would be able to keep track of the donations. In addition, there is a certification process to certify the legitimacy of charities and beneficiaries. 

The network consists of the four main types of participants: 
1) Regulator for Beneficaries and Charities
2) Beneficiary Organisation
3) Charity Organisation
4) Donors

Through this network, all of the donations and fund transfers will be recorded on the ledger and subsequently transferred in a timely and systematic manner to the intended beneficiary. Each instance of money transfer will have a unique reference code attached to it, so that the participant’s bank will be able to compare the reference code to verify that the money was actually transferred.

# Pre-Requisites
Please ensure that the environment has been set up as per the instructions in https://github.com/suenchunhui/easy-hyperledger-composer.

# Settings
- Ensure that ports 3000-3003 are mapped in the Vagrantfile, if not, edit the Vagrantfile to add the port mappings. 
- Change the directory to the folding containing the with the Vagrantfile in command prompt.
- Run ```vagrant up``` from the command prompt.

# Provisioning
- Enter the browser-based cloud9 IDE at [localhost:8181](http://localhost:8181).
- Login into the IDE using the default credentials `root` and `secret`.
- Carry on setting up by running the following commands in the console:
```
npm run setup_crypto
npm run start_fabric
npm run start_playground
```
- Next, head to the hyperledger fabric composer at [localhost:8080](http://localhost:8080) to deploy the blockchain network. 
- In the playground environment, drag and drop the Mon_2-4_G2.bna file to upload it.
- Then, setup the network-admin credentials. Select "ID and Secret" and use credentials ```admin``` and ```adminpw``` as enrolment secret.
- Deploy.
- Add the relevant participants by instantiating them on the donation network.
- Afterwhich, issue IDs for each participant.
- Then, we would be able to create a REST server that connects to each player participant. There are a total of four different types of participants in our blockchain model. Run the following in the cloud9 IDE [localhost:8181](http://localhost:8181).
1) Beneficiary which uses [localhost:3000](http://localhost:3000)
```npm run start_rest-server beneficiary@your-network 3000```
2) Donor which uses [localhost:3001](http://localhost:3001)
```npm run start_rest-server donor@your-network 3001```
3) Regulator which uses [localhost:3002](http://localhost:3002)
```npm run start_rest-server regulator@your-network 3002```
4) Charity which uses [localhost:3003](http://localhost:3003)
```npm run start_rest-server charity@your-network 3003```
- Now, download the entire repository locally, consisting of the .html documents, the server.js documents, etc. Take down the filepath.
- Next, in the command line in cloud9 IDE [localhost:8181](http://localhost:8181):
1) Change directory to the filepath from before (where server.js and the respective .html documents are located).
2) Run ```node server.js```
- [localhost:8001](http://localhost:8001) is now accessible and we can open [Login](http://localhost:8001/login.html/) to access the User Interface of the blockchain model.

# User Manual

Go to http://localhost:8001/login.html

Under Username, enter either:
- "donor" to login as donor.
- "charity" to login as charity.
- "beneficiary" to login as beneficiary.
- "regulator" to login as regulator.

After logging in, participants will be directed to different servers according to their role. The following provides a flow of how to navigate through the User Interface and test out the donation blockchain.
### 1) Regulator
- Through this network, the regulator serves to certify beneficiaries or charities.
- In their [Home Page](http://localhost:3002/regulator-requests.html/), the regulator would be able to view the pending requests from charities and beneficiaries who are waiting to be certified.
- The sample jquery 'document ready' function below shows an example of how a datatable can be utilised to display a list of charityRequests that has pending statuses. By using the AJAX function within datatables to pull from a URL, data are pulled from the REST-server. It also only shows charityRequests that have a 'PENDING' status i.e. 'CERTIFIED' or 'DENIED' charityRequests would not be seen.
```
    <script type="text/javascript">
    // create charityRequest table
    $(document).ready(() => {
        $('#charityRequest-table').DataTable( {
          "ajax": {
            url: "/hlf2/api/org.hyperledger_composer.project.CharityRequest",
            dataSrc: ""
          },
          columns: [
            { title:"Charity Name", data: "description" },
            { title:"Request ID", data: "requestId"},
            //{ title:"Request Date", data: "requestDate" }, 
            {
                title: "Approve",
                "render": function (data, type, row, meta) {
                    let htmlOutput = "<button type=\"submit\" class=\"btn btn-primary\" onclick=approveCharity(" + row.requestId + ")>Approve</button>";
                    $('#container').html(htmlOutput);
                    return htmlOutput;
                }
            },
            {
                title: "Reject",
                "render": function ( data, type, row, meta ) {
                    let htmlOutput = "<button type=\"submit\" class=\"btn btn-primary\" onclick=rejectCharity(" + row.requestId + ")>Reject</button>";
                    $('#container').html(htmlOutput);
                    return htmlOutput;
                }
            }
          ],
          "rowCallback": function(nRow, aData, iDisplayIndex) {
            if (aData.status != 'PENDING') {
                $(nRow).hide();
                // console.log(aData);
            }
            return nRow;
          }
        });
    });
    </script>
```
- The above function has to be accompanied by the following:
```
    <div class="table-responsive">
        <table id = "charityRequest-table" class="table table-striped tm-table-striped-even mt-3">
        </table>
    </div>
```
- Regulators would be able to click on the Accept or Reject button to certify or deny a certification request. This was implemented using the following function where the button click provides information on the table row and thus the requestId can be parsed into the ApproveCharityRequest transaction in the hyperledger composer to certify the charity.
```
    <script type="text/javascript">
    function approveCharity(requestId) {
        var req = "org.hyperledger_composer.project.CharityRequest#" + requestId.toString();
        var params = {
            type: "POST",
            data: {
                request: req
            },
            success: function (result) {
                alert('Approve Successful!');
                setTimeout(
                    function() {
                        location.reload();
                    }, 0001);
            },
            error: function (result) {
                alert('Attempt to Approve Failed!');
            }
        };
        params.url = "/hlf2/api/org.hyperledger_composer.project.ApproveCharityRequest";
        $.ajax(params);
    };
```
- Next, the regulator would be able to see the [List of Certified Beneficiaries](http://localhost:8001/regulator-beneficiaries-list.html/) and [List of Certified Charities](http://localhost:8001/regulator-charities-list.html/) by clicking on the respective tab in the navigation bar.
- The regulator would also be able to view the relevant [Beneficiary Profile](http://localhost:8001/regulator-beneficiary-profile.html/) or [Charity Profile](http://localhost:8001/regulator-charity-profile.html/) by clicking the "View" hyperlink.
- To view the regulator's own profile, the regulator can click on [My Profile](http://localhost:8001/regulator-profile.html/) in the navigation panel.
### 2) Beneficiary Organisation
- Beneficiaries that are not certified would be prompted to [Request to be Certified](http://localhost:8001/beneficiary-not-certified.html/) when they [First Login](http://localhost:8001/beneficiary-request-certify.html/).
- After they have been certified, they would be able to see the [List of Fundraising Events](http://localhost:8001/beneficiary-fund-event-listings.html/) that they would be benefiting from. They would be able to see the Target Amount, the Amount Collected, the Amount that has been Transferred to them from the Charity, the Deadline as well as Status of the Fundraising Event. This gives the beneficiary information on the progress of the event as well as the whereabouts of the donations.
- On this same page, the beneficiary can also opt to "Request a New Fundraising Event". Clicking this button, would direct the beneficiary to [Request Fundraising Event](http://localhost:8001/beneficiary-request-fund-event.html/) where the beneficiaries can fill in the description of the fundraising event requested and the designated charity to hold this event. This request is subjected to the acceptance or rejection at the charity's discretionary.
- The beneficiary would also be able to view a [List of Pending Funds Transfer to Confirm](http://localhost:8001/beneficiary-pending-transfer.html/). When charities transfer the total amount of funds collected from the fundraising event to the beneficiary, the beneficiary would have to confirm that they have received these funds by checking their statements off-blockchain. Hence, there would be a list of pending funds transfer to confirm. If the beneficiary has checked that they have received, they would have to confirm this by clicking the "Confirm Receipt" button. This would direct them to [Confirm Fund Transfer](http://localhost:8001/beneficiary-confirm-transfer.html/) where the beneficiary could double check the details and do a final confirmation. This step would change the status of Transfer.
- Similar to the regulator, to view the beneficiary's own profile, the beneficiary can click on [My Profile](http://localhost:8001/beneficiary-profile.html/) in the navigation panel.
### 3) Charity Organisation
- Charities that are not certified would be prompted to [Request to be Certified](http://localhost:8001/charity-not-certified.html/) when they [First Login](http://localhost:8001/charity-request-certify.html/).
- After they have been certified, they would be able to see the [List of Fundraising Events](http://localhost:8001/charity-fund-event-listings.html/) that they have organised. They would be able to see the Target Amount, the Amount Collected, the Amount that has been Transferred to the Beneficiary from them, the Deadline as well as Status of the Fundraising Event. This gives the charity information on the progress of the event.
- On this same page, the charity can also opt to "Request a New Fundraising Event". Clicking this button, would direct the beneficiary to [Existing Fundraising Requests from Beneficiaries](http://localhost:8001/charity-request.html/) where they would be able to [Accept or Reject the Request](http://localhost:8001/charity-accept-reject-request.html/). 
- If they Accept, they will be directed to [Confirm the Creation of Fundraising Event](http://localhost:8001/charity-create-new-event.html/) where the charities can confirm the details and start the event.
- The charity would have the ability to [Amend the Fundraising Event Details](http://localhost:8001/charity-update-fund-event-listings.html/) when needed to.
- Also, on the [List of Fundraising Events](http://localhost:8001/charity-fund-event-listings.html/) page, the charity would be able to make a transfer of the collected funds to the beneficiary. This can be done by clicking "Transfer" which would direct the charity to [Make Transfer](http://localhost:8001/charity-confirm-transfer-funds.html/).
- The charity would be able to see a [List of Fund Transfers Made Pending Confirmation from Beneficiary](http://localhost:8001/charity-transfer-funds.html/).
- The charity would also be able to view a [List of Pending Donations to Confirm](http://localhost:8001/charity-pending-donations.html/). When donors donate to the fundraising event, the charity would have to confirm that they have received these funds by checking their statements off-blockchain. Hence, there would be a list of pending donations to confirm. If the charity has checked that they have received, they would have to confirm this by clicking the "Confirm Receipt" button. This would direct them to [Confirm Donation](http://localhost:8001/charity-confirm-donations.html/) where the charity could double check the details and do a final confirmation. This step would change the status of Donation.
- To view the charity's own profile, the charity can click on [My Profile](http://localhost:8001/charity-profile.html/) in the navigation panel.
### 4) Donor
- The donor would be able to see the [List of Fundraising Events](http://localhost:8001/donor-fund-event-listings.html/) that they would be able to donate to. They would be able to see the Target Amount, the Amount Collected, the Amount that has been Transferred to the Beneficiary from them, the Deadline as well as Status of the Fundraising Event. This gives the donor information on the progress of the event as well as the whereabouts of the donations.
- On this same page, the donor can [Make a Donation](http://localhost:8001/donor-donate-fund-event.html/). They would have to make the donation off block-chain and include the Reference Code and the Donation Amount as inputs.
- The donor would be able to see a [List of Donations Made](http://localhost:8001/donor-my-donations.html/) which has the status of their donation. This thus informs the donor about the receipt of their donations.
- To view the donor's own profile, the donor can click on [My Profile](http://localhost:8001/donor-profile.html/) in the navigation panel.

