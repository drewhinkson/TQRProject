const axios = require('axios');

const zendeskCredentials = {
    username:process.env.ZENDESK_EMAIL,
    token: process.env.ZENDESK_API_TOKEN,
    subdomain: process.env.ZENDESK_SUBDOMAIN
};


const getZendeskTicket = async (ticketId) => {
    try {
        const response = await axios.get(`https://${zendeskCredentials.subdomain}.zendesk.com/api/v2/tickets/${ticketId}.json`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${zendeskCredentials.username}:${zendeskCredentials.token}`).toString('base64')}`
            }
        });
        console.log(response.data);
        return response.data.ticket;
        
    } catch (error) {
        console.error('Error fetching Zendesk ticket:', error.message);
        throw error;
    }
};

const updateZendeskTicket = async (ticketId, data) => {
    try {
        const response = await axios.put(`https://${zendeskCredentials.subdomain}.zendesk.com/api/v2/tickets/${ticketId}.json`, {
            ticket: data
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${zendeskCredentials.username}:${zendeskCredentials.token}`).toString('base64')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating Zendesk ticket:', error.message);
        throw error;
    }
};

module.exports = {
    getZendeskTicket,
    updateZendeskTicket
};
