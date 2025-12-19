#### 2.1.4.3 Signature Checking Using Gpg4win for Windows

The  Section 2.1.4.2, “Signature Checking Using GnuPG” section describes how to verify MySQL downloads using GPG. That guide also applies to Microsoft Windows, but another option is to use a GUI tool like  Gpg4win. You may use a different tool but our examples are based on Gpg4win, and utilize its bundled `Kleopatra` GUI.

Download and install Gpg4win, load Kleopatra, and add the MySQL Release Engineering certificate. Do this by clicking File, Lookup on Server. Type "Mysql Release Engineering" into the search box and press Search.

**Figure 2.1 Kleopatra: Lookup on Server Wizard: Finding a Certificate**

![Shows a search input field titled "Find" with "MySQL Release Engineering" entered. The one result contains the following values: Name=MySQL Release Engineering, E-Mail=mysql-build@oss.oracle.com, Valid From=2021-12-14, Valid Until="Unknown", and Key-ID=467B 942D 3A79 BD29. Available action buttons are: Search, Select All, Deselect All, Details, Import, and Close.](images/gnupg-kleopatra-find-certificate.png)

Select the "MySQL Release Engineering" certificate. The Key-ID must reference "3A79 BD29", or choose Details... to confirm the certificate is valid. Now, import it by clicking Import. When the import dialog is displayed, choose Okay, and this certificate should now be listed under the Imported Certificates tab.

Next, grant trust to the certificate. Select our certificate, then from the main menu select Certificates, Change Certification Power, and click Grant Power.

**Figure 2.2 Kleopatra: Grant Certification Power for MySQL Release Engineering**

![A "Grant Certification Power" dialogue is displayed. Available action buttons are: Grant Power and Cancel.](images/gnupg-kleopatra-grant-certification-power.png)

Next, verify the downloaded MySQL package file. This requires files for both the packaged file, and the signature. The signature file must have the same name as the packaged file but with an appended `.asc` extension, as shown by the example in the following table. The signature is linked to on the downloads page for each MySQL product. You must create the `.asc` file with this signature.

**Table 2.2 MySQL Package and Signature Files for MySQL Server MSI for Microsoft Windows**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>File Type</th> <th>File Name</th> </tr></thead><tbody><tr> <td>Distribution file</td> <td><code>mysql-8.4.6-winx64.msi</code></td> </tr><tr> <td>Signature file</td> <td><code>mysql-8.4.6-winx64.msi.asc</code></td> </tr></tbody></table>

Make sure that both files are stored in the same directory and then run the following command to verify the signature for the distribution file. Load the dialog from File, Decrypt/Verify Files..., and then choose the `.asc` file.

The two most common results look like the following figures; and although the "The data could not be verified." warning looks problematic, the file check passed with success. For additional information on what this warning means, click Show Audit Log and compare it to Section 2.1.4.2, “Signature Checking Using GnuPG”. You may now execute the MSI file.

**Figure 2.3 Kleopatra: the Decrypt and Verify Results Dialog: Success**

![It shows "The data could not be verified", and also shown is key information, such as the KeyID and email address, the key's sign on date, and also displays the name of the ASC file..](images/gnupg-kleopatra-decrypt-okay-sig.png)

Seeing an error such as Verification failed: No Data. means the file is invalid. Do not execute the MSI file if you see this error.

**Figure 2.4 Kleopatra: the Decrypt and Verify Results Dialog: Bad**

![It shows "Verification failed: No data." and also displays the name of the ASC file.](images/gnupg-kleopatra-decrypt-invalid-sig.png)

