const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Contact = require("../models/contacts");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
	try {
		const contacts = await Contact.find({ user: req.user.id }).sort({
			date: -1
		});
		res.json(contacts);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server errror");
	}
});

router.post(
	"/",
	[
		auth,
		[
			check("name", " Name is required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, phone, type } = req.body;
		try {
			const newContact = new Contact({
				name,
				email,
				phone,
				type,
				user: req.user.id
			});

			const contact = await newContact.save();
			res.json(contact);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server errror");
		}
	}
);
///update
router.put("/:id", auth, async (req, res) => {
	const { name, email, phone, type } = req.body;

	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;

	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) return res.status(404).json({ mag: "contact not found" });

		//make sure user makes changes
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ mag: "not authorised" });
		}
		contact = await Contact.findByIdAndUpdate(
			req.params.id,
			{ $set: contactFields },
			{ new: true }
		);
		res.json(contact);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server errror");
	}
});

router.delete("/:id", auth, async (req, res) => {
	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) return res.status(404).json({ mag: "contact not found" });

		//make sure user makes changes
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ mag: "not authorised" });
		}
		await Contact.findOneAndRemove(req.params.id);

		res.json({ msg: "contact removed" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server errror");
	}
});
module.exports = router;
