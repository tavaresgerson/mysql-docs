#### 2.1.4.2 Verificação de assinaturas usando GnuPG

Outro método de verificar a integridade e autenticidade de um pacote é usar assinaturas criptográficas. Isso é mais confiável do que usar checksums MD5, mas requer mais trabalho.

Assinamos pacotes para download do MySQL com **GnuPG** (GNU Privacy Guard). **GnuPG** é uma alternativa de código aberto ao conhecido Pretty Good Privacy (**PGP**) de Phil Zimmermann. A maioria das distribuições Linux vem com **GnuPG** instalado por padrão. Caso contrário, consulte \[<http://www.gnupg.org/>] para obter mais informações sobre **GnuPG** e como obtê-lo e instalá-lo.

Para verificar a assinatura de um pacote específico, você primeiro precisa obter uma cópia da nossa chave de compilação pública GPG, que você pode baixar em \[<http://pgp.mit.edu/>]<http://pgp.mit.edu/>. A chave que você deseja obter é chamada `mysql-build@oss.oracle.com`. O keyID para pacotes MySQL 8.0.44 e superiores, MySQL 8.4.7 e superiores, e MySQL 9.5.0 e superiores é `B7B3B788A8D3785C`. Depois de obter essa chave, você deve compará-la com o valor da chave seguinte antes de usá-la para verificar pacotes MySQL. Alternativamente, você pode copiar e colar a chave diretamente do texto abaixo.

::: info Note

A chave de compilação pública do GPG para pacotes de versões anteriores do MySQL (keyID `A8D3785C`, `5072E1F5` ou `3A79BD29`), veja Seção 2.1.4.5, Clave de compilação pública do GPG para pacotes arquivados.

:::

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
VmQINBGU2rNoBEACSi5t0nL6/Hj3d0PwsbdnbY+SqLUIZ3uWZQm6tsNhvTnahvPPZ
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

Para importar a chave de compilação para o seu keyring pessoal público GPG, use **gpg --import**. Por exemplo, se você salvou a chave em um arquivo chamado `mysql_pubkey.asc`, o comando de importação parece assim:

```
$> gpg --import mysql_pubkey.asc
gpg: key B7B3B788A8D3785C: public key "MySQL Release Engineering
<mysql-build@oss.oracle.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
```

Você também pode baixar a chave do servidor de chaves públicas usando o id de chave pública, `A8D3785C`:

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

Se você quiser importar a chave em sua configuração RPM para validar pacotes de instalação RPM, você deve ser capaz de importar a chave diretamente:

```bash
$> rpm --import mysql_pubkey.asc
```

Se tiver problemas ou necessitar de informações específicas de RPM, consulte a secção 2.1.4.4, " Verificação de assinatura utilizando RPM " .

Depois de ter baixado e importado a chave de compilação pública, baixe o pacote MySQL desejado e a assinatura correspondente, que também está disponível na página de download. O arquivo de assinatura tem o mesmo nome do arquivo de distribuição com uma extensão `.asc`, como mostrado pelos exemplos na tabela a seguir.

**Tabela 2.1 Arquivos de pacotes e assinaturas do MySQL para arquivos de origem**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Tipo de ficheiro</th> <th>Nome do ficheiro</th> </tr></thead><tbody><tr> <td>Arquivo de distribuição</td> <td>[[<code>mysql-8.4.6-linux-glibc2.28-x86_64.tar.xz</code>]]</td> </tr><tr> <td>Ficheiro de assinatura</td> <td>[[<code>mysql-8.4.6-linux-glibc2.28-x86_64.tar.xz.asc</code>]]</td> </tr></tbody></table>

Verifique se ambos os arquivos estão armazenados no mesmo diretório e execute o seguinte comando para verificar a assinatura do arquivo de distribuição:

```bash
$> gpg --verify package_name.asc
```

Se o pacote baixado for válido, você deve ver uma mensagem semelhante a esta:

```bash
$> gpg --verify mysql-8.4.6-linux-glibc2.28-x86_64.tar.xz.asc
gpg: Signature made Fri 15 Dec 2023 06:55:13 AM EST
gpg:                using RSA key BCA43417C3B485DD128EC6D4B7B3B788A8D3785C
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
```

A mensagem `Good signature` indica que a assinatura do arquivo é válida, quando comparada com a assinatura listada em nosso site. Mas você também pode ver avisos, como este:

```bash
$> gpg --verify mysql-8.4.6-linux-glibc2.28-x86_64.tar.xz.asc
gpg: Signature made Fri 15 Dec 2023 06:55:13 AM EST
gpg:                using RSA key BCA43417C3B485DD128EC6D4B7B3B788A8D3785C
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: BCA4 3417 C3B4 85DD 128E  C6D4 B7B3 B788 A8D3 785C
```

Isso é normal, pois dependem da sua configuração e configuração.

- *gpg: não foram encontradas chaves de confiança final*: Isso significa que a chave específica não é "de confiança final" por você ou sua rede de confiança, o que está bem para fins de verificação de assinaturas de arquivos.
- - AVISO: Esta chave não é certificada com uma assinatura confiável! Não há indicação de que a assinatura pertence ao proprietário. \*: Isso se refere ao seu nível de confiança na sua crença de que você possui nossa chave pública real. Esta é uma decisão pessoal. Idealmente, um desenvolvedor MySQL iria entregar-lhe a chave pessoalmente, mas mais comumente, você o baixou. O download foi adulterado? Provavelmente não, mas esta decisão é de você. Configurar uma rede de confiança é um método para confiar neles.

Consulte a documentação do GPG para obter mais informações sobre como trabalhar com chaves públicas.
