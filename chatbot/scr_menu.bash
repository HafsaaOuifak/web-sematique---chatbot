 curl  -X POST -H "Content-Type: application/json" -d '{
  "persistent_menu":[
    {
      "locale":"default",
      "composer_input_disabled": true,
      "call_to_actions":[

            {
              "title":"Home",
              "type":"postback",
              "payload":"Home"
            },
            {
              "type":"web_url",
              "title":"Developper mode",
              "url":"https://protected-sea-56253.herokuapp.com/",
              "webview_height_ratio":"full"
            }

      ]
    }
	,
      {
         "locale":"en_US",
         "composer_input_disabled":false
      }
  ]
}' "https://graph.facebook.com/v3.2/me/messenger_profile?access_token=EAAfwLILFP6MBANgTa2DsrlrpEFJWbzJYqZA2vp8shaM5lBrI3eVleZAegIV4zZCoUps656k2nLgXMhhebZAGbrRdzjEtJ5NCnQupuRx18irlGh6BsfDCcgX3bb90A5vkUZB9li4BvBtQ4SZALMESfPH6QRvpI48F6PM2iuKIgBuQZDZD"
