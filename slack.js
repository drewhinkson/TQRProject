const axios = require('axios');
const zendeskAPI = require('./zendesk');

const postTqr = async (req, res) => {
    const payload = JSON.parse(req.body.payload)
    const { trigger_id } = payload

    if (!trigger_id) {
        console.error('Invalid trigger_id received');
        res.status(400).send('Invalid trigger_id');
        return;
    }

    const modal = {
        "trigger_id": trigger_id,
        "view": {
            "type": "modal",
            "callback_id": "review_modal",
            "title": {
                "type": "plain_text",
                "text": "Review Form",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "input",
                    "block_id": "ticket_url",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "plain_text_input-action"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Ticket URL:",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "reviewer",
                    "element": {
                        "type": "users_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select reviewer"
                        }
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Reviewer"
                    }
                },
                {
                    "type": "input",
                    "block_id": "review_date",
                    "element": {
                        "type": "datepicker",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date"
                        },
                        "initial_date": "1990-04-28"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Review Date"
                    }
                },
                {
                    "type": "input",
                    "block_id": "agent_reviewed",
                    "element": {
                        "type": "users_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select agent"
                        }
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Agent Reviewed"
                    }
                },
                {
                    "type": "input",
                    "block_id": "overall_accuracy",
                    "element": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select option"
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "yes"
                                },
                                "value": "yes"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "no"
                                },
                                "value": "no"
                            },
                        
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Overall Accuracy"
                    }
                },
                {
                    "type": "input",
                    "block_id": "expertise",
                    "element": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select option"
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Yes"
                                },
                                "value": "yes"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "No"
                                },
                                "value": "no"
                            },
                           
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Expertise"
                    }
                },
                {
                    "type": "input",
                    "block_id": "communication",
                    "element": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select option"
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Option 1"
                                },
                                "value": "Option1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Option 2"
                                },
                                "value": "Option2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Option 3"
                                },
                                "value": "Option3"
                            }
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Communication"
                    }
                },
                {
                    "type": "input",
                    "block_id": "process",
                    "element": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select option"
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Option 1"
                                },
                                "value": "Option1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Option 2"
                                },
                                "value": "Option2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Option 3"
                                },
                                "value": "Option3"
                            }
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Process"
                    }
                },
                {
                    "type": "input",
                    "block_id": "agent_feedback",
                    "element": {
                        "type": "plain_text_input",
                        "multiline": true,
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Enter feedback"
                        }
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "TQ: Agent Feedback"
                    }
                }
            ]
        }
        
        }


    axios.post('https://slack.com/api/views.open', modal, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        }
    })
    .then((response) => {
     
     
        res.status(200).end();
    })
    .catch((err) => {
        console.error('Error opening modal:', err.message);
        res.status(500).send('Error opening modal');
    });

 





   



    if (payload.type === 'view_submission') {
        const values = payload.view.state.values;
        let data = {};
        let userId=[]
        // Extract data from values
        Object.keys(values).forEach(key => {
            let subObject = values[key];
            let subKey = Object.keys(subObject)[0];

            if (subObject[subKey].type === 'static_select') {
                data[key] = subObject[subKey].selected_option.value;
            } else if (subObject[subKey].type === 'datepicker') {
                data[key] = subObject[subKey].selected_date;
            } else if (subObject[subKey].type === 'plain_text_input') {
                data[key] = subObject[subKey].value;
            }
            else if (subObject[subKey].type === 'users_select') {
                userId.push(subObject[subKey].selected_user);
            }
    });
    
        const zendeskTicketId = data.ticket_url.split('/').pop();
        const zendeskData = {
            'ticket': {
                'subject': 'tester',
                'status':ticket_status,
                'custom_fields': [
                    {
                        'id': 1500002745542,
                        'value': data.agent_feedback
                    },
                    {
                        'id': 1500002745522,
                        'value': data.Agent_reviewed
                    },
                    {
                        'id':1500002745522,
                        'value':`tq_accurate_${data.overall_accuracy}`
                    },
                    {
                        'id':1500002742741,
                        'value': data.reveiw_date

                    }

                ]
            }
        };


      
        try {
            const updatedTicket = await zendeskAPI.updateZendeskTicket(zendeskTicketId, zendeskData);
            console.log('Zendesk Ticket Updated:', updatedTicket);

            
            const message = `Ticket URL: ${data.ticket_url}\nTQR Expertise: ${data.expertise}\n...`; 
            
          
            await axios.post('https://slack.com/api/chat.postMessage', {
                channel: userId[1], 
                text: "hello"
            }, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                }
            });
            
         
            res.status(200).send('Zendesk ticket updated and message sent successfully');
        } catch (error) {
            
            res.status(500).send('Error processing request');
        }
    } else {
        res.status(400).send('Invalid payload type');
    }
};



module.exports = {
    postTqr,
  
};

