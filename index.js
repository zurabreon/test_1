/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const utils = require ("./utils");

const app = express();

const MILLISECONDS_PER_SECOND = 1000;

const birthdayId = 467121; //id поля "День рождения"
const ageId = 467125; // id поля "Возраст"


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	
	app.get("/ping", (req, res) => res.send("pong " + Date.now()));

	app.post("/hook", async (req, res) => {
		
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth();
		const currentDay = new Date().getDate();

		console.log(req.body);
		console.log(req.body.contacts);
		
		const [{id:contactId}] = req.body.contacts.add;

		let customerAge = 0;

		const contact = await api.getContact(contactId);

		const birthday = new Date(utils.getFieldValue(contact.custom_fields_values, birthdayId) * MILLISECONDS_PER_SECOND);

		console.log(contact.custom_fields_values);

		const birthdayDay = birthday.getDate();
		const birthdayMonth = birthday.getMonth();
		const birthdayYear = birthday.getFullYear();

		if (currentYear - birthdayYear > 0) {
			customerAge = currentYear - birthdayYear;
		}

		if (currentMonth - birthdayMonth < 0 && customerAge !== 0) {
			customerAge--;
		}
		else {
			if (currentMonth - birthdayMonth === 0 && currentDay - birthdayDay < 0 && customerAge !== 0) {
				customerAge--;
			}
		}

		const updatedContactField = utils.makeField(ageId, customerAge)

		const updateContactValues = {
			id: contact.id,
			custom_fields_values: [updatedContactField] 
		
		};

		api.updateContacts(updateContactValues);

		logger.debug(contact.custom_fields_values);
		
		res.send("OK");
		
	});
	
	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});
 