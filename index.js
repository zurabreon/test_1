/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const utils = require ("./utils");

const app = express();

const MILLISENCODS = 1000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	
	app.get("/ping", (req, res) => res.send("pong " + Date.now()));

	app.post("/hook", (req, res) => {
		
		const contactId = req.body.contacts.add[0].id;

		const birthdayId = 467121; //id поля "День рождения"
		const ageId = 467125; // id поля "Возраст"

		const currentYear = (new Date()).getFullYear();
		const currentMonth = (new Date()).getMonth();
		const currentDay = (new Date()).getDate();

		var customerAge;
		

		api.getContact(contactId).then(response => {

			const birthday = new Date(utils.getFieldValue(response.custom_fields_values, birthdayId) * MILLISENCODS);

			const birthdayDay = (birthday).getDate();
			const birthdayMonth = (birthday).getMonth();
			const birthdayYear = (birthday).getFullYear();

			if (currentYear - birthdayYear > 0) {
				customerAge = currentYear - birthdayYear;
				}
			else {
				customerAge = 0;
			}

			if (currentMonth - birthdayMonth < 0 && customerAge != 0) {
				customerAge--;
			}
			else {
					if (currentMonth - birthdayMonth === 0 && currentDay - birthdayDay < 0 && customerAge != 0) {
						customerAge--;
					}
			}
			const customerAgeObject = {
			field_id: ageId, 
			field_name: 'Возраст',
			field_code: null,
			field_type: 'numeric',
			values: [
						{
							value: customerAge
						}
				],
			};

			response.custom_fields_values.push(customerAgeObject);

			api.updateContacts(response);

			logger.debug(response.custom_fields_values)
		})
		
		
		
		res.send("OK");
	});
	
	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});
 