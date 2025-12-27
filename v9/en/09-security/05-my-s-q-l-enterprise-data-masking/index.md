## 8.5 MySQL Enterprise Data Masking

8.5.1 Data-Masking Components Versus the Data-Masking Plugin

8.5.2 MySQL Enterprise Data Masking Components

8.5.3 MySQL Enterprise Data Masking Plugin

Note

MySQL Enterprise Data Masking is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

Note

This feature was known previously as “MySQL Enterprise Data Masking and De-Identification”.

MySQL Enterprise Data Masking provides the following data masking and de-identification capabilities:

* Transformation of existing data to mask it and remove identifying characteristics, such as changing all digits of a credit card number but the last four to `'X'` characters.

* Generation of random data, such as email addresses and payment card numbers.

* Substitution of data by data from dictionaries stored in the database. The dictionaries are easily replicated in a standard way. Administration is restricted to authorized users who are granted special privileges so that only they can create and modify the dictionaries.

Note

MySQL Enterprise Data Masking was implemented originally in MySQL as a plugin library. As of MySQL 9.5, MySQL Enterprise Edition also provides components to access data masking and de-identification capabilities. For information about the similarities and differences, see Table 8.46, “Comparison Between Data-Masking Components and Plugin Elements”.

If you are using MySQL Enterprise Data Masking for the first time, consider installing the components for access to the ongoing enhancements only available with component infrastructure.

The way that applications use these capabilities depends on the purpose for which the data is used and who accesses it:

* Applications that use sensitive data may protect it by performing data masking and permitting use of partially masked data for client identification. Example: A call center may ask for clients to provide their last four Social Security Number digits.

* Applications that require properly formatted data, but not necessarily the original data, can synthesize sample data. Example: An application developer who is testing data validators but has no access to original data may synthesize random data with the same format.

* Applications that must substitute a real name with a dictionary term to protect to protect sensitive information, but still provide realistic content to application users. Example: A user in training who is restricted from viewing addresses gets a random term from dictionary `city names` instead of the real city name. A variant of this scenario may be that the real city name is replaced only if it exists in `usa_city_names`.

Example 1:

Medical research facilities can hold patient data that comprises a mix of personal and medical data. This may include genetic sequences (long strings), test results stored in JSON format, and other data types. Although the data may be used mostly by automated analysis software, access to genome data or test results of particular patients is still possible. In such cases, data masking should be used to render this information not personally identifiable.

Example 2:

A credit card processor company provides a set of services using sensitive data, such as:

* Processing a large number of financial transactions per second.
* Storing a large amount of transaction-related data.
* Protecting transaction-related data with strict requirements for personal data.

* Handling client complaints about transactions using reversible or partially masked data.

A typical transaction may include many types of sensitive information, including:

* Credit card number.
* Transaction type and amount.
* Merchant type.
* Transaction cryptogram (to confirm transaction legitimacy).
* Geolocation of GPS-equipped terminal (for fraud detection).

Those types of information may then be joined within a bank or other card-issuing financial institution with client personal data, such as:

* Full client name (either person or company).
* Address.
* Date of birth.
* Social Security number.
* Email address.
* Phone number.

Various employee roles within both the card processing company and the financial institution require access to that data. Some of these roles may require access only to masked data. Other roles may require access to the original data on a case-to-case basis, which is recorded in audit logs.

Masking and de-identification are core to regulatory compliance, so MySQL Enterprise Data Masking can help application developers satisfy privacy requirements:

* PCI – DSS: Payment Card Data.
* HIPAA: Privacy of Health Data, Health Information Technology for Economic and Clinical Health Act (HITECH Act).

* EU General Data Protection Directive (GDPR): Protection of Personal Data.

* Data Protection Act (UK): Protection of Personal Data.
* Sarbanes Oxley, GLBA, The USA Patriot Act, Identity Theft and Assumption Deterrence Act of 1998.

* FERPA – Student Data, NASD, CA SB1386 and AB 1950, State Data Protection Laws, Basel II.

The following sections describe the elements of MySQL Enterprise Data Masking, discuss how to install and use it, and provide reference information for its elements.
