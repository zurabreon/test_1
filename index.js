/**
 * Основной модуль приложения - точка входа. 
 */

const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const utils = require("./utils");
const {calculationAge} = require("./calculationAge");

const app = express();

const BIRTHDAY_ID = 467121; //id поля "День рождения"
const AGE_ID = 467125; // id поля "Возраст"


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken();

app.get("/ping", (req, res) => res.send("pong " + Date.now()));

app.post("/hook", async (req, res) => {
	
	const [{id:contactId}] = req.body.contacts.add;

	const contact = await api.getContact(contactId);

	const birthday = utils.getFieldValue(contact.custom_fields_values, BIRTHDAY_ID);

	console.log(birthday);

	const updatedContactField = utils.makeField(AGE_ID, calculationAge(birthday));
	
	if (updatedContactField) {
		const updateContactValues = {
			id: contact.id,
			custom_fields_values: [updatedContactField] 
		
		};

		await api.updateContacts(updateContactValues);

		res.status(200).send({message: 'OK'});
		return;
	}

	logger.error('Field is not defined', updatedContactField);
	
	res.status(400).send({message: 'Bad request'});
});

app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));