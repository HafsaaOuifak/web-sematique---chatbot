curl -X POST -H "Content-Type: application/json" -d '{
"setting_type":"greeting",
  "greeting":[
              {
                "locale":"default",
                "text":"hello {{user_first_name}}. Start the conversation and ask me about geography !"
              }
              ]

}' "https://graph.facebook.com/v3.2/me/messenger_profile?access_token=EAAfwLILFP6MBANgTa2DsrlrpEFJWbzJYqZA2vp8shaM5lBrI3eVleZAegIV4zZCoUps656k2nLgXMhhebZAGbrRdzjEtJ5NCnQupuRx18irlGh6BsfDCcgX3bb90A5vkUZB9li4BvBtQ4SZALMESfPH6QRvpI48F6PM2iuKIgBuQZDZD"
