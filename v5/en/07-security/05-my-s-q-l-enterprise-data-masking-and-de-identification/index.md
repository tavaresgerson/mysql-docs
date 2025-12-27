## 6.5 MySQL Enterprise Data Masking and De-Identification

[6.5.1 MySQL Enterprise Data Masking and De-Identification Elements](data-masking-elements.html)

[6.5.2 Installing or Uninstalling MySQL Enterprise Data Masking and De-Identification](data-masking-installation.html)

[6.5.3 Using MySQL Enterprise Data Masking and De-Identification](data-masking-usage.html)

[6.5.4 MySQL Enterprise Data Masking and De-Identification Function Reference](data-masking-function-reference.html)

[6.5.5 MySQL Enterprise Data Masking and De-Identification Function Descriptions](data-masking-functions.html)

Note

MySQL Enterprise Data Masking and De-Identification is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, <https://www.mysql.com/products/>.

As of MySQL 5.7.24, MySQL Enterprise Edition provides data masking and de-identification capabilities:

* Transformation of existing data to mask it and remove identifying characteristics, such as changing all digits of a credit card number but the last four to `'X'` characters.

* Generation of random data, such as email addresses and payment card numbers.

The way that applications use these capabilities depends on the purpose for which the data is used and who accesses it:

* Applications that use sensitive data may protect it by performing data masking and permitting use of partially masked data for client identification. Example: A call center may ask for clients to provide their last four Social Security number digits.

* Applications that require properly formatted data, but not necessarily the original data, can synthesize sample data. Example: An application developer who is testing data validators but has no access to original data may synthesize random data with the same format.

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

Masking and de-identification are core to regulatory compliance, so MySQL Enterprise Data Masking and De-Identification can help application developers satisfy privacy requirements:

* PCI – DSS: Payment Card Data.
* HIPAA: Privacy of Health Data, Health Information Technology for Economic and Clinical Health Act (HITECH Act).

* EU General Data Protection Directive (GDPR): Protection of Personal Data.

* Data Protection Act (UK): Protection of Personal Data.
* Sarbanes Oxley, GLBA, The USA Patriot Act, Identity Theft and Assumption Deterrence Act of 1998.

* FERPA – Student Data, NASD, CA SB1386 and AB 1950, State Data Protection Laws, Basel II.

The following sections describe the elements of MySQL Enterprise Data Masking and De-Identification, discuss how to install and use it, and provide reference information for its elements.
