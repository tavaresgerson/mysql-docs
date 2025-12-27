#### 2.1.4.2 Signature Checking Using GnuPG

Another method of verifying the integrity and authenticity of a package is to use cryptographic signatures. This is more reliable than using MD5 checksums, but requires more work.

We sign MySQL downloadable packages with **GnuPG** (GNU Privacy Guard). **GnuPG** is an Open Source alternative to the well-known Pretty Good Privacy (**PGP**) by Phil Zimmermann. Most Linux distributions ship with **GnuPG** installed by default. Otherwise, see <http://www.gnupg.org/> for more information about **GnuPG** and how to obtain and install it.

To verify the signature for a specific package, you first need to obtain a copy of our public GPG build key, which you can download from <http://pgp.mit.edu/>. The key that you want to obtain is named `mysql-build@oss.oracle.com`. The keyID for MySQL 8.0.44 packages and higher, MySQL 8.4.7 and higher, and MySQL 9.5.0 and higher is `B7B3B788A8D3785C`. After obtaining this key, you should compare it with the key following value before using it verify MySQL packages. Alternatively, you can copy and paste the key directly from the text below.

Note

The public GPG build key for earlier MySQL release packages (keyID `A8D3785C`, `5072E1F5` or `3A79BD29`), see Section 2.1.4.5, “GPG Public Build Key for Archived Packages”.

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
mQINBGU2rNoBEACSi5t0nL6/Hj3d0PwsbdnbY+SqLUIZ3uWZQm6tsNhvTnahvPPZ
BGdl99iWYTt2KmXp0KeN2s9pmLKkGAbacQP1RqzMFnoHawSMf0qTUVjAvhnI4+qz
MDjTNSBq9fa3nHmOYxownnrRkpiQUM/yD7/JmVENgwWb6akZeGYrXch9jd4XV3t8
OD6TGzTedTki0TDNr6YZYhC7jUm9fK9Zs299pzOXSxRRNGd+3H9gbXizrBu4L/3l
UrNf//rM7OvV9Ho7u9YYyAQ3L3+OABK9FKHNhrpi8Q0cbhvWkD4oCKJ+YZ54XrOG
0YTg/YUAs5/3//FATI1sWdtLjJ5pSb0onV3LIbarRTN8lC4Le/5kd3lcot9J8b3E
MXL5p9OGW7wBfmNVRSUI74Vmwt+v9gyp0Hd0keRCUn8lo/1V0YD9i92KsE+/IqoY
Tjnya/5kX41jB8vr1ebkHFuJ404+G6ETd0owwxq64jLIcsp/GBZHGU0RKKAo9DRL
H7rpQ7PVlnw8TDNlOtWt5EJlBXFcPL+NgWbqkADAyA/XSNeWlqonvPlYfmasnAHA
pMd9NhPQhC7hJTjCiAwG8UyWpV8Dj07DHFQ5xBbkTnKH2OrJtguPqSNYtTASbsWz
09S8ujoTDXFT17NbFM2dMIiq0a4VQB3SzH13H2io9Cbg/TzJrJGmwgoXgwARAQAB
tDZNeVNRTCBSZWxlYXNlIEVuZ2luZWVyaW5nIDxteXNxbC1idWlsZEBvc3Mub3Jh
Y2xlLmNvbT6JAlQEEwEIAD4CGwMFCwkIBwIGFQoJCAsCBBYCAwECHgECF4AWIQS8
pDQXw7SF3RKOxtS3s7eIqNN4XAUCaPoZowUJB4XTyQAKCRC3s7eIqNN4XAIED/9F
8cSgF+VHilpXe8gSTbVn5sNRnAsIYgMonsGqsrzUOv+3Gy4+e4guhRLe3m1PpQJq
yIQ/upbGptP48YsIY8ix2pyzYr1dB8W1TcNUYcQvTdb8/Exd1nDpLzdwoil7b5W2
r3jpsor/b1cou7vju/ObBbkU5xai4waCMqO9llp3ePQTJBa1RwV01taryGZJa2xR
Ke7k1lwdWINALICIQ0aSfy3Q24lWlj0CRiDxAE7UdbtBaqyr5omqUnOXR5kZdnOf
jyAbsofMuQNSLTUg1hoSunp9llv/ayeaCu54qkmkqG8U5gKUDNnYhLTIto7uf2A8
6Ufr2/P1hiJ6MzvHKEI+xtvalKDm5M+/kwSXTnT4e2ERJ0eBnfxwfJlThcYCWOsy
M1jyRaFqXYKxF+r/bfvXga/C+n7VbDEV9VdXfTEjDiSjoeLzaNkNNaDqrp5k4VSk
ekeGluOhYdXOiBI2oSDAP2dvIcpQYuQIrU3TW2YHRLhrN57IaTeFYCA7ij6k8GdQ
YL15Hub9SavhMQ1qwLTLRp0QeKTvw2y1cZ9yJD3rih3NZq0Ul3rZel7TfDG+TX6n
57mBk2z0zmNGuqLirQr6TUUM0Fvl26Zael5w4n5wRKsUdj3/GjchMGWLlu52s+0M
KuB9nNowTIejuhT57x7H67Ho88eIZaWmFC9psvCHJLkCDQRlNqzaARAAsdvBo8WR
qZ5WVVk6lReD8b6Zx83eJUkV254YX9zn5t8KDRjYOySwS75mJIaZLsv0YQjJk+5r
t10tejyCrJIFo9CMvCmjUKtVbgmhfS5+fUDRrYCEZBBSa0Dvn68EBLiHugr+SPXF
6o1hXEUqdMCpB6oVp6X45JVQroCKIH5vsCtw2jU8S2/IjjV0V+E/zitGCiZaoZ1f
6NG7ozyFep1CSAReZu/sssk0pCLlfCebRd9Rz3QjSrQhWYuJa+eJmiF4oahnpUGk
txMD632I9aG+IMfjtNJNtX32MbO+Se+cCtVc3cxSa/pR+89a3cb9IBA5tFF2Qoek
hqo/1mmLi93Xn6uDUhl5tVxTnB217dBT27tw+p0hjd9hXZRQbrIZUTyh3+8EMfmA
jNSIeR+th86xRd9XFRr9EOqrydnALOUr9cT7TfXWGEkFvn6ljQX7f4RvjJOTbc4j
JgVFyu8K+VU6u1NnFJgDiNGsWvnYxAf7gDDbUSXEuC2anhWvxPvpLGmsspngge4y
l+3nv+UqZ9sm6LCebR/7UZ67tYz3p6xzAOVgYsYcxoIUuEZXjHQtsYfTZZhrjUWB
J09jrMvlKUHLnS437SLbgoXVYZmcqwAWpVNOLZf+fFm4IE5aGBG5Dho2CZ6ujngW
9Zkn98T1d4N0MEwwXa2V6T1ijzcqD7GApZUAEQEAAYkCPAQYAQgAJgIbDBYhBLyk
NBfDtIXdEo7G1Lezt4io03hcBQJo+hmtBQkHhdPTAAoJELezt4io03hcOTAP/2Js
Mj7a1xIeWN35+lvnsVE1t68hhipLUO0/Cj7pV8QsBUlIrs9u6cQ2Qzz5VGTHTd6Y
hrX5xsPP8TUh50DWBx74IeFf8o5WxKlZ3eH0WnO0O96qNKW5BpQRsWNjF1kBWx6l
nSyduMZRUTV4+2EeEciwXiBDPl5kHqW/Q7bGoV0YokwF1CC2igdCmHM+MY97Fpt8
cbzakl8kp2U4Z+fJ9oX467FF355pnEAxO0msZqjgyxolP/EcgIiqufzuRSYXk8te
RsaC7elR+Bpi51CBgyl9EIEpoX/PfIBN3buEbb5zwMNL0PGw6b44oams6P5cMpbz
GWikFGnDJyikVXlJuvaQdAQv7xMBvYU7HcLiYcM4Pt9uVGNEU321QIovFLhx/vH5
7Df+Fxx8FfHFP3MjVPzmldGHL67tUvquCTSxB/8fwEfA4b5abZwNy3E10DYhL4w5
PjzXl4/kbnVpZwtuyS5qMNg9n6cEWiSo15ldzV5iHTyprXx3RhO6krpJUFAcbCEw
r2LmI2XYZguvGCSFm3LCuf4g7GDJ1u3RAtivCNCQ4sVgTLPoCNGW90Unf44s3vzm
WDREXgkzSZthslxJHPE5y3Kh0qM1jQSuN+VNVHLGriOaOlYRtZoGGStONYhlBCoJ
udMv77etKsN/mPdhJotVLMUpzeespcu5G2qqc5zt
=6wRS
-----END PGP PUBLIC KEY BLOCK-----
```

To import the build key into your personal public GPG keyring, use **gpg --import**. For example, if you have saved the key in a file named `mysql_pubkey.asc`, the import command looks like this:

```
$> gpg --import mysql_pubkey.asc
gpg: key B7B3B788A8D3785C: public key "MySQL Release Engineering
<mysql-build@oss.oracle.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
```

You can also download the key from the public keyserver using the public key id, `A8D3785C`:

```
$> gpg --recv-keys B7B3B788A8D3785C
gpg: requesting key B7B3B788A8D3785C from hkp server keys.gnupg.net
gpg: key B7B3B788A8D3785C: "MySQL Release Engineering <mysql-build@oss.oracle.com>"
1 new user ID
gpg: key B7B3B788A8D3785C: "MySQL Release Engineering <mysql-build@oss.oracle.com>"
53 new signatures
gpg: no ultimately trusted keys found
gpg: Total number processed: 1
gpg:           new user IDs: 1
gpg:         new signatures: 53
```

If you want to import the key into your RPM configuration to validate RPM install packages, you should be able to import the key directly:

```
$> rpm --import mysql_pubkey.asc
```

If you experience problems or require RPM specific information, see Section 2.1.4.4, “Signature Checking Using RPM”.

After you have downloaded and imported the public build key, download your desired MySQL package and the corresponding signature, which also is available from the download page. The signature file has the same name as the distribution file with an `.asc` extension, as shown by the examples in the following table.

**Table 2.1 MySQL Package and Signature Files for Source files**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>File Type</th> <th>File Name</th> </tr></thead><tbody><tr> <td>Distribution file</td> <td><code class="literal">mysql-9.5.0-linux-glibc2.28-x86_64.tar.xz</code></td> </tr><tr> <td>Signature file</td> <td><code class="literal">mysql-9.5.0-linux-glibc2.28-x86_64.tar.xz.asc</code></td> </tr></tbody></table>

Make sure that both files are stored in the same directory and then run the following command to verify the signature for the distribution file:

```
$> gpg --verify package_name.asc
```

If the downloaded package is valid, you should see a `Good signature` message similar to this:

```
$> gpg --verify mysql-9.5.0-linux-glibc2.28-x86_64.tar.xz.asc
gpg: Signature made Fri 15 Dec 2023 06:55:13 AM EST
gpg:                using RSA key BCA43417C3B485DD128EC6D4B7B3B788A8D3785C
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
```

The `Good signature` message indicates that the file signature is valid, when compared to the signature listed on our site. But you might also see warnings, like so:

```
$> gpg --verify mysql-9.5.0-linux-glibc2.28-x86_64.tar.xz.asc
gpg: Signature made Fri 15 Dec 2023 06:55:13 AM EST
gpg:                using RSA key BCA43417C3B485DD128EC6D4B7B3B788A8D3785C
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: BCA4 3417 C3B4 85DD 128E  C6D4 B7B3 B788 A8D3 785C
```

That is normal, as they depend on your setup and configuration. Here are explanations for these warnings:

* *gpg: no ultimately trusted keys found*: This means that the specific key is not "ultimately trusted" by you or your web of trust, which is okay for the purposes of verifying file signatures.

* *WARNING: This key is not certified with a trusted signature! There is no indication that the signature belongs to the owner.*: This refers to your level of trust in your belief that you possess our real public key. This is a personal decision. Ideally, a MySQL developer would hand you the key in person, but more commonly, you downloaded it. Was the download tampered with? Probably not, but this decision is up to you. Setting up a web of trust is one method for trusting them.

See the GPG documentation for more information on how to work with public keys.
