/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const utils = require ("./utils");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	
	app.get("/ping", (req, res) => res.send("pong " + Date.now()));

	app.post("/hook", (req, res) => {
		
		const contact_id = req.body.contacts.add[0].id;
		const birthday_id = 467121; //id поля "День рождения"
		const current_year = (new Date()).getFullYear();
		const current_month = (new Date()).getMonth();
		const current_day = (new Date()).getDate();
		var customer_age;
		

		api.getContact(contact_id).then(response => {

			const birthday_day = (new Date(utils.getFieldValue(response.custom_fields_values, birthday_id) * 1000)).getDate();
			const birthday_month = (new Date(utils.getFieldValue(response.custom_fields_values, birthday_id) * 1000)).getMonth();
			const birthday_year = (new Date(utils.getFieldValue(response.custom_fields_values, birthday_id) * 1000)).getFullYear();

			if (current_year - birthday_year > 0) {
					customer_age = current_year - birthday_year;
				}
			else {
				customer_age = 0;
			}

			if (current_month - birthday_month < 0 && customer_age != 0) {
						customer_age--;
			}
			else {
					if (current_month - birthday_month === 0 && current_day - birthday_day < 0 && customer_age != 0) {
							customer_age--;
					}
			}
			const customer_age_object = {
			field_id: 467125, // id поля "Возраст"
			field_name: 'Возраст',
			field_code: null,
			field_type: 'numeric',
			values: [
					{
						value: customer_age
					}
				],
			};

			response.custom_fields_values.push(customer_age_object);

			api.updateContacts(response);

			logger.debug(response.custom_fields_values)
		})
		
		
		
		res.send("OK");
	});
	
	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});
 