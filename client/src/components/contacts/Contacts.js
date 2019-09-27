import React, { Fragment, useContext, useEffect } from "react";
import { CSSTransition, TransationGroup } from "react-transition-group";
import ContactContext from "../../context/contact/contactContext";
import ContactItem from "./ContactItem";
import Spinner from "../layout/Spinner";

const Contacts = () => {
	const contactContext = useContext(ContactContext);

	const { contacts, filtered, getContact, loading } = contactContext;

	useEffect(() => {
		getContact();
		// eslint-disable-next-line
	}, []);

	if (contacts !== null && contacts.length === 0 && !loading) {
		return <h4>Please add a contact</h4>;
	}
	return (
		<Fragment>
			{contacts !== null && !loading ? (
				filtered !== null ? (
					filtered.map(contact => (
						<ContactItem key={contact._id} contact={contact} />
					))
				) : (
					contacts.map(contact => (
						<ContactItem key={contact._id} contact={contact} />
					))
				)
			) : (
				<Spinner />
			)}
		</Fragment>
	);
};

export default Contacts;
